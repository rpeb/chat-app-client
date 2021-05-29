const loggedInUser = localStorage.getItem("sessionuserId");
let conversationId = window.location.href.split("?")[1];
let url = `${baseURL}messages/${loggedInUser}/${conversationId}`;
let SenderName = localStorage.getItem("sessionName");

async function getMessages(url) {
  let messages = await fetch(url).then((res) => res.json());
  return messages;
}

async function getUserById() {
  let fetchUserUrl = `${baseURL}users/${conversationId}`;
  let user = await fetch(fetchUserUrl).then((res) =>
    res.json()
  );
  return user;
}

async function openConversation() {
    // fetching data from db
    let messages = await getMessages(url);
    let user = await getUserById();

  // sorting messages based on time
  messages.sort(function (a, b) {
    var keyA = a.timeOfMessaging;
    var keyB = b.timeOfMessaging;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  // TODO: refactor this code
  let messageObj = [];
  for (var i = 0; i < messages.length; ++i) {
    let messageBody = messages[i].messageBody;
    let timeOfMessaging = getTime(messages[i].timeOfMessaging);
    let right = messages[i].senderId === loggedInUser;
    let senderName = messages[i].nameOfUser;
    messageObj.push({
      senderName,
      messageBody,
      timeOfMessaging,
      right,
    });
  }

  // rendering the messages
  var chatWindow = document.getElementsByClassName("chat")[0];
  let chatHeader = user.name;
  chatWindow.innerHTML = `
   <div class="chat__header">
   <img src="../image/img_avatar.png" alt="avatar" class="avatar">
   <div class="chat__header-info">
         <h3>${chatHeader}</h3>
       </div>
     </div>
     <div class="chat__body" id="chatBody">
     </div>
   `;
  chatWindow.appendChild(createMessages(messageObj));
  chatWindow.innerHTML += `
   <div class="chat__footer">
   <form id="messageSubmit">
     <input id="messageBody" type="text" placeholder="Type a message">
     <button class="send__button" onclick="sendMessage('${conversationId}', event)"><img src="../image/send.png" alt="send"></button>
   </form>
         </div>
     </div>
   </div>
   `;
}

openConversation();

function sendMessage(conversationId, event) {
  event.preventDefault();
  var messageBody = document.getElementById("messageBody").value;
  let user = true;
  console.log("messageBody", messageBody);
  var chatBody = document.getElementById("chatBody");
  let time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  chatBody.innerHTML += `
         <div class="message message__receiver">
         <p class="message__body">
           <span class="message__sender-name">${SenderName}</span>
           ${messageBody}
         </p>
         <span class="message__timestamp">${time}</span>
         </div>
         `;
  fetch(url, {
    method: "POST",
    body: messageBody,
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  // .then((result) => console.log(result));
  document.getElementById("messageSubmit").reset();
}

function createMessages(messages) {
  var chatBody = document.getElementById("chatBody");
  for (var i = 0; i < messages.length; ++i) {
    if (messages[i].right) {
      chatBody.innerHTML += `
         <div class="message message__receiver">
         <p class="message__body">
           <span class="message__sender-name">${messages[i].senderName}</span>
           ${messages[i].messageBody}
         </p>
         <span class="message__timestamp">${messages[i].timeOfMessaging}</span>
         </div>
         `;
    } else {
      // let time = messages[i].timeOfMessaging.split("T")[1];
      chatBody.innerHTML += `
         <div class="message">
         <p class="message__body">
           <span class="message__sender-name">${messages[i].senderName}</span>
           ${messages[i].messageBody}
         </p>
         <span class="message__timestamp">${messages[i].timeOfMessaging}</span>
         </div>
         `;
    }
  }
  return chatBody;
}
