package com.app.vaxms_server.controller;

import com.app.vaxms_server.dto.ChatDto;
import com.app.vaxms_server.entity.Chatting;
import com.app.vaxms_server.entity.User;
import com.app.vaxms_server.repository.ChatRepository;
import com.app.vaxms_server.repository.UserRepository;
import com.app.vaxms_server.service.ChatGptService;
import com.app.vaxms_server.service.UserService;
import com.app.vaxms_server.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {
    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private ChatGptService chatGptService;

    @GetMapping("/customer/my-chat")
    public ResponseEntity<?> myChat() {
        List<Chatting> result = chatRepository.myChat(userUtils.getUserWithAuthority().getId());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/staff/getAllUserChat")
    public ResponseEntity<?> getAllUserChat(@RequestParam(value = "search", required = false) String search) {
        if (search == null) {
            search = "";
        }
        search = "%" + search + "%";
        Set<User> list = chatRepository.getAllUserChat(search);
        Set<ChatDto> chatDtoList = new HashSet<>();
        for(User user : list) {
            Chatting chat = chatRepository.findLastChatting(user.getId());
            if (chat != null) {
                ChatDto chatDto = new ChatDto(user, chat.getContent(), calculateTime(chat.getCreatedDate()), chat.getCreatedDate(), " ");
                chatDtoList.add(chatDto);
            } else {
                ChatDto chatDto = new ChatDto(user, "", "0 min", new Timestamp(System.currentTimeMillis()), " ");
                chatDtoList.add(chatDto);
            }
        }
        return new ResponseEntity<>(chatDtoList, HttpStatus.OK);
    }

    @GetMapping("/staff/getListChat")
    public List<Chatting> getListChat(@RequestParam("idreceiver") Long idreceiver) {
        return chatRepository.findByUser(idreceiver);
    }

    public void sort(ArrayList<ChatDto> sub) {
        Collections.sort(sub, new Comparator<ChatDto>() {
            @Override
            public int compare(ChatDto o1, ChatDto o2) {
                return o2.getTimestamp().compareTo(o1.getTimestamp());
            }
        });
    }

    public String calculateTime(Timestamp timestamp) {
        Long now = System.currentTimeMillis();
        Long end = now - timestamp.getTime();

        if(end/1000/60 < 1) {
            return "1 min";
        } else if(end/1000/60 >= 1 && end/1000/60 < 60) {
            Integer x = Math.toIntExact(end / 1000 / 60);
            return x.toString() + " min";
        } else if(end/1000/60/60 >=1 && end/1000/60/60 < 24) {
            Integer x = Math.toIntExact(end / 1000 / 60 / 60);
            return x.toString() + " hour";
        } else if(end/1000/60/60/24 >= 1) {
            Integer x = Math.toIntExact(end / 1000 / 60 / 60 / 24);
            return x.toString() + " day";
        }
        return "0 min";
    }

    @PostMapping("/ask")
    public ResponseEntity<?> customerSendMessage(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        User currentUser = userUtils.getUserWithAuthority();

        // Send to ChatGpt
        String gptReply = chatGptService.askChatGpt(userMessage);

        // Save customer's message
        Chatting userChat = new Chatting();
        userChat.setSender(currentUser);
        userChat.setContent(userMessage);
        userChat.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        chatRepository.save(userChat);

        // Save response from GPT
        Chatting botReply = new Chatting();
        botReply.setSender(currentUser);
        botReply.setContent(gptReply);
        botReply.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        chatRepository.save(botReply);

        return ResponseEntity.ok(Collections.singletonMap("reply", gptReply));
    }
}
