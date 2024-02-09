
const createPostTitle = document.getElementById('createPostTitle');
const createPostDescription = document.getElementById('createPostDescription');
const createPostImage = document.getElementById('createPostImage');
// const openCreatePostButton = document.getElementById('openCreatePostButton');
const createPostDiv = document.getElementById('createPostDiv');
const uploadImageToPost = document.getElementById('uploadImageToPost'); 
const createPostImageInput = document.getElementById('createPostImageInput');
const createPostPreviewImage = document.getElementById('createPostPreviewImage');
const createPostSave = document.getElementById('createPostSave');


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
    formData.append('title', createPostTitle.value);
    formData.append('description', createPostDescription.value);
    formData.append('user', username);
  
  
    fetch('/api/uploadPost', {
      method: 'POST',
      body: formData
    })
    .then(response => {
        if (response.ok) {
        }
        else {
            throw new Error('Network response was not ok');
            console.log('Post uploaded successfully!');
        }
        return response.json();
    })
    .then(data => {
        // window.location.reload();
    })
}



createPostSave.addEventListener('click', () => {
    createNewPost();
});