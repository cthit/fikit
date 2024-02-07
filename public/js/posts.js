
let postParentDiv =document.getElementById("fik");

function createPost(post, parentDiv){
    let postDiv = document.createElement("div");
    postDiv.classList.add("postDiv");
    postDiv.style.backgroundImage = "url('img/postImages/" + post.image + "')";

    let postContentDiv = createPostContentDiv(post);
    postDiv.appendChild(postContentDiv);

    parentDiv.appendChild(postDiv);
}

function createPostContentDiv(post){
    let postContentDiv = document.createElement("div");
    let h2 = document.createElement("h2");
    let postP = document.createElement("p");

    h2.textContent = post.title;
    postP.textContent = post.content;

    postContentDiv.classList.add("postContentDiv");
    postContentDiv.appendChild(h2);
    postContentDiv.appendChild(postP);

    return postContentDiv;
}


function main(){
    let post =     {
        "title": "Morotskakans dag",
        "content": "Idag bakade FikIT morotskaka, det var gott tyckte vår deltagare.",
        "image": "morotskaka.jpg"
    }
    createPost(post, postParentDiv);
    createPost(post, postParentDiv);
    createPost(post, postParentDiv);

}

main();
