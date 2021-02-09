require 'sinatra'
require 'jwt'
require 'json'
require 'securerandom'
require 'dotenv/load'

# Schema:
# User: key: string (username), value: string (password) --- We hate security! We will store passwords in plaintext!
# Event: event: string, data: Hash, id: string (uuid)
# ConnectedUser: key: string (username), value: (Sinatra connection object?)

NEW_CONNECTION_EVENT_TYPES = Set.new(%w[Message ServerStatus])

configure do
  $users = Hash.new
  $connected_users = Hash.new
  $events = []

  $broadcast_queue = Queue.new # Using a separate thread for broadcasting to avoid blocking other things badly
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
  $broadcast_queue << {
      data: {
          status: "The server is alive. It doesn't know how to feel about that.",
          created: Time.now.to_f
      },
      event: "ServerStatus",
      id: SecureRandom.uuid
  }
  EventMachine.schedule do
    EventMachine.add_periodic_timer(15) do
      $broadcast_queue << {
          event: "Heartbeat"
      }
    end
    EventMachine.add_periodic_timer(60 * 5) do
      $broadcast_queue << {
          data: {
              status: "Rumors of the server's demise have been greatly exaggerated.",
              created: Time.now.to_f
          },
          event: "ServerStatus",
          id: SecureRandom.uuid
      }
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

def get_users_event
  {
      data: {
          users: $connected_users.keys,
          created: Time.now.to_f
      },
      event: "Users",
      id: SecureRandom.uuid
  }
end

get '/stream/:token' do
  content_type 'text/event-stream'
  decoded_username = ""
  begin
    decoded_username = (JWT.decode params[:token], ENV['JWT_SECRET'])[0]["data"]
  rescue
    halt 403
  end
  stream(true) do |connection|
    found_existing_user = $connected_users.key? decoded_username
    if found_existing_user
      disconnect_event = {
          data: {
              created: Time.now.to_f
          },
          event: "Disconnect",
          id: SecureRandom.uuid
      }
      old_connection = $connected_users[decoded_username]
      $connected_users[decoded_username] = connection
      send_event old_connection, disconnect_event
      send_event connection, get_users_event
      old_connection.close
    else
      $connected_users[decoded_username] = connection
      $broadcast_queue << {
          data: {
              user: decoded_username,
              created: Time.now.to_f
          },
          event: "Join",
          id: SecureRandom.uuid
      }
      $broadcast_queue << get_users_event
    end
    send_new_client_events(connection)
    connection.callback { handle_user_disconnect(decoded_username, connection) }
    status 200
  end
end

def send_new_client_events(connection)
  starting_message_reached = request.env["HTTP_LAST_EVENT_ID"].nil?
  $events.select do |event|
    if event[:id] == request.env["HTTP_LAST_EVENT_ID"]
      starting_message_reached = true
      next false
    end
    starting_message_reached && NEW_CONNECTION_EVENT_TYPES.include?(event[:event])
  end.each { |event| send_event connection, event, false }
end

def handle_user_disconnect(decoded_username, connection)
  puts "I am disconnecting #{decoded_username}"
  if $connected_users[decoded_username] == connection
    $broadcast_queue << {
        data: {
            user: decoded_username,
            created: Time.now.to_f
        },
        event: "Part",
        id: SecureRandom.uuid
    }
    $connected_users.delete(decoded_username)
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
  if event_object[:event] == "Heartbeat"
    connection << "\n"
    return
  end
  if record_event
    $events << event_object
    $events.shift if $events.size > 100
  end
  connection << "data: #{JSON.dump event_object[:data]}\n"
  connection << "event: #{event_object[:event]}\n"
  connection << "id: #{event_object[:id]}\n\n"
end