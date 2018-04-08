defmodule CaptureWeb.UserView do
  use CaptureWeb, :view
  alias CaptureWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      name: user.name,
      email: user.email,
      #password_hash: user.password_hash,
      win_percent: user.win_percent}
  end
end
