RSpec.feature 'Users can edit a post that has been created', type: :feature, js: true do
  scenario 'User edits a post' do
    visit('/')
    click_on('Signup')
    fill_in('user[username]', with: 'user1')
    page.select('Kashyyyk', from: 'user[planet]')
    fill_in('user[email]', with: 'test@example.com')
    fill_in('user[password]', with: 'password')
    click_on('Join the Rebel Alliance')
    click_on('Open Chat')
    click_on('user1')
    fill_in('message-text-user1', with: 'test-string')
    click_on('Send Message')
    expect(page).to have_content('Theres no messages here, say hello to your friend!')
  end
end