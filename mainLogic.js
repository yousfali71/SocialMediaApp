const baseUrl = "https://tarmeezacademy.com/api/v1";

//Start All posts requests
function confirmdeletePost() {
  const token = localStorage.getItem("token");
  const postId = document.getElementById("delete-post-id-input").value;
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  const url = `${baseUrl}/posts/${postId}`;
  axios
    .delete(url, { headers: headers })
    .then((response) => {
      console.log(response);

      const modal = document.getElementById("deletePost-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("The Post Has Been Deleted ", "success");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}
function profileClicked() {
  const user = getCurrentUser();
  const userId = user.id;
  window.location = `profile.html?userid=${userId}`;
}
function deletePostClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("delete-post-id-input").value = post.id;

  let postModal = new bootstrap.Modal(
    document.getElementById("deletePost-modal"),
    {}
  );
  postModal.toggle();
}

function editPostClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("post-modal-submit").innerHTML = "Update";
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("post-title-input").innerHTML = post.title;
  document.getElementById("post-body-input").innerHTML = post.body;
  let postModal = new bootstrap.Modal(
    document.getElementById("creatNewPost-modal"),
    {}
  );
  postModal.toggle();
}

function creatNewPostClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  const token = localStorage.getItem("token");
  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0];
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);
  let url = "";
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  if (isCreate) {
    url = `${baseUrl}/posts`;
    axios
      .post(url, formData, {
        headers: headers,
      })
      .then((response) => {
        const modal = document.getElementById("creatNewPost-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        getPosts();
        showAlert("New Post Has Been Created ", "success");
      })
      .catch((error) => {
        const message = error.reponse.data.message;
        showAlert(message, "danger");
      });
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
    axios
      .post(url, formData, {
        headers: headers,
      })
      .then((response) => {
        const modal = document.getElementById("creatNewPost-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        showAlert("The Post Has Been Updated ", "success");
        getPosts();
      })
      .catch((error) => {
        const message = error.response.data.message;
        showAlert(message, "danger");
      });
  }
}

//End All posts requests

function setUI() {
  const token = localStorage.getItem("token");
  const registerBtn = document.getElementById("register-btn");
  const loginBtn = document.getElementById("login-btn");
  const logoutdiv = document.getElementById("logout-div");
  const creatNewPost = document.getElementById("add-btn");

  if (token === null) {
    if (creatNewPost != null) {
      creatNewPost.style.setProperty("display", "none", "important");
    }

    loginBtn.style.setProperty("display", "block", "important");
    registerBtn.style.setProperty("display", "block", "important");
    logoutdiv.style.setProperty("display", "none", "important");
  } else {
    if (creatNewPost != null) {
      creatNewPost.style.setProperty("display", "block", "important");
    }

    loginBtn.style.setProperty("display", "none", "important");
    registerBtn.style.setProperty("display", "none", "important");
    logoutdiv.style.setProperty("display", "flex", "important");
    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
  }
}

// start auth functions
function loginBtnclicked() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  const params = {
    username: username,
    password: password,
  };

  const url = `${baseUrl}/login`;
  axios.post(url, params).then((response) => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    const modal = document.getElementById("login-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setUI();
    showAlert("logged in,successfully ", "success");
  });
}

function registerBtnclicked() {
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;
  const image = document.getElementById("register-image-input").files[0];
  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("image", image);
  formData.append("password", password);

  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const url = `${baseUrl}/register`;
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      console.log(response);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("New User Has Been Register ", "success");
      getPosts();
    })
    .catch((error) => {
      const message = error.reponse.data.message;
      showAlert(message, "danger");
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("logged out,successfully ", "success");
  setUI();
}

function showAlert(message, type) {
  const alertPlaceholder = document.getElementById("sucess-alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type}  alert-dismissible" role="alert" style="z-index:  99999">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  appendAlert(message, type);

  setTimeout(() => {
    // const alert = bootstrap.Alert.getOrCreateInstance("#sucess-alert");
    // alert.close();
  }, 2000);
}

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }

  return user;
}
