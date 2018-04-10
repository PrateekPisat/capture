defmodule CaptureWeb.FindGameController do
  use CaptureWeb, :controller
  alias Capture.GamesList

  action_fallback CaptureWeb.FallbackController

  def findGame(conn, %{"win_percent" => win_percent, "user_id" => user_id}) do
    cond do
      win_percent in 0..24 ->
        {players, channelNo} = GamesList.load(1) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
        if !Enum.member?(players, user_id) do
          players = players ++ [user_id]
        end
        if length(players) <= 8 do
          GamesList.save(1, {players, channelNo})
          conn
          |> put_status(:created)
          |> render("channelNo.json", channel_no: channelNo)
        else
          players = [user_id]
          channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
          GamesList.save(1, {players, channelNo})
          conn
          |> put_status(:created)
          |> render("channelNo.json", channel_no: channelNo)
        end
      win_percent in 25..49 ->
        {players, channelNo} = GamesList.load(2) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
        if !Enum.member?(players, user_id) do
          players = players ++ [user_id]
        end
        if length(players) <= 8 do
          GamesList.save(2, {players, channelNo})
          conn
          |> put_status(:created)
          |> render("channelNo.json", channel_no: channelNo)
        else
          players = [user_id]
          channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
          GamesList.save(2, {players, channelNo})
          conn
          |> put_status(:created)
          |> render("channelNo.json", channel_no: channelNo)
        end
      win_percent in 50..74 ->
        {players, channelNo} = GamesList.load(3) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
        if !Enum.member?(players, user_id) do
          players = players ++ [user_id]
        end
        if length(players) <= 8 do
          GamesList.save(3, {players, channelNo})
          conn
          |> put_status(:created)
          |> render("channelNo.json", channel_no: channelNo)
        else
          players = [user_id]
          channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
          GamesList.save(3, {players, channelNo})
          conn
          |> put_status(:created)
          |> render("channelNo.json", channel_no: channelNo)
        end
      win_percent in 75..100 ->
        {players, channelNo} = GamesList.load(4) || {[], Enum.random(0.. Kernel.trunc(:math.pow(9,5)))}
        if !Enum.member?(players, user_id) do
          players = players ++ [user_id]
        end
        if length(players) <= 8 do
          GamesList.save(4, {players, channelNo})
          conn
          |> put_status(:created)
          |> render("channelNo.json", channel_no: channelNo)
        else
          players = [user_id]
          channelNo = Enum.random(0.. Kernel.trunc(:math.pow(9,5)))
          GamesList.save(4, {players, channelNo})
          conn
          |> put_status(:created)
          |> render("channelNo.json", channel_no: channelNo)
        end
    end
  end
end
