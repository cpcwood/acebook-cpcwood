class ConversationsController < ApplicationController
  def show
    sender_id = session[:user_id]
    reciever_id = params[:to_user_id]
    @conversation = Conversation.find_by(user_1_id_fk: sender_id, user_2_id_fk: reciever_id)
    if @conversation == nil
      @conversation = Conversation.find_by(user_1_id_fk: reciever_id, user_2_id_fk: sender_id)
    end
    if @conversation == nil
      @conversation = Conversation.create(user_1_id_fk: sender_id, user_2_id_fk: reciever_id)
    end
    @messages = @conversation.messages.limit(30)
    respond_to do |format|
      format.json do
        if @messages.empty?
          render json: [{id: 0, message_content: "Theres no messages here, say hello to your friend!",}].to_json
        else
          render json: @messages.to_json
        end
      end
    end
  end
end
