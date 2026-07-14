let userHeading = document.getElementById("user-h1");

const form = document.getElementById("new-complaint-form");

// Get logged-in tutor email from login storage (temporary but simple)
const loggedUserEmail = localStorage.getItem("loggedRUNCMSUser");



// Load complaint categories
document.addEventListener(
    "DOMContentLoaded",
    loadCategories
);

async function loadCategories(){

    try {

        const response =
            await fetch(
                "https://runcmsprod.onrender.com/api/complaint-categories"
            );

        const categories =
            await response.json();

        const categorySelect =
            document.getElementById(
                "category"
            );

        categories.forEach(category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.category;

            option.textContent =
                category.category;

            categorySelect.appendChild(
                option
            );

        });

    } catch(err){

        console.error(err);

    }
}


// OPTIONAL: fetch user info directly from backend using email
async function loadUser() {

    try {

        const response = await fetch("https://runcmsprod.onrender.com/api/get-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: loggedUserEmail
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        if (userHeading) {
            userHeading.textContent = "Dear " + data.user.firstname +",";

            localStorage.setItem("user_id", data.user.user_id);
        }

    } catch (error) {
        console.error(error);
        alert("Unable to load user");
    }
}

// Load user on page load
loadUser();



document
.getElementById("new-complaint-form")
.addEventListener(
    "submit",
    submitComplaint
);

async function submitComplaint(e){

    e.preventDefault();

    const response =
        await fetch(
            "https://runcmsprod.onrender.com/api/submit-complaint",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    complainant_id:
                    localStorage.getItem("user_id"),

                    category:
                    document.getElementById("category").value,

                    subject:
                    document.getElementById("complaint-subject").value,

                    description:
                    document.getElementById("complaint-description").value,

                    priority:
                    document.getElementById("priority").value

                })
            }
        );

    const data =
        await response.json();

    document
        .getElementById(
            "submission-message"
        )
        .textContent =
        data.message;

    if(response.ok){

        document
            .getElementById(
                "new-complaint-form"
            )
            .reset();
    }
}


