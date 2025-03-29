package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query()
    List<Feedback> findByUser(Long userId);
}
