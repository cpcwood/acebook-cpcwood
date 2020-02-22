class MessagesChannel < ApplicationCable::Channel
  def subscribed
    stream_for params['convo_id'].to_s
  end
end
