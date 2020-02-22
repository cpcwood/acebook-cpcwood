class ConversationsController < ApplicationController
  def show
    sender_id = session[:user_id]
    reciever_id = params[:to_user_id]
    @conversation = Conversation.find_by(user_1_id_fk: sender_id, user_2_id_fk: reciever_id)
    @conversation = Conversation.find_by(user_1_id_fk: reciever_id, user_2_id_fk: sender_id) if @conversation.nil?
    @conversation = Conversation.create(user_1_id_fk: sender_id, user_2_id_fk: reciever_id) if @conversation.nil?
    @messages = @conversation.messages.limit(30)
    @messages = (@messages.empty? ? [{ id: 0, message_content: 'Theres no messages here, say hello to your friend!' }] : @messages)
    respond_to do |format|
      format.json do
        render json: [{ convo_id: @conversation.id }, @messages.to_json]
      end
    end
  end
end
