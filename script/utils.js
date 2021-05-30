const getUserId = () => localStorage.getItem("sessionuserId");
const getSenderName = () => localStorage.getItem("sessionName");

const getValueById = (id) => document.getElementById(id).value;
const replaceInnerHTMLById = (id, data) =>
  (document.getElementById(id).innerHTML = data);
const getById = (id) => document.getElementById(id);

const fnUserUrlBuilder = (param1) => {
  const userId = getUserId();
  return `${baseURL}user/${userId}${param1}`;
};

async function getMessages(url) {
  let messages = await fetch(url).then((res) => res.json());
  return messages;
}

const getTime = (datetimeString) => {
  // "2021-03-08T13:30:45" -> ["2021","03","08","13","30","45"]
  let t = datetimeString.split(/[-T:]/);
  return `${t[3]}:${t[4]}`;
};

const updateProfile = (userData) => {
  const newData = {
    method: "PUT",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  };
  return newData;
};

const postMessageRequest = (userData) => {
  const newData = {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  };
  return newData;
};

const putMessageRequest = (userData) => {
  const newData = {
    method: "PUT",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  };
  return newData;
};

const isPasswordConfirmed = () =>
  getValueById("new-password") === getValueById("confirm-new-password");
const isEmailConfirmed = () =>
  getValueById("new-email") === getValueById("confirm-new-email");

/* UTILITIES FOR chat.js */

const getUserById = async () => {
  let fetchUserUrl = `${baseURL}users/${conversationId}`;
  let user = await fetch(fetchUserUrl).then((res) => res.json());
  return user;
};

const postSentMessage = (messageBody) => {
  return {
    method: "POST",
    body: messageBody,
    headers: {
      "Content-Type": "application/json",
    },
  };
};

// formatting time
const getHoursMinutesIn24HrsFormat = () => {
  let time_string = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  let hours = new Date("2000-01-01 " + time_string).getHours();
  let minutes = new Date("2000-01-01 " + time_string).getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  return `${hours}:${minutes}`;
};

const sortMessages = (messages, key) => {
  messages.sort((a, b) => {
    var keyA = a[key];
    var keyB = b[key];
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  return messages;
};

// operations on messages
const prepareMessages = (messages) => {
  let messageObj = [];
  messages.forEach((message) => {
    let messageBody = message["messageBody"];
    let timeOfMessaging = getTime(message["timeOfMessaging"]);
    let right = message["senderId"] === getUserId();
    let senderName = message["nameOfUser"];
    messageObj.push({
      messageBody,
      timeOfMessaging,
      senderName,
      right,
    });
  });
  return messageObj;
};

const createMessages = (messages) => {
  let chatBody = getById("chatBody");
  messages.forEach((message) => {
    let sender = message["senderName"];
    let body = message["messageBody"];
    let time = message["timeOfMessaging"];
    if (message["right"]) {
      let className = "message__receiver";
      chatBody.innerHTML += createMessagesHtmlString.format(
        className,
        sender,
        body,
        time
      );
    } else {
      chatBody.innerHTML += createMessagesHtmlString.format(
        "",
        sender,
        body,
        time
      );
    }
  });
  return chatBody;
};

// HTML strings
let createMessagesHtmlString = `
<div class="message %s">
  <p class="message__body">
    <span class="message__sender-name">%s</span>
    %s
  </p>
  <span class="message__timestamp">%s</span>
</div>
`;

let chatHeadHtmlString = `
  <div class="chat__header">
    <img src="../image/img_avatar.png" alt="avatar" class="avatar">
    <div class="chat__header-info">
      <h3>%s</h3>
    </div>
  </div>
  <div class="chat__body" id="chatBody">
  </div>
`;

let chatWindowMessageString = `
  <div class="chat__footer">
   <form id="messageSubmit">
     <input id="messageBody" type="text" placeholder="Type a message">
     <button class="send__button" onclick="sendMessage('%s', event)"><img src="../image/send.png" alt="send"></button>
   </form>
  </div>
</div>
</div>
`;

let sentMessageHtmlString = `
<div class="message message__receiver">
<p class="message__body">
  <span class="message__sender-name">%s</span>
  %s
</p>
<span class="message__timestamp">%s</span>
</div>
`;

// to add formatted strings
String.prototype.format = function () {
  return [...arguments].reduce((p, c) => p.replace(/%s/, c), this);
};
