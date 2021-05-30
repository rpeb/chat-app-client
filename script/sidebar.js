var allUsers = {};

const fnSidebarName = () => {
  fetch(baseURL + "users/" + localStorage.getItem("sessionuserId"))
    .then((resp) => resp.json())
    .then((resp) => {
      replaceInnerHTMLById("sidebar-name", resp.name);
    });
};

fnSidebarName();

//Sidebar friend list

const fnSidebarFriendList = () => {
  fetch(baseURL + "users")
    .then((res) => res.json())
    .then((res) => {
      // console.log("arrsadfjhgsa", res);
      res = res.filter(item => getUserId() !== item.userId);
      allUsers = res
      // console.log(res);
      localStorage.setItem("allUserStorage", JSON.stringify(allUsers));
      for (var i = 0; i < res.length; i++) {
        document.querySelector(".sidebar__friend-list").insertAdjacentHTML(
          "afterbegin",
          `<div class="friend" onclick="redirectToPostRequestPage(${i})">
                    <img src="../image/avatar6.png" alt="avatar" class="avatar">
                    <div class="friend__info">
                      <h1><span id="friend-name${i}"></span></h1>
                    </div>
                  </div>`
        );
      }
      var users = document.getElementsByClassName("friend");
      for (var i = 0; i < res.length; i++) {
        replaceInnerHTMLById("friend-name" + i, res[i].name);
      }
    });
};

fnSidebarFriendList();
