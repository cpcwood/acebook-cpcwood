class EmailValidator < ActiveModel::Validator
  EMAIL_REGEXP = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i.freeze

  def self.validate?(email)
    email.match?(EMAIL_REGEXP)
  end

  def validate(user)
    user.errors.add(:email, 'Email format invalid, please enter valid email') unless user.email.match?(EMAIL_REGEXP)
  end
end

# require 'resolv'
#   def domain(user)
#     domain = user.email.match(/(?<=@)(.+)/)[0]
#     mx = Resolv::DNS.open { |dns| dns.getresources(domain, Resolv::DNS::Resource::IN::MX) }
#     ok = mx.size > 0
#     user.errors.add(:email, 'Email format invalid, please enter valid email') unless ok
#   end
