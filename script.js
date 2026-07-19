// =============================================
// NOVAMIND AI
// SCRIPT.JS - PART 1
// =============================================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const clearChat = document.getElementById("clearChat");

// =============================================
// CREATE MESSAGE
// =============================================

function createMessage(text, sender) {

    const wrapper = document.createElement("div");

    wrapper.className =
        sender === "user"
            ? "user-message"
            : "bot-message";

    const avatar = document.createElement("div");

    avatar.className = "avatar";

    avatar.innerHTML =
        sender === "user"
            ? "👤"
            : "🤖";

    const content = document.createElement("div");

    content.className = "message-content";

    content.innerHTML = text;

    wrapper.appendChild(avatar);

    wrapper.appendChild(content);

    chatBox.appendChild(wrapper);

    chatBox.scrollTop = chatBox.scrollHeight;

}

// =============================================
// THINKING
// =============================================

function showThinking() {

    const thinking = document.createElement("div");

    thinking.className = "bot-message";

    thinking.id = "thinking";

    thinking.innerHTML = `
    
        <div class="avatar">
            🤖
        </div>

        <div class="message-content">

            <b>Novamind AI</b>

            <br><br>

            Thinking...

        </div>

    `;

    chatBox.appendChild(thinking);

    chatBox.scrollTop = chatBox.scrollHeight;

}

function removeThinking() {

    const thinking =
        document.getElementById("thinking");

    if (thinking) {

        thinking.remove();

    }

}

// =============================================
// CLEAR CHAT
// =============================================

if (clearChat) {

    clearChat.onclick = function () {

        chatBox.innerHTML = `

<div class="bot-message">

<div class="avatar">🤖</div>

<div class="message-content">

<b>Hello!</b>

<br><br>

I am <b>Novamind AI</b>.

<br><br>

How can I help you today?

</div>

</div>

`;

    };

}
// =============================================
// SEND MESSAGE
// =============================================

async function sendMessage() {

    const text = userInput.value.trim();

    if (text === "") return;

    createMessage(text, "user");

    userInput.value = "";

    showThinking();

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text
            })

        });

        const data = await response.json();

        removeThinking();

        createMessage(data.reply, "bot");

    }

    catch (error) {

        removeThinking();

        createMessage(

            "❌ <b>Server Error!</b><br>Please check Flask server.",

            "bot"

        );

        console.error(error);

    }

}

// =============================================
// SEND BUTTON
// =============================================

sendBtn.addEventListener("click", () => {

    sendMessage();

});

// =============================================
// ENTER KEY
// =============================================

userInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

        sendMessage();

    }

});

// =============================================
// AUTO FOCUS
// =============================================

window.addEventListener("load", () => {

    userInput.focus();

});
// =============================================
// VOICE ASSISTANT
// =============================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micBtn.addEventListener("click", () => {

        recognition.start();

    });

    recognition.onstart = () => {

        micBtn.innerHTML = "🎙️";

        micBtn.style.background = "#22c55e";

    };

    recognition.onresult = (event) => {

        const transcript =
            event.results[0][0].transcript;

        userInput.value = transcript;

        micBtn.innerHTML = "🎤";

        micBtn.style.background = "";

        // Auto Send
        sendMessage();

    };

    recognition.onend = () => {

        micBtn.innerHTML = "🎤";

        micBtn.style.background = "";

    };

    recognition.onerror = (event) => {

        micBtn.innerHTML = "🎤";

        micBtn.style.background = "";

        console.log("Voice Error:", event.error);

        if (event.error === "not-allowed") {

            alert("Please allow microphone permission.");

        }

    };

} else {

    micBtn.style.display = "none";

}

// =============================================
// AUTO SCROLL
// =============================================

const observer = new MutationObserver(() => {

    chatBox.scrollTop = chatBox.scrollHeight;

});

observer.observe(chatBox, {

    childList: true

});

// =============================================
// LOADING ANIMATION
// =============================================

setInterval(() => {

    const thinking =
        document.getElementById("thinking");

    if (thinking) {

        const box =
            thinking.querySelector(".message-content");

        if (!box) return;

        const dots = box.innerHTML.match(/\./g);

        const count = dots ? dots.length : 0;

        box.innerHTML =
            "<b>Novamind AI</b><br><br>Thinking" +
            ".".repeat((count % 3) + 1);

    }

}, 500);
// =============================================
// COPY CODE BUTTONS
// =============================================

function addCopyButtons() {

    const blocks = document.querySelectorAll("pre");

    blocks.forEach((block) => {

        if (block.querySelector(".copy-btn")) return;

        const btn = document.createElement("button");

        btn.className = "copy-btn";

        btn.innerHTML = "📋 Copy";

        btn.onclick = () => {

            navigator.clipboard.writeText(block.innerText);

            btn.innerHTML = "✅ Copied";

            setTimeout(() => {

                btn.innerHTML = "📋 Copy";

            }, 1500);

        };

        block.style.position = "relative";

        btn.style.position = "absolute";
        btn.style.top = "10px";
        btn.style.right = "10px";
        btn.style.padding = "6px 12px";
        btn.style.border = "none";
        btn.style.borderRadius = "8px";
        btn.style.cursor = "pointer";
        btn.style.background = "#2563eb";
        btn.style.color = "#fff";

        block.appendChild(btn);

    });

}

// =============================================
// OBSERVE CHAT
// =============================================

const chatObserver = new MutationObserver(() => {

    addCopyButtons();

});

chatObserver.observe(chatBox, {

    childList: true,
    subtree: true

});

// =============================================
// SHORTCUTS
// =============================================

document.addEventListener("keydown", (e) => {

    // Ctrl + L = Clear Chat

    if (e.ctrlKey && e.key.toLowerCase() === "l") {

        e.preventDefault();

        if (clearChat) {

            clearChat.click();

        }

    }

});

// =============================================
// STARTUP
// =============================================

window.onload = () => {

    userInput.focus();

    addCopyButtons();

    console.log("✅ Novamind AI Loaded Successfully");

};

// =============================================
// END OF FILE
// =============================================