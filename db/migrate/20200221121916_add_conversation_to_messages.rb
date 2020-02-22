class AddConversationToMessages < ActiveRecord::Migration[5.2]
  def change
    add_reference :messages, :conversation, index: true, foreign_key: true
  end
end
