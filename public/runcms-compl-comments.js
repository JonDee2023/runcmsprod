
document
.getElementById("comment-form")
.addEventListener("submit", addComment);

async function addComment(e){

    e.preventDefault();

    const complaint_id =
        document.getElementById(
            "comment-complaint-id"
        ).value;

    const comment =
        document.getElementById(
            "comment-text"
        ).value;

    const user_id =
        localStorage.getItem("user_id");

    const response =
        await fetch(
            "http://localhost:3000/api/add-comment",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    complaint_id,
                    user_id,
                    comment
                })
            }
        );

    const data = await response.json();

    document
    .getElementById("comment-message")
    .textContent = data.message;
}