async function sendMessage() {
    let userInput = document.getElementById("userInput").value;
    if (!userInput.trim()) return;

    let chatBox = document.getElementById("chatBox");

    // Show user message
    chatBox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
    
    // Send to backend
    try {
        let response = await fetch("http://127.0.0.1:5000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userInput }),
        });

        let data = await response.json();

        // Show bot response
        chatBox.innerHTML += `<p><strong>Bot:</strong> ${data.answer}</p>`;
    } catch (error) {
        chatBox.innerHTML += `<p><strong>Bot:</strong> Error fetching response.</p>`;
    }

    document.getElementById("userInput").value = ""; // Clear input
}
