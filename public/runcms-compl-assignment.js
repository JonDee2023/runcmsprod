document.addEventListener(
    "DOMContentLoaded",
    loadOfficers
);

async function loadOfficers() {

    try {

        const response =
            await fetch(
                "http://localhost:3000/api/officers"
            );

        const officers =
            await response.json();

        const select =
            document.getElementById(
                "officer-select"
            );

        officers.forEach(officer => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                officer.user_id;

            option.textContent =
                `${officer.firstname}
                 ${officer.lastname}`;

            select.appendChild(option);

        });

    } catch(err){

        console.error(err);

    }
}




document
.getElementById("assign-complaint-form")
.addEventListener("submit", assignComplaint);

async function assignComplaint(e){

    e.preventDefault();

    const complaint_id =
        document.getElementById("complaint-id").value;

    const officer_id =
        document.getElementById("officer-id").value;

    const response = await fetch(
        "http://localhost:3000/api/assign-complaint",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                complaint_id,
                officer_id
            })
        }
    );

    const data = await response.json();

    document.getElementById("assign-message")
        .textContent = data.message;
}