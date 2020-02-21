class CreateConversations < ActiveRecord::Migration[5.2]
  def change
    create_table :conversations do |t|
      t.integer :user_1_id_fk
      t.integer :user_2_id_fk
    end
  end
end
