import { useEffect } from "react";
import Headers from "../header/header";
import Footer from "../footer/footer";
import ChatFrame from "../../../pages/customer/chat";

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

    return (
        <div>
            <Headers />
            <div className="main-content-web">
                {children}
            </div>
            <Footer />
            <ChatFrame />


            {/* Thêm Dialogflow Messenger */}
            <df-messenger
                intent="WELCOME"
                chat-title="Chăm sóc khách hàng"
                agent-id="b47d8d40-5fd9-4103-8670-c42e1ae86fbb"
                language-code="vi"
            ></df-messenger>
        </div>
    );
}

export default DefaultLayout;