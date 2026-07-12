const chatbotForm = document.getElementById("chatbot-form");
const messageInput = document.getElementById("message-to-bot");
const chatDisplay = document.getElementById("input-display");

// Stores chat for current session only
let msgHistory = [];

chatbotForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let userInput = messageInput.value.trim();

    if (userInput === "") return;

    // Add user message
    msgHistory.push({
        sender: "user",
        text: userInput
    });

    // Generate bot response
    let botReply = getBotResponse(userInput);

    // Add bot message
    msgHistory.push({
        sender: "bot",
        text: botReply
    });

    // Update chat UI
    updateChat();

    // Clear input
    chatbotForm.reset();
});


// Bot logic
function getBotResponse(message) {

    let msg = message.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi")) {
        return "Hello! How can I help you today?";
    }

    else if (msg.includes("name")) {
        return "I'm RUN CMS Bot";
    }

    else if (msg.includes("how are you")) {
        return "I'm doing great";
    }

    else if (msg.includes("bye")) {
        return "Goodbye";
    }

    else if (msg.includes("help")) {
        return "I can help you  with the following:\
        Register a complaint,\
        List our services,\
        Onboard you,\
        Recommend a service to you";
    }


    else {
        return "Sorry, I don't understand that yet.";
    }
}


// Update chat display
function updateChat() {

    chatDisplay.innerHTML = "";

    msgHistory.forEach((msg) => {

        if (msg.sender === "user") {

            chatDisplay.innerHTML += `
                <div class="record user-msg">
                    <p>
                        <span id="user-msg"> ${msg.text} </span>
                        <img src="user.png" width="3%" class="icon">
                    </p>
                </div>
            `;
        }

        else {

            chatDisplay.innerHTML += `
                <div class="record bot-msg">
                    <p>
                        <img src="robot.png" width="3%" class="icon">
                        <span id="bot-reply"> ${msg.text} </span>
                    </p>
                </div>
            `;
        }
    });

    // Auto scroll to newest message
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}