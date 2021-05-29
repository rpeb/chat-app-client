var userNum;

const redirectToPostRequestPage = (i) => {
    userNum = i;
    // alert(localStorage.getItem("sessionEmail"));
    fetch(baseURL + "message-request/" + localStorage.getItem("sessionuserId") + "/" + allUsers[i].userId)
        .then(res => res.text())
        .then(res => {
            if (res === "") {
                fetch(baseURL + "message-request/" + allUsers[i].userId + "/" + localStorage.getItem("sessionuserId"))
                    .then(res1 => res1.text())
                    .then(res1 => {
                        if (res1 === "")
                            window.location.replace(URL + "/post-request.html?" + userNum + "?" + 0);
                        else {
                            const jsonObj = JSON.parse(res1);
                            if (jsonObj.isAccepted === 0)
                                window.location.replace(URL + "/put-request.html?" + jsonObj.requestId)
                            else {
                                window.location.replace(`${URL}/chat.html?${allUsers[i].userId}`);
                            }
                        }
                    }
                    )
            }
            else {
                const jsonObj = JSON.parse(res);
                console.log(jsonObj);
                if (jsonObj.isAccepted === 0)
                    window.location.replace(URL + "/post-request.html?" + userNum + "?" + 1)
                else {
                    // alert("redirecting to chat.html");
                    window.location.replace(`${URL}/chat.html?${allUsers[i].userId}`)
                }
            }
        });


}
