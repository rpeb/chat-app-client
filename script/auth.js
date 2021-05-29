/**
* @author Shubham Chaudhari
*/

function login() {
    // console.log("Auth.js");
    var emailvalue = document.getElementById("email").value;
    var passwordvalue = document.getElementById("password").value;
    //alert(emailvalue);

    fetch(baseURL + "login", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify({
            email: emailvalue,
            password: passwordvalue
        }),

        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            // alert(data);
            if (data) {
                // alert("in if");
                // alert(data);
                fetch(baseURL + "users")
                    .then(users => users.json())
                    .then((usersdata) => {
                        // console.log("userdata");
                        // alert("2");
                        for (var i = 0; i < usersdata.length; i++) {
                            // alert("1");
                            //   console.log("email is "+usersdata[i].email);
                            if (emailvalue == usersdata[i].email) {
                                localStorage.setItem("sessionEmail", usersdata[i].email);
                                localStorage.setItem("sessionuserId", usersdata[i].userId);
                                localStorage.setItem("sessionName", usersdata[i].name);
                                localStorage.setItem("sessionDob", usersdata[i].dob);
                                console.log("userId is " + localStorage.getItem("sessionEmail"));
                                break;
                            }
                        }
                    })
                    .then(() => window.location.href = URL + "/profile.html")
                    .catch((err) => console.log("Error Found !! : " + err))
            }
            else
                alert("Wrong username or password");
        }
        )
}


function register() {


    var emailvalue = document.getElementById("email").value;
    var passwordvalue = document.getElementById("password").value;
    var password2value = document.getElementById("password2").value;
    var dobvalue = document.getElementById("dob").value;
    var fnamevalue = document.getElementById("fname").value;
    //alert(emailvalue);
    //fetching users table size to create unique userid by the formula-> U+size_of_table

    if (isValid()) {
        fetch(baseURL + "users/all")
            .then(users => users.json())
            .then((usersdata) => {
                usersize = usersdata.length
                var userId = "U" + usersize;
                fetch(baseURL + "register", {

                    // Adding method type
                    method: "POST",

                    // Adding body or contents to send
                    body: JSON.stringify({
                        userId: userId,
                        email: emailvalue,
                        password: passwordvalue,
                        name: fnamevalue,
                        dob: dobvalue
                    }),

                    // Adding headers to the request
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                    .then(res => res.json())
                    .then((data) => {
                        if (data) {
                            alert("Registered Successfully")
                            //Redirect to login page
                            window.location.href = "http://127.0.0.1:5500/index.html";
                        }

                        else
                            alert("Email Already Exists");
                    }
                    )

            }
            )
    }


}

function isValid() {
    return isNameValid() && isEmailValid() && isPasswordValid() && isDobValid();
}

function isNameValid() {
    if (document.getElementById("fname").value.length > 2)
        return true;
    alert("Name should be of length greater than 2")
    return false;
}

function isEmailValid() {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(document.getElementById("email").value))
        return true;
    alert("Enter Valid Email")
    return false;
}

function isPasswordValid() {

    if (document.getElementById("password").value.length < 4) {
        alert("Password length must be greater than 3")
        return false;
    }
    if (document.getElementById("password").value != document.getElementById("password2").value) {
        alert("Passwords should match")
        return false;
    }
    else
        return true;
}

function isDobValid() {
    var today = new Date();
    var birthDate = new Date(document.getElementById("dob").value);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age >= 18) {
        return true;
    }
    alert("Your must be over 18 years old")
    return false;
}
