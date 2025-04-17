import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import avatar from "../../assest/images/avatar.png";
import styles from "./staffChat.module.scss";
import { getMethod, uploadSingleFile } from "../../services/request";

const StaffChat = () => {
  const [client, setClient] = useState(null);
  const [itemUser, setItemUser] = useState([]); 
  const [itemChat, setItemChat] = useState([]); // Initialize as empty array
  const [email, setEmail] = useState(null);
  const [newMessagesCount, setNewMessagesCount] = useState({});

  useEffect(() => {
    const getItemUser = async () => {
      try {
        const response = await getMethod("/api/chat/staff/getAllUserChat");
        const result = await response.json();
        if (Array.isArray(result)) {
          setItemUser(result);
        } else {
          console.error("Expected array but got:", typeof result);
          setItemUser([]);
        }
      } catch (error) {
        console.error("Error fetching user chat list:", error);
        setItemUser([]);
      }
    };

    const getMess = async () => {
      const uls = new URL(document.URL);
      const id = uls.searchParams.get("user");
      const email = uls.searchParams.get("email");

      if (id && email) {
        try {
          const response = await getMethod(
            `/api/chat/staff/getListChat?idreciver=${id}`
          );
          const result = await response.json();
          if (Array.isArray(result)) {
            setItemChat(result);
          } else {
            console.error("Expected array but got:", typeof result);
            setItemChat([]);
          }
          setEmail(email);
        } catch (error) {
          console.error("Error fetching chat messages:", error);
          setItemChat([]);
        }
      }
    };

    getItemUser();
    getMess();

    const userlc = localStorage.getItem("user");
    const userEmail = JSON.parse(userlc)?.email;
    const sock = new SockJS("http://localhost:8080/hello");
    const stompClient = new Client({
      webSocketFactory: () => sock,
      onConnect: () => {
        console.log("WebSocket connected successfully!");
        stompClient.subscribe("/users/queue/messages", (msg) => {
          const Idsender = msg.headers.sender;
          const isFile = Number(msg.headers.isFile);
          const messageContent = msg.body;

          const uls = new URL(document.URL);
          const currentUserId = uls.searchParams.get("user");

          const newMessage = {
            sender: Idsender === currentUserId ? Idsender : userEmail,
            content: messageContent,
            isFile: isFile === 1,
          };

          setItemChat((prevChat) => [...(Array.isArray(prevChat) ? prevChat : []), newMessage]);
        });
      },
      connectHeaders: {
        username: userEmail,
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    const uls = new URL(document.URL);
    const id = uls.searchParams.get("user");
    const messageContent = document.getElementById("contentmess").value;

    if (client && id && messageContent.trim()) {
      client.publish({
        destination: `/app/hello/${id}`,
        body: messageContent,
      });
      document.getElementById("contentmess").value = "";
    }
  };

  async function loadMessage(user) {
    if (!user || !user.id) {
      console.error("Invalid user object passed to loadMessage:", user);
      return;
    }

    try {
      setNewMessagesCount((prevState) => {
        const newState = { ...prevState };
        delete newState[user.id];
        return newState;
      });

      window.location.href = `chat?user=${user.id}&email=${user.email}`;
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  const sendFileMessage = async () => {
    const fileInput = document.getElementById("btnsendfile");
    const file = fileInput?.files?.[0];
    if (!file) return;

    try {
      const link = await uploadSingleFile(fileInput);
      const uls = new URL(document.URL);
      const id = uls.searchParams.get("user");

      if (client && id) {
        client.publish({
          destination: `/app/file/${id}/${file.name}`,
          body: link,
        });
      }
      
      // Clear the file input
      fileInput.value = "";
    } catch (error) {
      console.error("Error sending file:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const searchKey = async () => {
    const param = document.getElementById("keysearchuser")?.value || "";
    try {
      const response = await getMethod(
        `/api/chat/staff/getAllUserChat?search=${param}`
      );
      const result = await response.json();
      if (Array.isArray(result)) {
        setItemUser(result);
      } else {
        console.error("Expected array but got:", typeof result);
        setItemUser([]);
      }
    } catch (error) {
      console.error("Error searching user chat:", error);
      setItemUser([]);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.headerTitle}>Chats</span>
        </div>
        <div className={styles.searchWrapper}>
          <input
            onKeyUp={searchKey}
            id="keysearchuser"
            className={styles.searchInput}
            type="text"
            placeholder="Search..."
          />
        </div>
        <ul className={styles.userList}>
          {Array.isArray(itemUser) && itemUser.map((item, index) => {
            const newCount = newMessagesCount[item?.user?.id] || 0;
            return (
              <li
                key={index}
                className={styles.userItem}
                onClick={() => item?.user && loadMessage(item.user)}
              >
                <img src={avatar} className={styles.avatar} alt="Avatar" />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{item?.user?.email || "Unknown"}</span>
                </div>
                {newCount > 0 && (
                  <span className={styles.unreadBadge}>{newCount}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.chatArea}>
        {email == null ? (
          <div className={styles.noChatSelected}>
            <p>Select a conversation to start chatting.</p>
          </div>
        ) : (
          <>
            <div className={styles.chatHeader}>
              <span className={styles.chatTitle}>{email}</span>
            </div>
            <div className={styles.chatContent} id="listchatadmin">
              {Array.isArray(itemChat) && itemChat.length > 0 ? (
                itemChat.map((item, index) => {
                  const isCustomer = item.sender !== email;
                  const messageClass = isCustomer
                    ? styles.customer
                    : styles.admin;
                  const messageType = item.isFile ? styles.image : "";

                  return (
                    <div
                      key={index}
                      className={`${styles.message} ${messageClass} ${messageType}`}
                    >
                      {item.isFile ? (
                        <img src={item.content} alt="Message" />
                      ) : (
                        <p>{item.content}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No messages available.</p>
              )}
            </div>

            <div className={styles.chatFooter}>
              <input
                onKeyDown={handleKeyDown}
                type="text"
                id="contentmess"
                className={styles.inputMessage}
                placeholder="Write a message..."
              />
              <button
                className={styles.iconButton}
                onClick={() => document.getElementById("btnsendfile").click()}
              >
                <i className="fa fa-image"></i>
              </button>
              <button
                onClick={sendMessage}
                className={styles.sendButton}
                id="sendmess"
              >
                <i className="fa fa-paper-plane"></i>
              </button>
              <input
                onChange={sendFileMessage}
                type="file"
                id="btnsendfile"
                style={{ display: "none" }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffChat;