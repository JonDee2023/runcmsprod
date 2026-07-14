document.addEventListener("DOMContentLoaded", function (){
    let suppliedPassword = document.getElementById("cr8-password")
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

document.addEventListener("DOMContentLoaded", function (){
    let suppliedPassword = document.getElementById("con-password")
    let toggleElts = document.getElementById("toggles-password")

    toggleElts.addEventListener("click", function (){
        if (suppliedPassword.type === "password") {
            suppliedPassword.type = "text";
            toggleElts.textContent = "Hide";

    } else{
        suppliedPassword.type = "password";
        toggleElts.textContent = "👁";
    }

    });
    
});


document.getElementById("runcms-signup-form").addEventListener("submit", userSignup);
async function userSignup(event) {

    event.preventDefault();

    let userFirstName = document.getElementById("userfn").value.trim();
    let userLastName = document.getElementById("userln").value.trim();
    //let userSex = document.getElementById("usersex").value.trim();
    let userPhoneNumber = document.getElementById("userphone").value.trim();
    let userEmail = document.getElementById("useremail").value.trim().toLowerCase();
    //let userDoB = document.getElementById("userdob").value;
    //let userDP = document.getElementById("userdp").files[0];
    let userCr8Password = document.getElementById("cr8-password").value;
    let userConfPassword = document.getElementById("con-password").value;

    // 🔹 Basic validation
    if (!userFirstName || !userLastName || !userEmail || !userPhoneNumber || !userCr8Password || !userConfPassword) {
        alert("Please fill in all required fields.");
        return; // stop execution
    }

    if (userCr8Password !== userConfPassword){
            alert("Passwords do not match, enter same password in both fields.");
        return;
        }

    else {
        alert("Input data taken");
      
    }


    // 🔹 Simple hash function (for learning only)
    function simpleHash(password) {
        return btoa(password); // encode to base64 (NOT secure, just demo)
    }

    

    const response = await fetch("https://runcmsprod.onrender.com/api/signup", {

    method: "POST",

    headers: {"Content-type": "application/json"},

    body: JSON.stringify({
        firstname: userFirstName,
        lastname: userLastName,
        email: userEmail,
        phone: userPhoneNumber,
        password: simpleHash(userCr8Password)
        

    })
})
    
    const data = await response.json();

    console.log(data);

    console.log("Signup script loaded");

    const emailError = document.getElementById("email-error");

    if (!response.ok) {

        emailError.textContent = data.message;
        return;
    }

    emailError.textContent = "";

    document.getElementById("runcms-signup-form").reset();

} 


    
