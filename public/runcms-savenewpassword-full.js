document.getElementById("save-new-password")
.addEventListener("submit", saveNewPassword);

async function saveNewPassword(e) {
    e.preventDefault();

    let verifiedEmail = document.getElementById("verified-email").value.trim().toLowerCase();
    let newPassword = document.getElementById("new-password").value;
    let confirmPassword = document.getElementById("confirm-password").value;

    if (!verifiedEmail || !newPassword || !confirmPassword) {
        alert("Complete all the fields");
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Simple hash (demo only)
    function simpleHash(password) {
        return btoa(password);
    }

    const hashedPassword = simpleHash(newPassword);

    try {
        const response = await fetch("http://localhost:3000/api/savenewpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: verifiedEmail,
                newPassword: hashedPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            window.location.href = "runcms-login-full.html";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.log(error);
        alert("Server error.");
    }
}