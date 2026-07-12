document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menuBtn");
    const navBar = document.getElementById("navBar");

    // =========================
    // MENU TOGGLE
    // =========================
    if (menuBtn && navBar) {

        // Open/close menu
        menuBtn.addEventListener("click", function (e) {

            e.stopPropagation();

            navBar.classList.toggle("show");
        });

        // Close when clicking outside
        document.addEventListener("click", function (e) {

            if (
                !navBar.contains(e.target) &&
                !menuBtn.contains(e.target)
            ) {

                navBar.classList.remove("show");
            }
        });
    }

    // =========================
    // GET LOGGED-IN USER EMAIL
    // =========================
    const loggedUserEmail =
        localStorage.getItem("loggedRUNCMSUser");

    const userHeading =
        document.getElementById("user-h1");


    // =========================
    // LOAD USER FROM BACKEND
    // =========================
    async function loadUser() {

        // No logged-in user
        if (!loggedUserEmail) {

            alert("No logged-in user found.");

            return;
        }

        try {

            const response = await fetch(
                "http://localhost:3000/api/get-user",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: loggedUserEmail
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            // Backend error
            if (!response.ok) {

                throw new Error(
                    data.message || "Unable to load user"
                );
            }

            // Update heading
            if (userHeading && data.user) {

                userHeading.textContent =
                    "Welcome " +
                    data.user.firstname +"!";
            }

        } catch (error) {

            console.error(error);

            alert("Unable to load user details.");
        }
    }

    // Load user immediately
    loadUser();


    // =========================
    // NAVIGATION LINKS
    // =========================

    const profileBtn =
        document.getElementById("itm-profile");

    if (profileBtn) {

        profileBtn.addEventListener("click", function () {

            window.open(
                "profile.html",
                "_blank"
            );
        });
    }


    const historyBtn =
        document.getElementById("itm-history");

    if (historyBtn) {

        historyBtn.addEventListener("click", function () {

            window.open(
                "runcms-mycomplaints.html",
                "_blank"
            );
        });
    }


    const sessionBtn =
        document.getElementById("itm-sessions");

    if (sessionBtn) {

        sessionBtn.addEventListener("click", function () {

            window.open(
                "runcms-new-compl-full.html",
                "_blank"
            );
        });
    }



    const settingBtn =
        document.getElementById("itm-setting");

    if (settingBtn) {

        settingBtn.addEventListener("click", function () {

            window.open(
                "setting.html",
                "_blank"
            );
        });
    }


    const helpBtn =
        document.getElementById("itm-help");

    if (helpBtn) {

        helpBtn.addEventListener("click", function () {

            window.open(
                "help.html",
                "_blank"
            );
        });
    }

});