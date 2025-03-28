package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Chatting;
import com.app.vaxms_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ChatRepository extends JpaRepository<Chatting, Long> {
    public List<Chatting> findByUser(Long idUser);

    public Set<User> getAllUserChat(String param);

    List<Chatting> myChat(Long id);

    public Chatting findLastChatting(Long idUser);
}
