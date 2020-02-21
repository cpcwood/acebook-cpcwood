// app/assets/javascripts/channels/chat.js

//= require cable
//= require_self
//= require_tree .

this.App = {};

App.cable = ActionCable.createConsumer(); 

convoSubs = []