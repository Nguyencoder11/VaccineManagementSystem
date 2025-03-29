package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Chatting;
import com.app.vaxms_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ChatRepository extends JpaRepository<Chatting, Long> {
    @Query()
    List<Chatting> findByUser(Long idUser);

    @Query()
    Set<User> getAllUserChat(String param);

    @Query()
    List<Chatting> myChat(Long id);

    @Query()
    Chatting findLastChatting(Long idUser);
}
