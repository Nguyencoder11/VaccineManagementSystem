package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Chatting;
import com.app.vaxms_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ChatRepository extends JpaRepository<Chatting, Long> {
    @Query("select c from Chatting c where (c.sender.id = ?1 or c.receiver.id = ?1)")
    List<Chatting> findByUser(Long idUser);

    @Query("select c.sender from Chatting c where c.receiver is null and (c.sender.email like ?1) ")
    Set<User> getAllUserChat(String param);

    @Query("select c from Chatting c where c.sender.id = ?1 or c.receiver.id = ?1")
    List<Chatting> myChat(Long id);

    @Query(value = "select c.* from chatting c where (c.sender = ?1 or c.receiver = ?1) order by id desc limit 1 offset 0", nativeQuery = true)
    Chatting findLastChatting(Long idUser);
}
