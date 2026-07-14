let selectedComplaint = null;

document.addEventListener(
    "DOMContentLoaded",
    loadComplaints
);

async function loadComplaints(){

    try {

        const officerId =
            localStorage.getItem(
                "user_id"
            );

        const response =
            await fetch(
                `https://runcmsprod.onrender.com/api/officer/complaints/${officerId}`
            );

        const data =
            await response.json();

        const tbody =
            document.getElementById(
                "complaints-body"
            );

        tbody.innerHTML = "";

        data.complaints.forEach(
            complaint => {

                const row =
                    document.createElement(
                        "tr"
                    );

                row.innerHTML =
                `
                <td>${complaint.complaint_id}</td>

                <td>${complaint.subject}</td>

                <td>${complaint.category}</td>

                <td>${complaint.description}</td>

                <td>${complaint.priority}</td>

                <td>${complaint.current_status}</td>

                
                <td>
                    <button
                        onclick="openComment(${complaint.complaint_id})">
                        Add Comment
                    </button>
                </td>

                <td>
                    <button
                        onclick="openUpdate(${complaint.complaint_id})">
                        Update Status
                    </button>
                </td>

                `;

                tbody.appendChild(
                    row
                );
            }
        );

    } catch(err){

        console.error(err);
    }
}

function openUpdate(
    complaintId
){

    selectedComplaint =
        complaintId;

    document
        .getElementById(
            "update-box"
        )
        .style.display =
        "block";
}

document
.getElementById(
    "save-btn"
)
.addEventListener(
    "click",
    saveUpdate
);

async function saveUpdate(){

    try {

        const status =
            document.getElementById(
                "status"
            ).value;

        const comment =
            document.getElementById(
                "comment"
            ).value;

        const officerId =
            localStorage.getItem(
                "user_id"
            );

        const response =
            await fetch(
                "https://runcmsprod.onrender.com/api/officer/update-status",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        complaint_id:
                            selectedComplaint,

                        status,

                        officer_id:
                            officerId,

                        comment
                    })
                }
            );

        const data =
            await response.json();

        alert(
            data.message
        );

        loadComplaints();

        document
            .getElementById(
                "update-box"
            )
            .style.display =
            "none";

    } catch(err){

        console.error(err);
    }
}

// ADD COMMENT

function openComment(id){

    commentComplaintId = id;

    document
        .getElementById("comment-box")
        .style.display = "block";
}

async function saveComment(){

    const comment =
        document.getElementById(
            "comment-text"
        ).value;

    const userId =
        localStorage.getItem(
            "user_id"
        );

    const response =
        await fetch(
            "https://runcmsprod.onrender.com/api/add-comment",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    complaint_id:
                        commentComplaintId,

                    user_id:
                        userId,

                    comment:
                        comment
                })
            }
        );

    const data =
        await response.json();

    alert(data.message);

    document
        .getElementById("comment-box")
        .style.display = "none";
}
