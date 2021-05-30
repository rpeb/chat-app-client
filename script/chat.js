let conversationId = window.location.href.split("?")[1];
let url = `${baseURL}messages/${getUserId()}/${conversationId}`;

(async function openConversation() {
  // fetching data from db
  let messages = await getMessages(url);
  let user = await getUserById();

  messages = sortMessages(messages, "timeOfMessaging");

  let messageObj = prepareMessages(messages);

  // rendering the messages
  let chatWindow = document.getElementsByClassName("chat")[0];
  let chatHeader = user.name;
  chatWindow.innerHTML = chatHeadHtmlString.format(chatHeader);
  chatWindow.appendChild(createMessages(messageObj));
  chatWindow.innerHTML += chatWindowMessageString.format(conversationId);
})();

function sendMessage(conversationId, event) {
  event.preventDefault();
  let messageBody = getValueById("messageBody");
  let chatBody = getById("chatBody");
  let time = getHoursMinutesIn24HrsFormat();
  chatBody.innerHTML += sentMessageHtmlString.format(
    getSenderName(),
    messageBody,
    time
  );
  fetch(url, postSentMessage(messageBody)).then((res) => res.json());
  getById("messageSubmit").reset();
}
