defmodule CaptureWeb.GamesChannel do
  use CaptureWeb, :channel
  alias Capture.GameBackup
  alias Capture.Game

  def join("games:" <> channel_no, payload, socket) do
    if authorized?(payload) do
      game = GameBackup.load(channel_no) || Game.new(channel_no)
      socket = socket
      |> assign(:channel_no, channel_no)
      GameBackup.save(channel_no, game)
      {:ok, %{"game" => game}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("addUser", payload, socket) do
    game = Game.addPlayer(payload["user_id"], GameBackup.load(socket.assigns[:channel_no]))
    GameBackup.save(socket.assigns[:channel_no], game)
    broadcast socket, "shout", %{"game" => game}
    {:noreply, socket}
  end

  def handle_in("deleteUser", payload, socket) do
    game = Game.removePlayer(payload["user_id"], GameBackup.load(socket.assigns[:channel_no]))
    GameBackup.save(socket.assigns[:channel_no], game)
    broadcast socket, "shout", %{"game" => game}
    {:noreply, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
