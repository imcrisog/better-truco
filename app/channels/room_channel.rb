require 'redis'
require 'json'

class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_for params[:room]
  end

  def unsubscribed
    if REDIS.get(params[:room]).nil? or REDIS.get(params[:room]).blank? or REDIS.get(params[:room]).empty?
      return stop_stream_for params[:room]
    end

    room = JSON.parse REDIS.get(params[:room])

    if room['onusers'] == 1
      REDIS.del(room['id'])
    else
      room['onusers'] = room['onusers'] - 1
      finallyroom = JSON room

      REDIS.set(room['id'], finallyroom)
      puts REDIS.get(room['id'])
    end

    stop_stream_for params[:room]
  end
end
