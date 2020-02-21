class MessagesController < ApplicationController
  def create
    message = JSON.parse(request.body.read)['message']
    p message
    p convo_id = message['convo_id']
    p to_user = message['to_user']
    p from_user = session[:user_id]
    p content = message['message-content']
    p @message = Message.create(conversation_id: convo_id, sender_id_fk: from_user, receiver_id_fk: to_user, message_content: content)
    # p @message.save

  end
end
