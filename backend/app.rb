require 'sinatra'
require 'jwt'
require 'json'
require 'securerandom'
require 'dotenv/load'

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
      $events << broadcast_event
      $events.shift if $events.size > 100
      $connected_users.each do |_, connection|
        send_event connection, broadcast_event, false
      end
    end
  end
end

before do
  content_type 'application/json'
  headers 'Access-Control-Allow-Origin' => '*'
  headers 'Access-Control-Allow-Headers' => '*'
end

options '/message' do
  headers 'Access-Control-Allow-Methods' => "POST"
  status 200
end

post '/message' do
  decoded_token_user = ""
  begin
    token = /^Bearer (.+)/.match(request.env["HTTP_AUTHORIZATION"])[1]
    decoded_token_user = (JWT.decode token, ENV['JWT_SECRET'])[0]["data"]
  rescue => e
    halt 403
  end
  halt 422 if params[:message].nil? || params[:message].empty?
  $broadcast_queue << {
      data: {
          message: params[:message],
          created: Time.now.to_f,
          user: decoded_token_user
      },
      event: "Message",
      id: SecureRandom.uuid
  }
  status 201
end

get '/stream/:token' do
  content_type 'text/event-stream'
  decoded_username = ""
  begin
    decoded_username = (JWT.decode params[:token], ENV['JWT_SECRET'])[0]["data"]
  rescue
    halt 403
  end
  found_existing_user = $connected_users.key? decoded_username
  if found_existing_user
    disconnect_event = {
        data: {
            created: Time.now.to_f
        },
        event: "Disconnect",
        id: SecureRandom.uuid
    }
    send_event $connected_users[decoded_username], disconnect_event
  end
  stream(true) do |connection|
    $connected_users[decoded_username] = connection
    connection.callback do
      unless found_existing_user
        $broadcast_queue << {
            data: {
                user: decoded_username,
                created: Time.now.to_f
            },
            event: "Part",
            id: SecureRandom.uuid
        }
      end
      $connected_users.delete(decoded_username)
    end
    unless found_existing_user
      $broadcast_queue << {
          data: {
              user: decoded_username,
              created: Time.now.to_f
          },
          event: "Join",
          id: SecureRandom.uuid
      }
      $broadcast_queue << {
          data: {
              users: $connected_users.keys,
              created: Time.now.to_f
          },
          event: "Users",
          id: SecureRandom.uuid
      }
    end
    status 200
  end
end

post '/login' do
  halt 422 if params[:username].nil? || params[:username].empty? || params[:password].nil? || params[:password].empty?
  if $users.key? params[:username]
    halt 403 if params[:password] != $users[params[:username]]
  else
    $users[params[:username]] = params[:password]
  end
  curr_time = Time.now.to_i
  payload = {
      data: params[:username],
      exp: curr_time + 9999999, # Expires in like 3 years
      nbf: curr_time
  }
  token = JWT.encode payload, ENV['JWT_SECRET'], 'HS256'
  status 201
  body JSON.dump({token: token})
end

def send_event(connection, event_object, record_event = true)
  if record_event
    $events << event_object
    $events.shift if $events.size > 100
  end
  connection << "data: #{JSON.dump event_object[:data]}\n"
  connection << "event: #{event_object[:event]}\n"
  connection << "id: #{event_object[:id]}\n\n"
end