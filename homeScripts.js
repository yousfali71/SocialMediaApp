// start infinite scroll

let currentPage = 1;
let lastPage = 1;
window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  if (endOfPage && currentPage < lastPage) {
    getPosts((currentPage += 1));
  }
});
// end infinite scroll

getPosts();

function userClicked(userId) {
  window.location = `profile.html?userid=${userId}`;
}

function getPosts(page = 1) {
  axios.get(`${baseUrl}/posts?page=${currentPage}`).then((response) => {
    posts = response.data.data;
    document.getElementById("posts").innerHTML = "";
    lastPage = response.data.meta.last_page;
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
                     <span style = "cursor:pointer" onclick = "userClicked(${author.id})">
                        <img
                        class="rounded-circle border border-2"
                         style="width: 40px; height: 40px"
                         src="${author.profile_image}"
                         alt=""
                       />
                          <b>${author.username}</b>
                     </span>
                  
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
                 </div>        `;

      document.getElementById("posts").innerHTML += content;
    }
  });
}
function postClicked(postId) {
  window.location = `postDetails.html?postId=${postId}`;
}

setUI();

function addBtnClicked() {
  document.getElementById("post-modal-submit").innerHTML = "Create";
  document.getElementById("post-id-input").value = "";
  document.getElementById("post-modal-title").innerHTML = "Create A New Post";
  document.getElementById("post-title-input").innerHTML = "";
  document.getElementById("post-body-input").innerHTML = "";
  let postModal = new bootstrap.Modal(
    document.getElementById("creatNewPost-modal"),
    {}
  );
  postModal.toggle();
}
