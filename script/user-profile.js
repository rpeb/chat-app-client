const fnGetProfile = () => {
    fetch(baseURL + "users/" + localStorage.getItem("sessionuserId"))
        .then(resp => resp.json())
        .then(resp => {
            replaceInnerHTMLById("name", resp.name);
            replaceInnerHTMLById("email", resp.email);
            replaceInnerHTMLById("dob", resp.dob);
            // console.log(resp);
        })
}

fnGetProfile();
