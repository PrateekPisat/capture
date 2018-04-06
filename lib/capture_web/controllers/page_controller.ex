defmodule CaptureWeb.PageController do
  use CaptureWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
