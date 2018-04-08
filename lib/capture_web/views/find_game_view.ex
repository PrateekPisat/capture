defmodule CaptureWeb.FindGameView do
  use CaptureWeb, :view

  def render("channelNo.json", %{channel_no: channelNo}) do
    %{
      channel_no: channelNo,
    }
  end
end
