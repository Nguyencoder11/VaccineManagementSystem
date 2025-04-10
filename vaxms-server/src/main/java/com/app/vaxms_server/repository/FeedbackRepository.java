package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query("select f from Feedback f where f.customerSchedule.user.id = ?1")
    List<Feedback> findByUser(Long userId);
}
