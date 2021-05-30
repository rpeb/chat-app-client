const url = window.location.href;
const arr = url.split("?")

const disableButton = () => {
  replaceInnerHTMLById("request-button", "Pending");
  getById("request-button").style.background = "#DDDDDD";
  getById("request-button").style.cursor = "not-allowed";
  getById("request-button").style.color = "black";
  getById("request-button").disabled = true;
}
const postRequest = async () => {
  // console.log(arr);
  const messageRequest = {
    "senderId": localStorage.getItem("sessionuserId"),
    "receiverId": allUsers[arr[1]].userId,
    "messageBody": "request"
  };

  await fetch(baseURL + "message-request", postMessageRequest(messageRequest));
  disableButton();

}

const requestStyle = () => {
  let user = JSON.parse(localStorage.getItem("allUserStorage"))[arr[1]]
  replaceInnerHTMLById("chat__name", user.name)
  replaceInnerHTMLById("chat__info", user.email)
  if (arr[2] == 1) disableButton();
}

console.log(localStorage.getItem("sessionEmail"));
