const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const pool = require("../db-connection.js");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// SIGNUP

router.post("/signup", async (req, res) => {

    const role = "complainant";

    const {firstname, lastname, email, phone, password} = req.body;

    try {

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT email FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }
    
        const newUser = await pool.query(
        "INSERT INTO users (firstname, lastname, email, phone, role, password) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [firstname, lastname, email, phone,  role, password]
        );

            res.json(newUser.rows[0]);

  } catch (err) {
    console.error(err.message);
  }

});




// USER-LOGIN
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (user.rows.length === 0) {
      return res.json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.json({
      success: true,
      user: user.rows[0]
    });

  } catch (err) {
    console.error(err.message);
  }

});



// FORGOT PASSWORD

router.post("/forgotpassword", async (req, res) => {

  try {

    const { email } = req.body;

    // Verify email exists
    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    // No user found
    if (user.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "No account associated with this email"
      });

    }

    // User found
    const foundUser = user.rows[0];

    res.status(200).json({
      success: true,
      message:
        `Email verified. ${foundUser.firstname}, you can now reset your password.`
    });

  } catch (err) {

    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});



// SAVE NEW PASSWORD

router.post("/savenewpassword", async (req, res) => {

    try {

        const { email, newPassword } = req.body;

        // Check if user exists
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Update password directly (already hashed in frontend)
        await pool.query(
            "UPDATE users SET password = $1 WHERE email = $2",
            [newPassword, email]
        );

        res.status(200).json({
            success: true,
            message: "Password updated successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }

});


// GET-USER

router.post("/get-user", async (req, res) => {

    try {

        // Get email from frontend
        const { email } = req.body;

        // Basic validation
        if (!email) {

            return res.status(400).json({
                message: "Email is required"
            });
        }

        // Find user in database
        const user = await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        // No user found
        if (user.rows.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        // Send user data
        res.status(200).json({
            user: user.rows[0]
        });

    } catch (err) {

        console.error(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// GET CATEGORIES
router.get(
"/complaint-categories",
async (req, res) => {

    try {

        const categories =
            await pool.query(
                `
                SELECT
                    category_id,
                    category
                FROM complaint_categories
                ORDER BY category
                `
            );

        res.json(
            categories.rows
        );

    } catch(err){

        console.error(err);

        res.status(500).json({
            message:
            "Unable to load categories"
        });
    }
});

// SUBMIT COMPLAINT
router.post(
"/submit-complaint",
async (req, res) => {

    try {

        const {
            complainant_id,
            category,
            subject,
            description,
            priority

        } = req.body;

        //const complaintNumber =
        //    "CMP-" +
        //    Date.now();

        const complaint =
            await pool.query(
                `
                INSERT INTO complaints
                (
                    complainant_id,
                    category,
                    subject,
                    description,
                    priority,
                    current_status
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    'submitted'
                )
                RETURNING *
                `,
                [
                    complainant_id,
                    category,
                    subject,
                    description,
                    priority
                ]
            );

        res.status(201).json({

            success:true,

            message:
                "Complaint submitted successfully.",

            complaint:
                complaint.rows[0]

        });

    } catch(err){

        console.error(err);

        res.status(500).json({

            success:false,

            message:
                "Unable to submit complaint."

        });
    }
});

// GET USER COMPLAINT HISTORY

// GET USER COMPLAINT HISTORY

router.get("/my-complaints/:user_id", async (req, res) => {

    try {

        const { user_id } = req.params;

        const complaints = await pool.query(
            `
            SELECT
                c.complaint_id,
                c.subject,
                c.category,
                c.priority,
                c.current_status,
                c.submitted_at,
                cc.comment
            FROM complaints c
            JOIN complaint_comment cc
            ON c.complaint_id = cc.complaint_id
            WHERE complainant_id = $1
            ORDER BY submitted_at DESC
            `,
            [user_id]
        );

        res.status(200).json({
            success: true,
            complaints: complaints.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to load complaint history."
        });
    }
});

// GET ALL COMPLAINTS (MANAGER VIEW)
router.get("/manager/complaints", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                c.complaint_id,
                c.subject,
                c.category,
                c.priority,
                c.current_status,
                c.submitted_at,
                u.firstname || ' ' || u.lastname AS complainant
            FROM complaints c
            JOIN users u
                ON c.complainant_id = u.user_id
            ORDER BY c.submitted_at DESC
        `);

        res.json({
            success: true,
            complaints: result.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to fetch complaints"
        });
    }
});

// GET OFFICERS

router.get("/manager/officers", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT user_id, firstname, lastname
            FROM users
            WHERE role = 'officer'
            ORDER BY firstname
        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to fetch officers"
        });
    }
});


// ASSIGN COMPLAINT

router.post("/manager/assign", async (req, res) => {

    try {

        const {
            complaint_id,
            officer_id,
            updated_by
        } = req.body;

        await pool.query(`
            INSERT INTO complaint_assignment
            (
                complaint_id,
                assigned_to,
                updated_by,
                assigned_at
            )
            VALUES ($1, $2, $3, NOW())
        `, [
            complaint_id,
            officer_id,
            updated_by
        ]);

        await pool.query(`
            UPDATE complaints
            SET current_status = 'Assigned',
                updated_by = $2,
                updated_at = NOW()
            WHERE complaint_id = $1
        `, [
            complaint_id,
            updated_by
        ]);

        res.json({
            success: true,
            message: "Complaint assigned successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Assignment failed"
        });
    }
});

// UPDATE STATUS

router.post("/manager/update-status", async (req, res) => {

    try {

        const {
            complaint_id,
            status,
            updated_by
        } = req.body;

        await pool.query(`
            UPDATE complaints
            SET current_status = $2,
                updated_by = $3,
                updated_at = NOW()
            WHERE complaint_id = $1
        `, [
            complaint_id,
            status,
            updated_by
        ]);

        res.json({
            success: true,
            message: "Status updated"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Status update failed"
        });
    }
});

// ADD COMMENT

router.post("/manager/comment", async (req, res) => {

    try {

        const {
            complaint_id,
            user_id,
            comment
        } = req.body;

        await pool.query(`
            INSERT INTO complaint_comment
            (
                complaint_id,
                user_id,
                comment,
                updated_at
            )
            VALUES ($1, $2, $3, NOW())
        `, [
            complaint_id,
            user_id,
            comment
        ]);

        res.json({
            success: true,
            message: "Comment added"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Comment failed"
        });
    }
});

// GET ASSIGNED COMPLAINTS

router.get(
"/officer/complaints/:officer_id",
async (req, res) => {

    try {

        const { officer_id } =
            req.params;

        const complaints =
            await pool.query(
                `
                SELECT
                    c.complaint_id,
                    c.subject,
                    c.category,
                    c.description,
                    c.priority,
                    c.current_status,
                    c.submitted_at
                FROM complaints c
                INNER JOIN complaint_assignment a
                    ON c.complaint_id =
                       a.complaint_id
                WHERE a.assigned_to = $1
                ORDER BY c.submitted_at DESC
                `,
                [officer_id]
            );

        res.json({
            success: true,
            complaints:
                complaints.rows
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message:
                "Unable to load complaints."
        });
    }
});

// UPDATE COMPLAINT STATUS (OFFICER)

router.post(
"/officer/update-status",
async (req, res) => {

    try {

        const {
            complaint_id,
            status,
            officer_id,
            comment
        } = req.body;

        await pool.query(
            `
            UPDATE complaints
            SET current_status = $1
            WHERE complaint_id = $2
            `,
            [
                status,
                complaint_id
            ]
        );

        await pool.query(
            `
            INSERT INTO complaint_history
            (
                complaint_id,
                status,
                updated_by,
                comment
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            `,
            [
                complaint_id,
                status,
                officer_id,
                comment
            ]
        );

        if(comment){

            await pool.query(
                `
                INSERT INTO complaint_comment
                (
                    complaint_id,
                    user_id,
                    comment
                )
                VALUES
                (
                    $1,
                    $2,
                    $3
                )
                `,
                [
                    complaint_id,
                    officer_id,
                    comment
                ]
            );
        }

        res.json({
            success: true,
            message:
                "Complaint updated successfully."
        });

    } catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            message:
                "Unable to update complaint."
        });
    }
});

// ADD COMMENT

router.post(
"/add-comment",
async (req, res) => {

    try {

        const {
            complaint_id,
            user_id,
            comment
        } = req.body;

        await pool.query(
            `
            INSERT INTO complaint_comment
            (
                complaint_id,
                user_id,
                comment,
                updated_at
            )
            VALUES
            (
                $1,
                $2,
                $3,
                NOW()
            )
            `,
            [
                complaint_id,
                user_id,
                comment
            ]
        );

        res.json({
            success:true,
            message:"Comment added."
        });

    } catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            message:"Unable to add comment."
        });
    }
});



// GET-OFFICER

router.get("/officers", async (req, res) => {

    try {

        const officers = await pool.query(
            `
            SELECT user_id,
                   firstname,
                   lastname
            FROM users
            WHERE role = 'officer'
            ORDER BY firstname
            `
        );

        res.json(officers.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to load officers."
        });
    }
});


// GET-COMPLAINT
router.get("/complaints", async (req, res) => {

    try {

        const complaints =
            await pool.query(
                `
                SELECT complaint_id,
                       complaint_number,
                       subject
                FROM complaints
                ORDER BY complaint_id DESC
                `
            );

        res.json(
            complaints.rows
        );

    } catch(err){

        console.error(err);

        res.status(500).json({
            message:
            "Unable to load complaints"
        });
    }
});



// ASSGIN COMPLAINT
router.post("/assign-complaint", async (req, res) => {

    try {

        const {
            complaint_id,
            officer_id
        } = req.body;

        await pool.query(
            `
            INSERT INTO complaint_assignment
            (
                complaint_id,
                assigned_to,
                assigned_at
            )
            VALUES
            (
                $1,
                $2,
                NOW()
            )
            `,
            [
                complaint_id,
                officer_id
            ]
        );

        await pool.query(
            `
            UPDATE complaints
            SET current_status='Assigned'
            WHERE complaint_id=$1
            `,
            [complaint_id]
        );

        res.json({
            success: true,
            message: "Complaint assigned successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Assignment failed."
        });
    }
});


// ADD-COMMENT

router.post("/add-comment", async (req, res) => {

    try {

        const {
            complaint_id,
            user_id,
            comment
        } = req.body;

        await pool.query(
            `
            INSERT INTO complaint_comment
            (
                complaint_id,
                user_id,
                comment
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
            `,
            [
                complaint_id,
                user_id,
                comment
            ]
        );

        res.json({
            success:true,
            message:"Comment added."
        });

    } catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            message:"Unable to add comment."
        });
    }
});

// GET COMPLAINT STATUS

router.get("/statuses", async (req, res) => {

    try {

        const statuses =
            await pool.query(
                `
                SELECT status_id,
                       status_name
                FROM complaint_status
                ORDER BY status_id
                `
            );

        res.json(
            statuses.rows
        );

    } catch(err){

        console.error(err);

        res.status(500).json({
            message:
            "Unable to load statuses"
        });
    }
});

module.exports = router;