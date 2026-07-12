document.getElementById("forgot-password").addEventListener("submit", forgotPassword);

async function forgotPassword (e) {
    e.preventDefault();
    
    // let storedUsers = JSON.parse(localStorage.getItem("teechaUsers")) || [];
    let verifyEmail = document.getElementById("verify-email").value.trim().toLowerCase();

    // Basic validation
    if (!verifyEmail) {
        alert("Please provide email address to reset password.");
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/forgotpassword", {

    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        email: verifyEmail
    })
    })

    
    const data = await response.json();

    if (response.ok) {

            alert(data.message);

            // Save reset token temporarily
            localStorage.setItem(
                "passwordResetToken",
                data.resetToken
            );

            window.location.href =
                "teecha-savenewpassword-full.html";

        } else {

            alert(data.message || "Something went wrong.");
        }

    } catch (error) {

        console.log(error);

        alert("Server error. Please try again.");
    }

}

    
