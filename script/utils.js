const getUserId = () => localStorage.getItem("sessionuserId");

const getValueById = (id) => document.getElementById(id).value;
const replaceInnerHTMLById = (id, data) => document.getElementById(id).innerHTML = data;
const getById = (id) => document.getElementById(id);

const fnUserUrlBuilder = (param1) => {
  const userId = getUserId();
  return baseURL + "user/" + userId + param1;
}

const getTime = (datetimeString) => {
  "2021-03-08T13:30:45"
  let t = datetimeString.split(/[-T:]/);
  return `${t[3]}:${t[4]}`
} 

const updateProfile = (userData) => {
  const newData =
  {
    method: "PUT",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json"
    }
  }
  return newData;
}

const postMessageRequest = (userData) => {
  const newData =
  {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json"
    }
  }
  return newData;
}

const putMessageRequest = (userData) => {
  const newData =
  {
    method: "PUT",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json"
    }
  }
  return newData;
}

const isPasswordConfirmed = () => getValueById("new-password") === getValueById("confirm-new-password");
const isEmailConfirmed = () => getValueById("new-email") === getValueById("confirm-new-email");