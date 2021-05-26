var replyButton = document.getElementById("message_reply_option");

var friends = document.getElementsByClassName("friend");
for (var i = 0; i < friends.length; ++i) {
  friends[i].addEventListener("click", (e) => {
    document.getElementById("friend-name").innerHTML =
      e.currentTarget.children[1].children[0].innerHTML;
  });
}

var messages = document.getElementsByClassName("message");
for (var i = 0; i < messages.length; ++i) {
  messages[i].addEventListener("mouseover", (e) => {
    e.currentTarget.children[2].style.display = "block";
  });

  messages[i].addEventListener("mouseout", (e) => {
    e.currentTarget.children[2].style.display = "none";
  });
}

var dropdowns = document.getElementsByClassName("dropdown-arrow");
for (var i = 0; i < dropdowns.length; ++i) {
  dropdowns[i].addEventListener("click", (e) => {
    e.preventDefault();
    replyButton.removeAttribute("hidden");
    replyButton.style.position = "absolute";
    replyButton.style.top = e.pageY + "px";
    replyButton.style.left = e.pageX + "px";
    replyButton.style.backgroundColor = "white";
    replyButton.style.cursor = "pointer";
  });
}

window.addEventListener("load", displayConversations);
window.addEventListener("load", async (e) => {
  const user = await fetch(URL + `/api/users/${loggedInUser}`)
                      .then(res => res.json());
  SenderName = user.name;
  document.getElementById("loggedInUserName").innerHTML = SenderName;
});

async function getConversations() {
  const conversations = await fetch(URL + "/api/messages/" + loggedInUser).then(
    (res) => res.json()
  );
  let users = [];
  for (var i = 0; i < conversations.length; ++i) {
    let tmp = {
      name: conversations[i].nameOfUser,
      userReceiver: conversations[i].userReceiverId,
      groupReceiver: conversations[i].groupReceiverId,
    };
    users.push(tmp);
  }
  let uniqueUsersObj = {};
  let uniqueUsersArray = [];
  for (let i in users) {
    objName = users[i]["name"];
    uniqueUsersObj[objName] = users[i];
  }

  for (i in uniqueUsersObj) {
    uniqueUsersArray.push(uniqueUsersObj[i]);
  }
  return uniqueUsersArray;
}

async function displayConversations() {
  let conversations = await getConversations();
  var friendList = document.getElementsByClassName("sidebar__friend-list")[0];
  for (var i = 0; i < conversations.length; ++i) {
    let user = conversations[i].userReceiver == null ? false : true;
    let conversationId = user
      ? conversations[i].userReceiver
      : conversations[i].groupReceiver;

    friendList.innerHTML += `
    <div class="friend" onclick="openConversation('${conversationId}', event)">
    <img src="../image/avatar6.png" alt="avtar" class="avatar">
    <div class="friend__info">
      <h1>${conversations[i].name}</h1>
      <p>Tap to chat</p>
    </div>
    </div>
  `;
  }
}

async function getMessages(url) {
  let messages = await fetch(url).then((res) => res.json());
  return messages;
}

async function openConversation(conversationId, event) {
  // fetching data from db
  let url = null;
  let user = conversationId[0] === "U";
  if (user) url = URL + `/api/messages/${loggedInUser}/${conversationId}`;
  else url = URL + `/api/messages/group/${loggedInUser}/${conversationId}`;

  let chatHeader = event.currentTarget.children[1].children[0].innerHTML;
  let messages = await getMessages(url);

  // sorting messages based on time
  messages.sort(function (a, b) {
    var keyA = a.timeOfMessaging;
    var keyB = b.timeOfMessaging;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  
  // TODO: refactor this code
  let messageObj = []
  if (user) {
    for (var i = 0; i < messages.length; ++i) {
      let messageBody = messages[i].messageBody;
      let timeOfMessaging = messages[i].timeOfMessaging;
      let right = messages[i].senderId === loggedInUser;
      let senderName = messages[i].nameOfUser;
      messageObj.push({
        senderName,
        messageBody,
        timeOfMessaging,
        right
      });
    }
    // console.log(messageObj);
  } else {
    for (var i = 0; i < messages.length; ++i) {
      let messageBody = messages[i].messageBody;
      let timeOfMessaging = messages[i].timeOfMessaging;
      let right = messages[i].senderId === loggedInUser;
      let senderName = messages[i].nameOfUser;
      messageObj.push({
        senderName,
        messageBody,
        timeOfMessaging,
        right
      })
    }
    // console.log(messageObj);
  }


  // rendering the messages
  var chatWindow = document.getElementsByClassName("chat")[0];
  chatWindow.innerHTML = `
  <div class="chat__header">
  <img src="../image/img_avatar.png" alt="avatar" class="avatar">
  <div class="chat__header-info">
        <h3>${chatHeader}</h3>
      </div>
    </div>
    <div class="chat__body" id="chatBody">
    </div>
  `
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
  `
}

function sendMessage(conversationId, event) {
    event.preventDefault();
    var messageBody = document.getElementById("messageBody").value;
    let url=null;
    let user = conversationId[0] === "U";
    if (user) url = URL + `/api/messages/${loggedInUser}/${conversationId}`;
    else url = URL + `/api/messages/group/${loggedInUser}/${conversationId}`;
    console.log("messageBody", messageBody);
    var chatBody = document.getElementById("chatBody");
    let time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    chatBody.innerHTML += `
      <div class="message message__receiver">
      <p class="message__body">
        <span class="message__sender-name">${SenderName}</span>
        ${messageBody}
      </p>
      <span class="message__timestamp">${time}</span>
      </div>
      `
    fetch(url, {
      method: "POST",
      body: messageBody,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(result => console.log(result))
    document.getElementById("messageSubmit").reset();
}

function createMessages(messages) {
  var chatBody = document.getElementById("chatBody");
  for (var i = 0; i < messages.length; ++i) {
    if (messages[i].right) {
      let time = messages[i].timeOfMessaging.split("T")[1];
      chatBody.innerHTML += `
      <div class="message message__receiver">
      <p class="message__body">
        <span class="message__sender-name">${messages[i].senderName}</span>
        ${messages[i].messageBody}
      </p>
      <span class="message__timestamp">${time}</span>
      </div>
      `
    } else {
      let time = messages[i].timeOfMessaging.split("T")[1];
      chatBody.innerHTML += `
      <div class="message">
      <p class="message__body">
        <span class="message__sender-name">${messages[i].senderName}</span>
        ${messages[i].messageBody}
      </p>
      <span class="message__timestamp">${time}</span>
      </div>
      `
    }
  }
  return chatBody;
}