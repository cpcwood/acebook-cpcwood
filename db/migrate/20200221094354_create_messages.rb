class CreateMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :messages do |t|
      t.integer :sender_id_fk
      t.integer :receiver_id_fk
      t.text :message_content
      t.timestamps
    end
  end
end
