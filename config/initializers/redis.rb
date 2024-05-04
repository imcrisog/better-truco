require 'redis'

redis_host = 'redis'
redis_port = 6379

REDIS = Redis.new(host: redis_host, port: redis_port.to_i)