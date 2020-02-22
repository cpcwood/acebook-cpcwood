class Conversation < ApplicationRecord
  has_many :messages, dependent: :restrict_with_exception
end
