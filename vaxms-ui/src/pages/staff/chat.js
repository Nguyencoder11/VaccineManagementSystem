import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Client } from "@stomp/stompjs";
import avatar from "../../assets/images/avatar.png";
import SockJS from "sockjs-client";
import styles from "./staffChat.module.scss"; // Đổi tên tệp và import CSS Module
import {
  getMethod,
  postMethod,
  postMethodPayload,
  uploadSingleFile,
} from "../../services/request";
const StaffChat = () => {
  // const [message, setMessage] = useState("");
  // const [chatMessages, setChatMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [itemUser, setItemUser] = useState([]);
  const [itemChat, setItemChat] = useState([]);
  // const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [newMessagesCount, setNewMessagesCount] = useState({});

  useEffect(() => {
    const getItemUser = async () => {
      var response = await getMethod("/api/chat/staff/getAllUserChat");
      var result = await response.json();
      setItemUser(result);
    };
    getItemUser();

    const getMess = async () => {
      var uls = new URL(document.URL);
      var id = uls.searchParams.get("user");
      var email = uls.searchParams.get("email");
      if (id != null && email != null) {
        var response = await getMethod(
          "/api/chat/staff/getListChat?idreciver=" + id
        );
        var result = await response.json();
        setItemChat(result);
        setEmail(email);
      }
    };
    getMess();

    var userlc = localStorage.getItem("user");
    var email = JSON.parse(userlc).email;
    const sock = new SockJS("http://localhost:8080/hello");
    const stompClient = new Client({
      webSocketFactory: () => sock,
      onConnect: () => {
        console.log("WebSocket connected successfully!");
        stompClient.subscribe("/users/queue/messages", (msg) => {
          var Idsender = msg.headers.sender;
          var isFile = msg.headers.isFile;
          var uls = new URL(document.URL);
          var currentUserId = uls.searchParams.get("user");

          if (Idsender !== currentUserId) {
            // Nếu tin nhắn đến từ người dùng khác, tăng số lượng tin nhắn mới
            setNewMessagesCount((prevState) => {
              const count = prevState[Idsender] ? prevState[Idsender] + 1 : 1;
              return { ...prevState, [Idsender]: count };
            });
          } else {
            // Nếu tin nhắn đến từ người dùng hiện tại đang chat, thêm vào giao diện
            if (Number(isFile) === Number(0)) {
              appendTinNhanDen(msg.body, Idsender);
            } else {
              appendFileTinNhanDen(msg.body, Idsender);
            }
          }
        });
        // stompClient.subscribe("/users/queue/seen", (msg) => {
        //   const senderId = msg.headers.sender;
        //   var uls = new URL(document.URL);
        //   var currentUserId = uls.searchParams.get("user");

        //   if (senderId === currentUserId) {
        //     // Thêm trạng thái "Đã xem" vào giao diện
        //     addSeenStatusToMessages();
        //   }
        // });

      },
      connectHeaders: {
        username: email, // Truyền email vào header khi kết nối
      },
    });
    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);
  const sendMessage = () => {
    var uls = new URL(document.URL);
    var id = uls.searchParams.get("user");
    client.publish({
      destination: "/app/hello/" + id,
      body: document.getElementById("contentmess").value,
    });
    append();
  };

  const sendFileMessage = async () => {
    const file = document.getElementById("btnsendfile").files[0];
    if (file) {
      if (isImageFile(file)) {
      } else {
        toast.warning("Đây không phải là file ảnh");
        return;
      }
    }
    var link = await uploadSingleFile(document.getElementById("btnsendfile"));
    appendFile(link);
    var uls = new URL(document.URL);
    var id = uls.searchParams.get("user");
    client.publish({
      destination:
        "/app/file/" +
        id +
        "/" +
        document.getElementById("btnsendfile").files[0].name,
      body: link,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      var uls = new URL(document.URL);
      var id = uls.searchParams.get("user");
      client.publish({
        destination: "/app/hello/" + id,
        body: document.getElementById("contentmess").value,
      });
      append();
    }
  };

  // function addSeenStatusToMessages() {
  //   // Giả sử bạn thêm lớp CSS 'seen' vào tin nhắn cuối cùng của bạn
  //   var messages = document.querySelectorAll(`.${styles.adminchat}`);
  //   if (messages.length > 0) {
  //     var lastMessage = messages[messages.length - 1];
  //     var seenElement = document.createElement("span");
  //     seenElement.className = styles.seenStatus;
  //     seenElement.textContent = "Đã xem";
  //     lastMessage.appendChild(seenElement);
  //   }
  // }

  function append() {
    const newChatElement = document.createElement("div");
    newChatElement.className = "adminchat"; // Sử dụng tên class toàn cục

    const messageContent = document.createElement("p");
    messageContent.textContent = document.getElementById("contentmess").value;

    // const messageTime = document.createElement("span");
    // messageTime.className = "messageTime"; // Sử dụng tên class toàn cục
    // messageTime.textContent = new Date().toLocaleString();

    newChatElement.appendChild(messageContent);
    // newChatElement.appendChild(messageTime);

    document.getElementById("listchatadmin").appendChild(newChatElement);
    var scroll_to_bottom = document.getElementById("listchatadmin");
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
    document.getElementById("contentmess").value = "";
  }

  function appendFile(link) {
    const newChatElement = document.createElement("img");
    newChatElement.className = "adminchatimg"; // Sử dụng tên class toàn cục
    newChatElement.src = link;

    document.getElementById("listchatadmin").appendChild(newChatElement);
    var scroll_to_bottom = document.getElementById("listchatadmin");
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
  }


  const searchKey = async () => {
    var param = document.getElementById("keysearchuser").value;
    var response = await getMethod(
      "/api/chat/staff/getAllUserChat?search=" + param
    );
    var result = await response.json();
    setItemUser(result);
  };

  async function loadMessage(u) {
    // Reset số lượng tin nhắn mới
    setNewMessagesCount((prevState) => {
      const newState = { ...prevState };
      delete newState[u.id];
      return newState;
    });

    // // Gửi thông báo "Đã xem" tới server
    // client.publish({
    //   destination: "/app/seen/" + u.id,
    //   body: "", // Nội dung có thể để trống
    // });

    // Tải tin nhắn và cập nhật giao diện
    window.location.href = "chat?user=" + u.id + "&email=" + u.email;
  }

  function appendTinNhanDen(mess, Idsender) {
    var uls = new URL(document.URL);
    var id = uls.searchParams.get("user");

    if (Idsender != id) {
      return;
    }

    const newChatElement = document.createElement("div");
    newChatElement.className = "mychat"; // Sử dụng tên class toàn cục

    const messageContent = document.createElement("p");
    messageContent.textContent = mess;

    // const messageTime = document.createElement("span");
    // messageTime.className = "messageTime";
    // messageTime.textContent = new Date().toLocaleString();

    newChatElement.appendChild(messageContent);
    // newChatElement.appendChild(messageTime);

    document.getElementById("listchatadmin").appendChild(newChatElement);
    var scroll_to_bottom = document.getElementById("listchatadmin");
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
  }


  function appendFileTinNhanDen(mess, Idsender) {
    var uls = new URL(document.URL);
    var id = uls.searchParams.get("user");

    if (Idsender != id) {
      return;
    }
    const newChatElement = document.createElement("img");
    newChatElement.className = "mychatimg"; // Sử dụng tên class toàn cục
    newChatElement.src = mess;
    document.getElementById("listchatadmin").appendChild(newChatElement);
    var scroll_to_bottom = document.getElementById("listchatadmin");
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
  }


  function isImageFile(file) {
    const fileType = file.type;
    return fileType.startsWith("image/");
  }

  const badgeNewMessageStyle = {
    backgroundColor: 'red',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '50%',
    marginLeft: '5px',
    fontSize: '12px',
  };

  return (
    <div className={styles.chatContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.headerTitle}>Chats</span>
          {/* Optional header icon */}
          {/* <i className={`fa fa-plus ${styles.headerIcon}`}></i> */}
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
          {itemUser.map((item, index) => {
            const newCount = newMessagesCount[item.user.id] || 0;
            return (
              <li
                key={index}
                className={styles.userItem}
                onClick={() => loadMessage(item.user)}
              >
                <img src={avatar} className={styles.avatar} alt="Avatar" />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{item.user.email}</span>
                  {/* You can display the last message if available */}
                  {/* <span className={styles.lastMessage}>{item.lastMessage}</span> */}
                </div>
                {newCount > 0 && (
                  <span className={styles.unreadBadge}>{newCount}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        {email == null ? (
          <div className={styles.noChatSelected}>
            <p>Select a conversation to start chatting.</p>
          </div>
        ) : (
          <>
            <div className={styles.chatHeader}>
              <span className={styles.chatTitle}>{email}</span>
              <div className={styles.chatOptions}>
                {/* Optional chat header icons */}
                {/* <button className={styles.iconButton}><i className="fa fa-search"></i></button> */}
              </div>
            </div>
            <div className={styles.chatContent} id="listchatadmin">
              {itemChat.map((item, index) => {
                const isCustomer = item.sender.authorities.name === 'Customer';
                const messageClass = isCustomer ? styles.customer : styles.admin;
                const messageType = item.isFile ? styles.image : '';

                return item.isFile ? (
                  <div
                    key={index}
                    className={`${styles.message} ${messageClass} ${messageType}`}
                  >
                    <img src={item.content} alt="Message" />
                  </div>
                ) : (
                  <div
                    key={index}
                    className={`${styles.message} ${messageClass}`}
                  >
                    {item.content}
                  </div>
                );
              })}
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
                onClick={() => document.getElementById('btnsendfile').click()}
              >
                <i className="fa fa-image"></i>
              </button>
              <button
                onClick={() => sendMessage()}
                className={styles.sendButton}
                id="sendmess"
              >
                <i className="fa fa-paper-plane"></i>
              </button>
              <input
                onChange={sendFileMessage}
                type="file"
                id="btnsendfile"
                style={{ display: 'none' }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffChat;
