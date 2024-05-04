Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  mount ActionCable.server => "/cable"

  # Defines the root path route ("/")
  root "rooms#index"
  post "/room/create", to: "rooms#make"
  post "/room", to: "rooms#create"
  post "/room/send", to: "rooms#senderdata"
end
