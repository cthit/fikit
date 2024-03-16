
const postsDiv = document.getElementById('posts');

const createPostTitle = document.getElementById('createPostTitle');
const createPostDescription = document.getElementById('createPostDescription');
const createPostImage = document.getElementById('createPostImage');
const createPostDiv = document.getElementById('createPostDiv');
const uploadImageToPost = document.getElementById('uploadImageToPost'); 
const createPostImageInput = document.getElementById('createPostImageInput');
const createPostPreviewImage = document.getElementById('createPostPreviewImage');
const createPostSave = document.getElementById('createPostSave');
let postParentDiv = document.getElementById("postsContainer");


let postImageDirPath = "/img/postImages/";


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
    let newPost = {
        title : createPostTitle.value,
        description : createPostDescription.value,
        id: createRandomSuffix(),
    }
    const formData = new FormData();
    formData.append('adminKey', adminKey)
    formData.append('newPost', JSON.stringify(newPost));
    formData.append('postImage', createPostImageInput.files[0]);
  
  
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
            if (posts.length === 0) {
            postsDiv.classList.add("hidden");
        } else {
            postsDiv.classList.remove("hidden");

            posts.forEach(post => {
                createPost(post, postParentDiv);
            });
        }
        postCreated();
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}


updateNewsPost()




// METHODS FOR LOADING POSTS ON THE PAGE 


function createPost(post, parentDiv){
    let primaryImage = postImageDirPath + post.imageName;
    let fallbackImage = 'img/logos/fikit.png';

    let postDiv = document.createElement("div");
    postDiv.classList.add("postDiv");

    postDiv.style.backgroundImage = 'url("' + primaryImage + '")';

    imageExists(primaryImage, function(exists) {
        if (!exists) {
            postDiv.style.backgroundImage = 'url("' + fallbackImage + '")';
            postDiv.style.backgroundSize = 'contain';
            postDiv.style.backgroundRepeat = 'no-repeat';
        }
    });
          

    let postContentDiv = createPostContentDiv(post);
    postDiv.appendChild(postContentDiv);

    let removePostButton = createRemovePostButton(post);
    postDiv.appendChild(removePostButton);

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

function createRemovePostButton(post){
    let removePostButton = document.createElement("div");
    removePostButton.classList.add("removePostButton");
    if (!isLoggedIn){
        removePostButton.classList.add("hidden");
    }

    let removeImg = document.createElement("img");
    removeImg.src = "../img/icons/delete.svg";
    removePostButton.appendChild(removeImg);


    removePostButton.addEventListener("click", () => {
        let data = {
            post: post,
            adminKey: adminKey
        };
        
        fetch('/api/removePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                console.log('Post removed successfully!');
            }
            else {
                throw new Error('Network response was not ok');
            }
            return response;
        })
        .then(posts => {
            updateNewsPost();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });
    return removePostButton;
}

// Function to check if the primary image fails to load
function imageExists(url, callback) {'t'
    var img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    img.src = url;
}


function toggleRemovePostButton(){
    let removePostButtons = document.getElementsByClassName("removePostButton");
    for (let button of removePostButtons){
        if (isLoggedIn) {
            button.classList.remove("hidden");
        } else {
            button.classList.add("hidden");
        }
    }
}