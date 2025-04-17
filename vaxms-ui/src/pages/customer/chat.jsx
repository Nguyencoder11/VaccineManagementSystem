import Footer from '../../layout/customer/footer/footer'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import avatar from '../../assest/images/avatar.png'
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { getMethod, postMethod, postMethodPayload, uploadSingleFile } from '../../services/request';
import Swal from 'sweetalert2'
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
// import style from '../../layout/customer/styles/styleuser.scss'

function toggleChat() {
  var chatBox = document.getElementById("chat-box");
  var btnopenchat = document.getElementById("btnopenchat");
  if (chatBox.style.display === "none" || chatBox.style.display === "") {
    chatBox.style.display = "block";
    chatBox.style.bottom = "20px";
    btnopenchat.style.display = 'none'
  }
  else {
    chatBox.style.display = "none";
    btnopenchat.style.display = ''
  }
  var scroll_to_bottom = document.getElementById('scroll-to-bottom');
  scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
}

function ChatFrame() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [itemChat, setItemChat] = useState([]);
  const [client, setClient] = useState(null);
  useEffect(() => {
    var user = localStorage.getItem("user")
    var email = null;
    if (user != null) {
      user = JSON.parse(user);
      email = user.email
      if (user.authorities.name == "Customer") {
        const getItemChat = async () => {
          var response = await getMethod('/api/chat/customer/my-chat');
          var result = await response.json();
          setItemChat(result)
        };
        getItemChat();
      }

    }
    const sock = new SockJS('http://localhost:8080/hello');
    const stompClient = new Client({
      webSocketFactory: () => sock,
      onConnect: () => {
        console.log("WebSocket connected successfully!");
        stompClient.subscribe('/users/queue/messages', (msg) => {
          var isFile = msg.headers.isFile
          if (Number(isFile) === Number(0)) {
            appendTinNhanDen(msg.body)
          }
          else {
            appendFileTinNhanDen(msg.body)
          }
        });
      },
      connectHeaders: {
        username: email  // Truyền email vào header khi kết nối
      }
    });
    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    client.publish({
      destination: '/app/hello/-10',
      body: document.getElementById("contentmess").value,
    });
    append();
  };

  const sendFileMessage = async () => {
    const file = document.getElementById("btnsendfile").files[0];
    if (file) {
      if (isImageFile(file)) {
      } else {
        toast.warning('Đây không phải là file ảnh');
        return;
      }
    }
    var link = await uploadSingleFile(document.getElementById("btnsendfile"));
    appendFile(link)
    client.publish({
      destination: '/app/file/-10/' + document.getElementById("btnsendfile").files[0].name,
      body: link,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      client.publish({
        destination: '/app/hello/-10',
        body: document.getElementById("contentmess").value,
      });
      append();
    }
  };



  function append() {
    const newChatElement = document.createElement('p');
    newChatElement.className = "mychat";
    newChatElement.textContent = document.getElementById("contentmess").value;

    document.getElementById('listchat').appendChild(newChatElement);
    var scroll_to_bottom = document.getElementById('scroll-to-bottom');
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
    document.getElementById("contentmess").value = ''
  }

  function appendFile(link) {
    const newChatElement = document.createElement('img');
    newChatElement.className = "mychatimg";
    newChatElement.src = link;

    document.getElementById('listchat').appendChild(newChatElement);
    var scroll_to_bottom = document.getElementById('scroll-to-bottom');
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
  }

  function appendTinNhanDen(mess) {
    const newChatElement = document.createElement('p');
    newChatElement.className = "adminchat";
    newChatElement.textContent = mess;

    document.getElementById('listchat').appendChild(newChatElement);
    var scroll_to_bottom = document.getElementById('scroll-to-bottom');
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
  }

  function appendFileTinNhanDen(mess) {
    const newChatElement = document.createElement('img');
    newChatElement.className = "adminimg";
    newChatElement.src = mess;

    document.getElementById('listchat').appendChild(newChatElement);
    var scroll_to_bottom = document.getElementById('scroll-to-bottom');
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
  }

  function isImageFile(file) {
    const fileType = file.type;
    return fileType.startsWith('image/');
  }

  var token = localStorage.getItem("token");
  if (token == null) {
    return <></>
  }
  return (
    <div class="chat-container">
      <button class="chat-button" id="btnopenchat" type='button' onClick={() => toggleChat()}><i class="fa fa-comment"></i> Hỗ trợ</button>

      <div id="chat-box" class="chat-box">
        <div class="chat-header">
          <h5>Nhân viên CSKH</h5>
          <button class="close-btn" onClick={() => toggleChat()}>X</button>
        </div>
        <div class="chat-body" id="scroll-to-bottom">
          <div id="listchat">
            {itemChat.map((item, index) => {
              if (item.sender.authorities.name == "Customer") {
                if (item.isFile != true) {
                  return <p class="mychat">{item.content}</p>
                }
                else {
                  return <img class="mychatimg" src={item.content} />
                }
              }
              else {
                if (item.isFile != true) {
                  return <p class="adminchat">{item.content}</p>
                }
                else {
                  return <img class="adminchatimg" src={item.content} />
                }
              }
            })}
          </div>
        </div>
        <input onChange={sendFileMessage} type='file' className='hidden' id='btnsendfile' />
        <div class="chat-footer">
          <input onKeyDown={handleKeyDown} type="text" id="contentmess" placeholder="Nhập tin nhắn..." />
          <i className='fa fa-image imgchatbtn' onClick={() => document.getElementById("btnsendfile").click()}></i>
          <button id="sendmess" onClick={() => sendMessage()}><i className='fa fa-paper-plane'></i></button>
        </div>
      </div>
    </div>
  );
}

export default ChatFrame;