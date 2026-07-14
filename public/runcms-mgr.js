
let selectedComplaintId = null;

// LOAD COMPLAINTS
document.addEventListener("DOMContentLoaded", loadComplaints);

async function loadComplaints() {

    const res = await fetch("https://runcmsprod.onrender.com/api/manager/complaints");
    const data = await res.json();

    const tbody = document.querySelector("#complaintsTable tbody");
    tbody.innerHTML = "";

    data.complaints.forEach(c => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${c.complaint_id}</td>
            <td>${c.complainant}</td>
            <td>${c.subject}</td>
            <td>${c.category}</td>
            <td>${c.priority}</td>
            <td>${c.current_status}</td>
            <td>
                <button onclick="openAssign(${c.complaint_id})">Assign</button>
                <button onclick="openStatus(${c.complaint_id})">Status</button>
            </td>
            <td>
                <button
                    onclick="openComment(${c.complaint_id})">
                    Add Comment
                </button>
            </td>

        `;

        tbody.appendChild(row);
    });
}

// LOAD OFFICERS
async function loadOfficers() {

    const res = await fetch("https://runcmsprod.onrender.com/api/manager/officers");
    const officers = await res.json();

    const select = document.getElementById("officerSelect");
    select.innerHTML = "";

    officers.forEach(o => {

        const opt = document.createElement("option");
        opt.value = o.user_id;
        opt.textContent = `${o.firstname} ${o.lastname}`;
        select.appendChild(opt);
    });
}

// OPEN ASSIGN
function openAssign(id) {
    selectedComplaintId = id;
    document.getElementById("assignBox").style.display = "block";
    loadOfficers();
}

// ASSIGN
async function assignComplaint() {

    const officer_id = document.getElementById("officerSelect").value;

    const user_id = localStorage.getItem("user_id");

    await fetch("https://runcmsprod.onrender.com/apiocalhostocalhostttpOSTetchpi/manager/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            complaint_id: selectedComplaintId,
            officer_id,
            updated_by: user_id
        })
    });

    alert("Assigned!");
    location.reload();
}

// OPEN STATUS
function openStatus(id) {
    selectedComplaintId = id;
    document.getElementById("statusBox").style.display = "block";
}

// UPDATE STATUS
async function updateStatus() {

    const status = document.getElementById("statusSelect").value;
    const user_id = localStorage.getItem("user_id");

    await fetch("https://runcmsprod.onrender.com/api/manager/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            complaint_id: selectedComplaintId,
            status,
            updated_by: user_id
        })
    });

    alert("Status updated!");
    location.reload();
}

// ADD COMMENT

let commentComplaintId = null;

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
