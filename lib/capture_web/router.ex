defmodule CaptureWeb.Router do
  use CaptureWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", CaptureWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/landing", PageController, :index
    get "/users/new", PageController, :index
    get "/gamepage", PageController, :index
  end

  # Other scopes may use custom stacks.
   scope "/api/v1", CaptureWeb do
     pipe_through :api

     resources "/users", UserController, except: [:new, :edit]
     post "/session", SessionController, :create
     post "/newgame", FindGameController, :findGame
   end
end
