  defmodule CaptureWeb.GamesChannel do
  use CaptureWeb, :channel
  alias Capture.GameBackup
  alias Capture.Game
  alias Capture.GamesList

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
    cond do
      payload["win_percent"] in 0..24 ->
        {players, channelNo} = GamesList.load(1)
        if Enum.member?(players, payload["user_id"]) do
          players = List.delete(players, payload["user_id"])
          GamesList.save(1, {players, channelNo})
        end
      payload["win_percent"] in 25..49 ->
        {players, channelNo} = GamesList.load(2)
        if Enum.member?(players, payload["user_id"]) do
          players = List.delete(players, payload["user_id"])
          GamesList.save(2, {players, channelNo})
        end
      payload["win_percent"] in 50..74 ->
        {players, channelNo} = GamesList.load(3)
        if Enum.member?(players, payload["user_id"]) do
          players = List.delete(players, payload["user_id"])
          GamesList.save(3, {players, channelNo})
        end
      payload["win_percent"] in 75..100 ->
        {players, channelNo} = GamesList.load(4)
        if Enum.member?(players, payload["user_id"]) do
          players = List.delete(players, payload["user_id"])
          GamesList.save(4, {players, channelNo})
        end
    end
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
