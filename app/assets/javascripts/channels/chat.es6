// app/assets/javascripts/channels/chat.js

//= require cable
//= require_self
//= require_tree .

this.App = {};

App.cable = ActionCable.createConsumer(); 

convoSubs = {}

window.addEventListener("beforeunload", function(e){
  convoSubs.values.forEach(function(sub) {
    sub.unsubscribe()
  })
}, false);


window.addEventListener('load', function() {

  // =========================
  // Chat functionality
  // =========================
  // - still requires OOD

  // Chat button
  startChatBtn = document.querySelector('.open-chat')
  if (startChatBtn) {
    // Create click hander
    startChatClickHandler = function () {

      // Add event delegation to hide show conversations upon click
      var conversationsContainer = document.querySelector('.conversations_container')

      conversationsContainer.addEventListener('click', function(e) {
        var toggleVisible = function(item) {
          if (item.style.display == 'none') {
            item.style.display = 'flex'
          }
          else {
            item.style.display = 'none'
          }
        }
        if(e.target && e.target.matches("button.conversation-btn")) {
          var conversationContainer = e.target.parentNode
          var conversation = conversationContainer.querySelector('.conversation')
          toggleVisible(conversation)
        }
      })

      httpGet('/users/index.json', function(data) {
        var jsonData = JSON.parse(data)
        var chatList = document.querySelector('.chat-list')
        chatList.innerHTML = '';
        jsonData.forEach(function(message) {
          var chatBtnHTML = `<div class='open-convo-container'>
            <button class='open-convo-btn' data_user_id='${message['id']}' data_username='${message['username']}'>${message['username']}</button>
          </div>
          `;
          chatList.insertAdjacentHTML('beforeend', chatBtnHTML)
        })

        // event listner for clicking open conversation
        openConvoClickHandler = function() {
          // Get required data for conversation
          var userId = this.getAttribute('data_user_id')
          var username = this.getAttribute('data_username')
          var chatFooter = document.querySelector('.chat-footer-container')
          var chatsContainer = document.querySelector('.chats-container')

          // Create conversation div - change this to be real divs the apply event listeners to those inserted
          var convoHTML = `
            <div class='conversation-container' id='${username}'>
              <button class='conversation-btn'>${username}</button>
              <div class='conversation'> 
                <div class='actions-container'>
                  <textarea class='message-text' id='message-text-${username}'></textarea>
                  <button class='send-message' data_to_user_id='${userId}'>Send Message</button>
                </div>
                <div class='messages-container'>

                </div>
              </div>
            </div>
          `
          conversationsContainer.insertAdjacentHTML('beforeend', convoHTML)
          
          

          // conversationBtns = document.getElementsByClassName('conversation-btn')
          // for (var i = 0; i < conversationBtns.length; i++) {
          //   conversationBtns[i].addEventListener('click', hideConvo)
          // }
          console.log('before get')
          var chatContainer = document.querySelector(`#${username}`)
          console.log(chatContainer)

          // Ajax for last 30 messages
          httpGet(`/conversation/${userId}`, function(data) {
            console.log('after get')
            var jsonData = JSON.parse(data)
            console.log(jsonData)
            var messageData = jsonData[1]
            var convoId = jsonData[0]['convo_id']
            var chatContainer = document.querySelector(`#${username}`)
            var sendBtn = chatContainer.querySelector('.send-message')
            sendBtn.setAttribute('data_convo_id', convoId)
            console.log(sendBtn)
            
            var messagesContainer = chatContainer.querySelector('.messages-container')

            messageData.forEach(function(message) {
              if (message['id'] == 0) {
                var messageHTML = `<div class='no-message message'>
                  ${message['message_content']}
                </div>
                `
              }
              else {
                if (message['sender_id_fk'] == userId) {
                  var messageClass = 'message-recieved'
                }
                else {
                  var messageClass = 'message-sent'
                }
                var dateStr = (new Date(message['created_at'])).toUTCString()
                var messageHTML = `<div class='${messageClass} message'>
                    <div class='message-time'> ${dateStr} </div>
                    <div class='message-content'> ${message['message_content']} </div>
                  </div>
                `
              }
              messagesContainer.insertAdjacentHTML('beforeend', messageHTML)
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            })
            // Subscribe to cable channel

            var sub = App.cable.subscriptions.create({ channel: "MessagesChannel", convo_id: convoId }, {
              received(data) {
                if (data['from_user'] == userId) {
                  var messageClass = 'message-recieved'
                }
                else {
                  var messageClass = 'message-sent'
                }
                var dateStr = (new Date(data['created_at'])).toUTCString()
                var messageHTML = `<div class='${messageClass} message'>
                    <div class='message-time'> ${dateStr} </div>
                    <div class='message-content'> ${data['content']} </div>
                  </div>
                `
                messagesContainer.insertAdjacentHTML('beforeend', messageHTML)
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
              }
            })
            
            convoSubs[username] = sub
            // End of get for last 30 messages ^^^^^^^^^^^^^^^^^^
          })

          // Event listener for send message
          var sendMessage = function(){
            var toUser = this.getAttribute('data_to_user_id')
            var convoId = this.getAttribute('data_convo_id')
            var actionsContainer = this.parentNode
            var textbox = actionsContainer.querySelector('.message-text')
            var text = textbox.value
            textbox.value = ''
            var messageData = {'message': {'convo_id': convoId, 'to_user': toUser, 'message-content': text}}
            $.ajax({ url: '/message',
              type: 'POST',
              beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
              data: JSON.stringify(messageData)
            });
          }

          var sendMessageObjs = document.getElementsByClassName("send-message")
          for (var i = 0; i < sendMessageObjs.length; i++) {
              sendMessageObjs[i].addEventListener('click', sendMessage, false)
          }

          // remove click handler and add one to close conversation
          closeConvoClickHandler = function() {
            // close conversation connection
            convoSubs[username].unsubscribe()

            // delete conversation node
            document.querySelector(`#${username}`).remove()

            // add open convo event listner back onto button
            this.addEventListener('click', openConvoClickHandler)
          }

          this.removeEventListener('click', openConvoClickHandler)
          this.addEventListener('click', closeConvoClickHandler)

          // End of click on start convo ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        }

        openConvoObjs = document.getElementsByClassName('open-convo-btn')
        for (var i = 0; i < openConvoObjs.length; i++) {
          openConvoObjs[i].addEventListener('click', openConvoClickHandler)
        }

        // End of ajax on users ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      })

      // Show chat list container
      var chatListContainer = document.querySelector('.chat-list-container')
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