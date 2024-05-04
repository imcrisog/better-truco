require "json"
require 'ostruct'
require 'rubygems'
require 'redis'

class RoomsController < ApplicationController

  def make
    id = SecureRandom.uuid

    file = File.read('./sample.json')
    json_object = JSON.parse(file)
    mycards = json_object["spain"].shuffle

    room = JSON[
      :id => id,
      :name => params[:name],
      :maxusers => params[:qusers],
      :onusers => [],
      :nexttep => '',
      :cards => mycards
    ]

    REDIS.set(id, room)
    # REDIS.get(room[id])

    return render json: { id: id }, status: :ok
  end

  def create
    if REDIS.get(params[:room]).nil? or REDIS.get(params[:room]).blank? or REDIS.get(params[:room]).empty?
      return render json: { error: 'not ok' }
    end

    roomo = JSON.parse REDIS.get(params[:room])
    @user = params[:user]

    # return render json: roomo

    if @user.in?(roomo['onusers'])
      return render json: { error: 'youre on sala' }
    end

    if roomo['onusers'].length >= roomo['maxusers']
      return render json: { error: 'no blank spaces' }
    end

    mycards = roomo['cards']

    @cards = []
    @cards.push(mycards.shift)
    @cards.push(mycards.shift)
    @cards.push(mycards.shift)

    roomo['cards'] = mycards
    roomo['onusers'].push(@user)

    finallyroom = JSON roomo
    REDIS.set(roomo['id'], finallyroom)
    puts REDIS.get(params[:room])

    @data = ["r", @user, @cards, roomo['name']]

    RoomChannel.broadcast_to(params[:room], @data)
    return render json: { content: 'connection success to', data: @data }, status: :ok
  end

  def senderdata
      @cardid = params[:card]
      file = File.read('./sample.json')
      json_object = JSON.parse(file)

      card = json_object["spain"][@cardid.to_i]
      card["who"] = params[:who]
      @data = ["s", card]

      RoomChannel.broadcast_to(params[:room], @data)
      return render json: @data, status: :ok
  end
end
