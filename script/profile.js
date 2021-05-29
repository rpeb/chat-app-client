// All user profile update code goes here.

const fnUpdateNameHandler = () => {
  const userData = {
    name: getValueById("new-name")
  }
  const URL = fnUserUrlBuilder("/name")
  console.log(URL);
  fetch(URL, updateProfile(userData))
    .then(res => res.json())
    .then(res => alert("Successfully changed profile"))
    .then(() => redirectToProfilePage())
    .catch(err => console.error(err));
}

const fnUpdateEmailHandler = () => {
  if (isEmailConfirmed()) {
    const userData = {
      email: getValueById("new-email")
    }
    const URL = fnUserUrlBuilder("/email")
    fetch(URL, updateProfile(userData))
      .then(res => res.json())
      .then(res => alert("Successfully changed profile"))
      .then(() => redirectToProfilePage())
      .catch(err => console.error(err));
  }
  else {
    alert("Email Do Not Match");
  }
}

const fnUpdatePasswordHandler = () => {
  if (isPasswordConfirmed()) {
    const userData = {
      password: getValueById("new-password")
    }
    const URL = fnUserUrlBuilder("/password")
    fetch(URL, updateProfile(userData))
      .then(res => res.json())
      .then(res => alert("Successfully changed profile"))
      .then(() => redirectToProfilePage())
      .catch(err => console.error(err));
  }
  else {
    alert("Password Do Not Match");
  }
}

const fnUpdateDobHandler = () => {
  const userData = {
    dob: getValueById("new-dob")
  }
  const URL = fnUserUrlBuilder("/dob")
  fetch(URL, updateProfile(userData))
    .then(res => res.json())
    .then(res => alert("Successfully changed profile"))
    .then(() => redirectToProfilePage())
    .catch(err => console.error(err));
}
