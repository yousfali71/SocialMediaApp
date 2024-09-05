setUI();
getUser();
getPosts();

function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userid");
  return id;
}
function getUser() {
  const id = getCurrentUserId();
  

  axios.get(`${baseUrl}/users/${id}`).then((response) => {
    const user = response.data.data;
    document.getElementById("main-info-email").innerHTML = user.email;
    document.getElementById("main-info-name").innerHTML = user.name;
    document.getElementById("main-info-username").innerHTML = user.username;
    document.getElementById("posts-count").innerHTML = user.posts_count;
    document.getElementById("comments-count").innerHTML = user.comments_count;
    document.getElementById("name-posts").innerHTML = user.username;

    document.getElementById("main-info-image").src = user.profile_image;
  });
}
getPosts();
function getPosts() {
  const id = getCurrentUserId();

  axios.get(`${baseUrl}/users/${id}/posts`).then((response) => {
    posts = response.data.data;
    console.log(posts);
    document.getElementById("user-posts").innerHTML = "";
    for (post of posts) {
      const author = post.author;
      let postTitle = "";

      let user = getCurrentUser();
      let isMyPost = user != null && post.author.id == user.id;
      let editbtnContent = ``;
      if (isMyPost) {
        editbtnContent = `
         <button class ="btn btn-danger" style ="float:right ; margin-left : 5px" onclick = "deletePostClicked('${encodeURIComponent(
           JSON.stringify(post)
         )}')">Delete</button>
          
          <button class ="btn btn-secondary" style ="float:right"; onclick = "editPostClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Edit</button>`;
      }

      if (post.title != null) {
        postTitle = post.title;
      }

      let content = `                 
                <div class="card shadow mb-5">

                   <div class="card-header">
                      <img
                        class="rounded-circle border border-2"
                         style="width: 40px; height: 40px"
                         src="${author.profile_image}"
                         alt=""
                       />
                          <b>${author.username}</b>
                           ${editbtnContent}
                      </div>

                    <div class="card-body">
                       <img style="width: 100%" src="${post.image}" alt="" />
                       <h6 class="mt-1" style="color: rgb(192, 192, 192)">
                        ${post.created_at}
                       </h6>
                       <h4>${postTitle}</h4>
                       <p>${post.body}</p>
                       <hr />
                      <div class="comment-section ">

                          <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="16"
                           height="16"
                           fill="currentColor"
                           class="bi bi-pen"
                           viewBox="0 0 16 16"
                         >
                            <path
                               d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                              />
                          </svg>
                         <span>
                            (${post.comments_count}) comments
                           <span id="post-tags">
                             
                           </span>
                         </span>
                           <button type="button" onclick = "postClicked(${post.id})" id="showPost-btn" class="btn btn-primary" style="font-size : 12px; float :right">Show Post</button>
                      </div>
                     </div>
                    </div>       `;

      document.getElementById("user-posts").innerHTML += content;
    }
  });
}
