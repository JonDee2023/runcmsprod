document.addEventListener(
    "DOMContentLoaded",
    loadComplaintHistory
);

async function loadComplaintHistory() {

    try {

        const userId =
            localStorage.getItem("user_id");

        if (!userId) {

            alert(
                "Please login first."
            );

            return;
        }

        const response =
            await fetch(
                `https://runcmsprod.onrender.com/api/my-complaints/${userId}`
            );

        const data =
            await response.json();

        if (!data.success) {

            alert(data.message);

            return;
        }

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

                <td>${complaint.priority}</td>

                <td class="status-${complaint.current_status.toLowerCase().replace(' ','-')}">
                    ${complaint.current_status}
                </td>


                <td>
                    ${new Date(complaint.submitted_at
                    ).toLocaleString()}
                </td>

                <td>${complaint.comment}</td>

                `;

                tbody.appendChild(
                    row
                );
            }
        );

    } catch (err) {

        console.error(err);

        alert(
            "Unable to load complaint history."
        );
    }
}
