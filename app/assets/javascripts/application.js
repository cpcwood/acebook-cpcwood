// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require_tree .
//= require jquery
//= require bootstrap-sprockets

window.addEventListener('load', function() {
  // =========================
  // Logout audio
  // =========================
  logoutAudio = document.querySelector('.logoutAudio')
  clickHandler = function(event) {
    event.preventDefault()
    self = this
    logoutAudio.addEventListener('ended', function() {
      self.removeEventListener('click', clickHandler)
      self.click()
    })
    logoutAudio.currentTime = 0
    logoutAudio.play()
  }
  document.querySelector('#logoutBtn').addEventListener('click', clickHandler)

  // =========================
  // Chat functionality
  // =========================

  // xmlGET
  var httpGet = function(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText)
    }
    xmlHttp.open("GET", theUrl, true)
    xmlHttp.send(null)
  }
  // ===========


  // Chat button
  startChatBtn = document.querySelector('.open-chat')
  if (startChatBtn) {
    // Create click hander
    startChatClickHandler = function () {
      httpGet('/users/index.json', function(data) {
        jsonData = JSON.parse(data)
        console.log(jsonData)
        chatList = document.querySelector('.chat-list')
        chatList.innerHTML = ''
        jsonData.forEach(function(message) {
          chatBtnHTML = `
          <div class='open-convo-container'>
            <button class='open-convo-btn' data_user='${message['id']}'>${message['username']}</button>
          </div>
          `
          chatList.insertAdjacentHTML('beforeend', chatBtnHTML)
        })
      })

      // Show chat list container
      chatListContainer = document.querySelector('.chat-list-container')
      chatListContainer.style.display = 'block'

      // Remove show click event
      this.removeEventListener('click', startChatClickHandler)

      // Add event listener to hide container and then show again 
      hideChatList = function() {
        chatListContainer.style.display = 'none'
        startChatBtn.removeEventListener('click', hideChatList)
        startChatBtn.addEventListener('click', startChatClickHandler)
      }
      this.addEventListener('click', hideChatList)

    }

    startChatBtn.addEventListener('click', startChatClickHandler)
  }
})