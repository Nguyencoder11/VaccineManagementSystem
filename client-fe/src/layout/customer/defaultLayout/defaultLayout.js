import {useEffect, useState} from "react";
import Headers from "../header/header";
import Footer from "../footer/footer";
import ChatFrame from "../../../pages/customer/chat";
import ChatGPT from "../../../pages/customer/GPT";
import axios from "axios";

function DefaultLayout({ children }) {
    useEffect(() => {
        // Thêm script Dialogflow vào trang
        const script = document.createElement("script");
        script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
        script.async = true;
        document.body.appendChild(script);

        const styleScript = document.createElement("style");
        styleScript.innerHTML = `
            df-messenger {
                --df-messenger-bot-message: #e0f7fa; /* Nền teal nhạt cho tin nhắn bot */
                --df-messenger-user-message: #f3e5f5; /* Nền hồng nhạt cho tin nhắn người dùng */
                --df-messenger-button-titlebar-color: #ff5722; /* Màu tiêu đề thanh công cụ */
                --df-messenger-font-color: #333333; /* Màu chữ đậm hơn để dễ đọc */
                --df-messenger-chat-background-color: #ffffff; /* Nền khung chat trắng */
                --df-messenger-input-placeholder-font-color: #666666; /* Màu chữ placeholder đậm hơn */
                --df-messenger-send-icon: #ff5722; /* Màu biểu tượng gửi */
            }

            /* Thêm các kiểu bổ sung để cải thiện khả năng đọc */
            df-messenger .df-messenger-chat-title {
                font-size: 16px;
                font-weight: bold;
            }

            df-messenger .df-messenger-bot-message {
                color: #333333; /* Màu chữ đậm hơn cho tin nhắn bot */
            }

            df-messenger .df-messenger-user-message {
                color: #333333; /* Màu chữ đậm hơn cho tin nhắn người dùng */
            }

            /* Kiểu cho văn bản placeholder */
            df-messenger .df-messenger-input-placeholder {
                color: #666666; /* Màu chữ placeholder đậm hơn */
            }
        `;
        document.head.appendChild(styleScript);
        // Cleanup khi component bị unmount
        return () => {
            document.body.removeChild(script);
            document.head.removeChild(styleScript);
        };
    }, []);

    const [messages, setMessages] = useState([
        { role: "assistant", content: "Xin chào! Tôi là trợ lý AI của bạn. Hôm nay tôi có thể giúp gì cho bạn?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY ||
        ""

    useEffect(() => {
        const chatContainer = document.querySelector(".chat-messages");
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const makeApiRequestWithBackoff = async (url, data, headers, retries = 3, baseDelay = 1000) => {
        for(let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await axios.post(url, data, { headers });
                return response;
            } catch (error) {
                if (error.response && error.response.status === 429 && attempt < retries - 1) {
                    const delay = baseDelay * Math.pow(2, attempt) * (1 + 0.1 * Math.random()); // Exponential backoff with jitter
                    console.warn(`Rate limit hit, retrying after ${delay}ms...`);
                    await sleep(delay);
                    continue;
                }
                throw error; // Rethrow other errors or if retries are exhausted
            }
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const newMessages = [...messages, {role: "user", content: input}]
        setMessages(newMessages)
        setInput("")
        setIsLoading(true)

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo", // or "gpt-4" if you have access
                    messages: newMessages,
                    max_tokens: 150,
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            )

            // Add assistant response to state
            const assistantMessage = response.data.choices[0].message.content;
            setMessages([...newMessages, {role: "assistant", content: assistantMessage }]);
        } catch (error) {
            console.error("Error calling OpenAI API:", error.response ? error.response.data : error.message);
            let errorMessage = "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!";
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = "Lỗi xác thực API key. Vui lòng kiểm tra khóa API.";
                } else if (error.response.status === 429) {
                    errorMessage = "Đã vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.";
                } else if (error.response.status === 400) {
                    errorMessage = "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại.";
                }
            }
            setMessages([...newMessages, { role: "assistant", content: errorMessage }]);
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div>
            <Headers/>
            <div className="main-content-web">
                {children}
            </div>
            <Footer/>
            <ChatFrame/>


            {/* Thêm Dialogflow Messenger */}
            <df-messenger
                intent="WELCOME"
                chat-title="Chăm sóc khách hàng"
                agent-id="b47d8d40-5fd9-4103-8670-c42e1ae86fbb"
                language-code="vi"
            ></df-messenger>

            <ChatGPT/>

            {/* Custom ChatGPT-based Chatbot */}
            <div className="chat-container">
                <div className="chat-header">
                    <h3>Chăm sóc khách hàng</h3>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${
                                msg.role === "user" ? "user-message" : "bot-message"
                            }`}
                        >
                            {msg.content}
                        </div>
                    ))}
                    {isLoading && <div className="message bot-message">Đang xử lý...</div>}
                </div>
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Nhập tin nhắn của bạn..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ff5722"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>

            <style>
                {`
                    .chat-container {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        width: 300px;
                        max-height: 400px;
                        background: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        display: flex;
                        flex-direction: column;
                        z-index: 1000;
                    }

                    .chat-header {
                        background: #ff5722;
                        color: #ffffff;
                        padding: 10px;
                        border-radius: 8px 8px 0 0;
                        font-size: 16px;
                        font-weight: bold;
                        text-align: center;
                    }

                    .chat-messages {
                        flex: 1;
                        padding: 10px;
                        overflow-y: auto;
                        background: #ffffff;
                    }

                    .message {
                        margin: 8px 0;
                        padding: 8px 12px;
                        border-radius: 8px;
                        max-width: 80%;
                        font-size: 14px;
                        line-height: 1.4;
                        color: #333333;
                    }

                    .user-message {
                        background: #f3e5f5;
                        margin-left: auto;
                    }

                    .bot-message {
                        background: #e0f7fa;
                        margin-right: auto;
                    }

                    .chat-input-form {
                        display: flex;
                        padding: 10px;
                        border-top: 1px solid #e0e0e0;
                    }

                    .chat-input-form input {
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #e0e0e0;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333333;
                        outline: none;
                    }

                    .chat-input-form input::placeholder {
                        color: #666666;
                    }

                    .chat-input-form button {
                        background: none;
                        border: none;
                        padding: 0 10px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                    }

                    .chat-input-form button:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                `}
            </style>
        </div>
    );

}

export default DefaultLayout;