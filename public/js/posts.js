
const createPostTitle = document.getElementById('createPostTitle');
const createPostDescription = document.getElementById('createPostDescription');
const createPostImage = document.getElementById('createPostImage');
// const openCreatePostButton = document.getElementById('openCreatePostButton');
const createPostDiv = document.getElementById('createPostDiv');
const uploadImageToPost = document.getElementById('uploadImageToPost'); 
const createPostImageInput = document.getElementById('createPostImageInput');
const createPostPreviewImage = document.getElementById('createPostPreviewImage');
const createPostSave = document.getElementById('createPostSave');
let postParentDiv =document.getElementById("postsContainer");

let postImageDirPath = "postImages/"

openCreatePostButton.addEventListener('click', () => { 
    createPostDiv.classList.toggle('hidden');
});

uploadImageToPost.addEventListener('click', () => {
    createPostImageInput.click();
});

createPostImageInput.addEventListener('change', () => {
    const file = createPostImageInput.files[0];
    createPostPreviewImage.src = URL.createObjectURL(file);
});



function createNewPost(){
    const file = createPostImageInput.files[0];

    if (!file) {
        console.error('No file selected');
        return;
    }

    uploadNewPost();
}

function uploadNewPost(post) {
    const formData = new FormData();
    formData.append('postImage', createPostImageInput.files[0]);
    formData.append('id', createRandomSuffix());
    formData.append('title', createPostTitle.value);
    formData.append('description', createPostDescription.value);
    formData.append('user', username);
    formData.append('adminKey', adminKey)
  
  
    fetch('/api/uploadPost', {
      method: 'POST',
      body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log('Post uploaded successfully!');
        }
        else {
            throw new Error('Network response was not ok');
        }
        return response;
    })
    .then(posts => {
        updateNewsPost();
    })
}

function postCreated() {
    createPostDiv.classList.add('hidden');
    createPostTitle.value = '';
    createPostDescription.value = '';
    createPostImageInput.value = '';
    createPostPreviewImage.src = '../img/placeholderPreview.svg';
}

createPostSave.addEventListener('click', () => {
    createNewPost();
});



function updateNewsPost() {
    fetch('/api/getPosts')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        else {
            throw new Error('Network response was not ok');
        }
    })
    .then(posts => {
        postParentDiv.innerHTML = "";
        posts.forEach(post => {
            createPost(post, postParentDiv);
        });
        postCreated();
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}


updateNewsPost()




// METHODS FOR CREATAING POSTS ON THE PAGE 


function createPost(post, parentDiv){
    let postDiv = document.createElement("div");
    postDiv.classList.add("postDiv");

    if (post.imageName !== undefined){
        postDiv.style.backgroundImage = "url('" + postImageDirPath + post.imageName + "'), url('../img/logos/FikIT.png')";
    }

    let postContentDiv = createPostContentDiv(post);
    postDiv.appendChild(postContentDiv);

    parentDiv.appendChild(postDiv);
}

function createPostContentDiv(post){
    let postContentDiv = document.createElement("div");
    postContentDiv.classList.add("postContentDiv");

    let h3 = document.createElement("h3");
    let postP = document.createElement("p");

    h3.textContent = post.title;
    postP.textContent = post.description;

    postContentDiv.appendChild(h3);
    postContentDiv.appendChild(postP);

    return postContentDiv;
}