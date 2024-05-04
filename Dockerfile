FROM ruby:3.1.4

WORKDIR /app

RUN apt-get update && \
    apt-get install -y nodejs && \
    gem install bundler:2.4.10

COPY Gemfile Gemfile.lock ./

RUN bundle install

COPY . .

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]