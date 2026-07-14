document.addEventListener("DOMContentLoaded", function (){
    let suppliedPassword = document.getElementById("upassword")
    let toggleElt = document.getElementById("toggle-password")

    toggleElt.addEventListener("click", function (){
        if (suppliedPassword.type === "password") {
            suppliedPassword.type = "text";
            toggleElt.textContent = "Hide";

    } else{
        suppliedPassword.type = "password";
        toggleElt.textContent = "👁";
    }

    });
    
});

document.getElementById("runcms-login-form")
.addEventListener("submit", userLogin);

async function userLogin(e) {

    e.preventDefault();

    let iUsername =
        document.getElementById("uemail")
        .value
        .trim()
        .toLowerCase();

    let iPassword =
        document.getElementById("upassword")
        .value;

    let message =
        document.getElementById("login-msg");

    if (!iUsername || !iPassword) {

        message.textContent =
            "Please fill in all required fields";

        return;
    }

    function simpleHash(password) {

        return btoa(password);

    }

    try {

        const response =
            await fetch(
                "https://runcmsprod.onrender.com/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({
                        email: iUsername,
                        password:
                            simpleHash(iPassword)
                    })
                }
            );

        const data =
            await response.json();

        console.log(data);

        if (!data.success) {

            message.textContent =
                "Invalid email or password";

            return;
        }

        // Save user details
        localStorage.setItem(
            "user_id",
            data.user.user_id
        );

        localStorage.setItem(
            "loggedRUNCMSUser",
            data.user.email
        );

        localStorage.setItem(
            "firstname",
            data.user.firstname
        );

        localStorage.setItem(
            "role",
            data.user.role
        );

        // Redirect based on role

        switch(data.user.role) {

            case "complainant":

                window.location.href =
                    "runcms-user-full.html";

                break;

            case "officer":

                window.location.href =
                    "runcms-user-officer.html";

                break;

            case "manager":

                window.location.href =
                    "runcms-user-mgr.html";

                break;

            case "admin":

                window.location.href =
                    "runcms-admin-dashboard.html";

                break;

            default:

                message.textContent =
                    "Unknown user role.";

                break;
        }

        document
            .getElementById(
                "runcms-login-form"
            )
            .reset();

    } catch(error) {

        console.error(error);

        message.textContent =
            "Unable to connect to server.";
    }
}
