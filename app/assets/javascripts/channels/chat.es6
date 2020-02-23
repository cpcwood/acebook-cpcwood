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
  startChatBtn = document.querySelector('.open_chat')

  if (startChatBtn) {

    // Add click handler to button
    startChatClickHandler = function () {

      // Toggle visibility of DOM element
      var toggleVisible = function(item) {
        if (item.style.display == 'none') {
          item.style.display = 'flex'
        }
        else {
          item.style.display = 'none'
        }
      }

      // Method to generate divs
      var generateNode = function(elType, attrHash) {
        var el = document.createElement(elType)
        if (attrHash['class']) {
          el.setAttribute('class', attrHash['class'])
        }
        if (attrHash['id']) {
          el.setAttribute('id', attrHash['id'])
        }
        if (attrHash['text']) {
          el.textContent = attrHash['text']
        }
        return el
      }

      // Add event delegation to conversatons container
      var conversationsContainer = document.querySelector('.conversations_container')

      conversationsContainer.addEventListener('click', function(e) {
        // Event listener for hide and show specific conversation
        if (e.target && e.target.matches("button.conversation_btn")) {
          var convoButton = e.target
          var conversationContainer = convoButton.parentNode
          var conversation = conversationContainer.querySelector('.conversation')
          toggleVisible(conversation)
        }
        // Event listener for send message
        else if (e.target && e.target.matches("button.send_message")) {
          var sendMessageButton = e.target
          var toUser = sendMessageButton.getAttribute('data_to_user_id')
          var convoId = sendMessageButton.getAttribute('data_convo_id')
          var actionsContainer = sendMessageButton.parentNode
          var textbox = actionsContainer.querySelector('.message_text')
          var text = textbox.value
          textbox.value = ''
          var messageData = {'message': {'convo_id': convoId, 'to_user': toUser, 'message_content': text}}
          $.ajax({ url: '/message',
            type: 'POST',
            beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
            data: JSON.stringify(messageData)
          })
          
        }
      })


      var chatListContainer = document.querySelector('.chat_list_container')
      var chatList = chatListContainer.querySelector('.chat_list')

      // toggle chatlist display and fetch content
      if (chatListContainer.style.display == 'none') {

        // Get list of avaliable users and insert into chat_list
        httpGet('/users/index.json', function(data) {
          var jsonData = JSON.parse(data)
          chatList.innerHTML = ''

          jsonData.forEach(function(message) {
            var openConvoContainer = generateNode('div', {'class': 'open_convo_container'})
            var convoButton = generateNode('button', {'class': 'open_convo_button', 'text': message['username']})
            convoButton.setAttribute('data_user_id', message['id'])
            openConvoContainer.appendChild(convoButton)
            chatList.appendChild(openConvoContainer)
          })

          toggleVisible(chatListContainer)
        })
      }
      else {
        // hide userlist
        toggleVisible(chatListContainer)
      }

      // Add event delegation to generated chat-list buttons to create conversation upon click
      chatList.addEventListener('click', function(e) {
        if(e.target && e.target.matches("button.open_convo_button")) {
          // Get required data for conversation
          var clickedButton = e.target
          var sendToUserId = clickedButton.getAttribute('data_user_id')
          var username = clickedButton.textContent

          // Ajax for last 30 messages
          httpGet(`/conversation/${sendToUserId}`, function(data) {
            var jsonData = JSON.parse(data)
            var messageData = jsonData[1]
            var convoId = jsonData[0]['convo_id']

            // Add conversation id to conversation button
            clickedButton.setAttribute('data_convo_id', convoId)

            // Create conversation div
            var convoHTML = `
              <button class='conversation_btn'>${username}</button>
              <div class='conversation'> 
                <div class='actions_container'>
                  <textarea class='message_text'></textarea>
                  <button class='send_message' data_convo_id='${convoId}' data_to_user_id='${sendToUserId}'>Send Message</button>
                </div>
                <div class='messages_container'></div>
              </div>
            `

            var conversationContainer = generateNode('div', {'class': 'conversation_container', 'id': `conversation_container_${convoId}`})
            conversationContainer.innerHTML = convoHTML
            var messagesContainer = conversationContainer.querySelector('.messages_container')

            // Function to generate new message
            var generateNewMessage = function(message) {
              if (message['sender_id_fk'] == sendToUserId) {
                var messageClass = 'message_recieved'
              }
              else {
                var messageClass = 'message_sent'
              }
              var dateStr = (new Date(message['created_at'])).toUTCString()
              var messageHTML = `
                <div class='${messageClass} message'>
                  <div class='message_time'>${dateStr}</div>
                  <div class='message_content'>${message['message_content']}</div>
                </div>
              `
              messagesContainer.insertAdjacentHTML('beforeend', messageHTML)
            }

            // Add last 30 messages
            messageData.forEach(function(message) {
              if (message['id'] == 0) {
                var messageHTML = `
                <div class='no_message message'>
                  ${message['message_content']}
                </div>
                `
                messagesContainer.insertAdjacentHTML('beforeend', messageHTML)
              }
              else {
                generateNewMessage(message)
              }
            })

            conversationsContainer.appendChild(conversationContainer)
            messagesContainer.scrollTop = messagesContainer.scrollHeight
            
            // Subscribe to cable channel
            var sub = App.cable.subscriptions.create({ channel: "MessagesChannel", convo_id: convoId }, {
              received(message) {
                generateNewMessage(message)
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
              }
            })
            convoSubs[convoId] = sub

            // End of get for last 30 messages ^^^^^^^^^^^^^^^^^^
          })

          clickedButton.setAttribute('class', 'close_convo_button')
          // End of click on start convo with person ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        }
        else if (e.target && e.target.matches('button.close_convo_button')) {
          // Get required data for conversation
          var clickedButton = e.target
          var convoId = clickedButton.getAttribute('data_convo_id')

          // Unsubscribe and delete conversation node
          convoSubs[convoId].unsubscribe()
          document.querySelector(`#conversation_container_${convoId}`).remove()

          // Change class of button to open conversation
          clickedButton.setAttribute('class', 'open_convo_button')
        }
      })

    }
    startChatBtn.addEventListener('click', startChatClickHandler)
  }
})