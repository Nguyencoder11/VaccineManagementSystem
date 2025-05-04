import React, {useState, useEffect} from "react";
const ChatGPT = () => {
    const [chatMessages, setChatMessages] = useState([])
    const [userInput, setUserInput] = useState("")

    const handleSend = async () => {
        if(!userInput.trim()) return

        const userMessage = {
            sender: "user",
            text: userInput
        }
        setChatMessages((prev) => [...prev, userMessage])

        try {
            const response = await fetch("http://localhost:9090/api/chat/customer/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {message: userInput}
                )
            })

            const data = await response.json()
            const botMessage = {
                sender: "bot",
                text: data.reply
            }
            setChatMessages((prev) => [...prev, botMessage])
        } catch (error) {
            console.log("Error sending message:", error)
        }

        setUserInput()
    }

    return (
        <div style={styles.chatBox}>
            <div style={styles.chatArea}>
                {chatMessages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.message,
                            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                            backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#f1f0f0"
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            <div style={styles.inputArea}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Gửi tin nhắn..."
                    style={styles.input}
                />
                <button onClick={handleSend} style={styles.button}>Gửi</button>
            </div>
        </div>
    )
}

const styles = {
    chatBox: {
        width: "100%",
        maxWidth: 500,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 10,
        height: "70vh"
    },
    chatArea: {
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 10,
        marginBottom: 10
    },
    inputArea: {
        display: "flex",
        gap: 10
    },
    input: {
        flex: 1,
        padding: 8,
        borderRadius: 4,
        border: "1px solid #ccc"
    },
    button: {
        padding: "8px 16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        cursor: "pointer"
    },
    message: {
        padding: 10,
        borderRadius: 6,
        maxWidth: "80%",
        wordWrap: "break-word"
    }
};

export default ChatGPT