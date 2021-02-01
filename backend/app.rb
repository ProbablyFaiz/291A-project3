require 'sinatra'
require 'jwt'
require 'json'
require 'securerandom'

# Schema:
# User: key: string (username), value: string (password) --- We hate security! We will store passwords in plaintext!
# Event: event: string, data: Hash, id: string (uuid)
# ConnectedUser: key: string (username), value: (Sinatra connection object?)

# TODO: Implement some kind of broadcast thread with a queue to avoid blocking in the main thread on sending messages etc.

configure do
  $users = Hash.new
  $connected_users = Hash.new
  $events = []

  $broadcast_queue = Queue.new
  Thread.new do
    loop do
      broadcast_event = $broadcast_queue.deq
      $connected_users.each do |_, connection|
        send_event connection, broadcast_event
      end
    end
  end
end

before do
  content_type 'application/json'
end

post '/message' do
  decoded_token_user = ""
  begin
    token = /^Bearer (.+)/.match(event["headers"]["authorization"])[1]
    decoded_token_user = (JWT.decode token, ENV['JWT_SECRET'])[0]
  rescue
    halt 403
  end
  halt 422 if params[:message].nil? || params[:message].empty?
  message_event = {
      data: {
          message: params[:message],
          created: Time.now.to_f,
          user: decoded_token_user
      },
      event: "Message",
      id: SecureRandom.uuid
  }
  $events << message_event
  $connected_users.each do |_, connection|
    send_event(connection, message_event)
  end
  status 201
end

get '/stream/:token', provides: 'text/event-stream' do
  decoded_token = []
  begin
    decoded_token = JWT.decode params[:token], ENV['JWT_SECRET']
  rescue
    halt 403
  end
  stream(:keep_open) do |connection|
    $connected_users[decoded_token[0]] = connection
    # Send everything the user needs to know
  end

  status 200
end

post '/login' do
  halt 422 if params[:username].nil? || params[:username].empty? || params[:password].nil? || params[:password].empty?
  curr_time = Time.now.to_i
  payload = {
      data:  params[:username],
      exp: curr_time + 9999999, # Expires in like 3 years
      nbf: curr_time
  }
  token = JWT.encode payload, ENV['JWT_SECRET'], 'HS256'
  status 201
  body JSON.dump({token: token})
end

def send_event(connection, event_object)
  connection << "data: #{JSON.dump(event_object[:data])}\n"
  connection << "event: #{event_object[:event]}\n"
  connection << "id: #{event_object[:id]}\n\n"
end