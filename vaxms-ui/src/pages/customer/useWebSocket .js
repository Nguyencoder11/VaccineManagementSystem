import { useEffect, useState } from 'react';

const useWebSocket = (url) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(url);
        setSocket(ws);

        ws.onmessage = (event) => {
            setMessages(prevMessages => [...prevMessages, event.data]);
        };

        return () => {
            ws.close();
        };
    }, [url]);

    const sendMessage = (message) => {
        if (socket) {
            socket.send(message);
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;