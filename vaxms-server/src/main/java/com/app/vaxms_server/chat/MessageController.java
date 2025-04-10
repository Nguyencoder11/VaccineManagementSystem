package com.app.vaxms_server.chat;

import com.app.vaxms_server.entity.Chatting;
import com.app.vaxms_server.entity.User;
import com.app.vaxms_server.repository.ChatRepository;
import com.app.vaxms_server.repository.UserRepository;
import com.app.vaxms_server.utils.Contains;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class MessageController {
    @Autowired
    private SimpMessagingTemplate simpleMessagingTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    @MessageMapping("/hello/{id}")
    public void send(SimpMessageHeaderAccessor sha, @Payload String message, @DestinationVariable String id) {
        System.out.println("sha: " + sha.getUser().getName());
        System.out.println("payload: " + message);
        User receiver = null;
        if(Long.valueOf(id) > 0) {
            receiver = userRepository.findById(Long.valueOf(id)).get();
            System.out.println("users === " + receiver);
        }
        User sender = userRepository.findByUsername(sha.getUser().getName()).get();
        Chatting chatting = new Chatting();
        chatting.setContent(message);
        chatting.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        chatting.setReceiver(receiver);
        chatting.setSender(sender);
        chatRepository.save(chatting);
        Map<String, Object> map = new HashMap<>();
        map.put("sender", sender.getId());
        map.put("isFile", 0);
        if(receiver == null) {
            List<User> list = userRepository.getUserByRole(Contains.ROLE_STAFF);
            for(User user : list) {
                simpleMessagingTemplate.convertAndSendToUser(user.getEmail(), "/queue/messages", message, map);
            }
        } else {
            simpleMessagingTemplate.convertAndSendToUser(receiver.getEmail(), "/queue/messages", message, map);
        }
    }

    @MessageMapping("/file/{id}/{filename}")
    public void sendFile(SimpMessageHeaderAccessor sha, @Payload String message, @DestinationVariable String id, @DestinationVariable String filename) {
        User receiver = null;
        if(Long.valueOf(id) > 0) {
            receiver = userRepository.findById(Long.valueOf(id)).get();
            System.out.println("users === " + receiver);
        }
        User sender = userRepository.findByUsername(sha.getUser().getName()).get();
        Chatting chatting = new Chatting();
        chatting.setContent(message);
        chatting.setIsFile(true);
        chatting.setFileName(filename);
        chatting.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        chatting.setReceiver(receiver);
        chatting.setSender(sender);
        chatRepository.save(chatting);
        Map<String, Object> map = new HashMap<>();
        map.put("sender", sender.getId());
        map.put("isFile", 1);
        if(receiver == null) {
            List<User> list = userRepository.getUserByRole(Contains.ROLE_STAFF);
            for(User user : list) {
                simpleMessagingTemplate.convertAndSendToUser(user.getEmail(), "/queue/messages", message, map);
            }
        } else {
            simpleMessagingTemplate.convertAndSendToUser(receiver.getEmail(), "/queue/messages", message, map);
        }
    }
}
