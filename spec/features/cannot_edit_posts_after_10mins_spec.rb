require 'rails_helper'

RSpec.feature 'Users can edit a post that has been created', type: :feature do
  scenario 'User edits a post' do
    visit('/')
    click_on('Signup')
    fill_in('user[email]', with: 'test@example.com')
    fill_in('user[password]', with: 'password')
    click_on('Signup')
    click_on 'New Post'
    fill_in 'post[post_content]', with: 'Hesyy thesareasdf'
    click_on 'Create Post'
    expect(page).to have_content('Hesyy thesareasdf')
    x = Time.now + 660
    travel_to(x)
    click_on 'Edit'
    expect(page).to have_content('Not authorized to update this post')
  end
end