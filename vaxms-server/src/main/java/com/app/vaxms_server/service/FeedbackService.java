package com.app.vaxms_server.service;

import com.app.vaxms_server.entity.Feedback;
import com.app.vaxms_server.entity.User;
import com.app.vaxms_server.enums.FeedbackType;
import com.app.vaxms_server.exception.MessageException;
import com.app.vaxms_server.repository.FeedbackRepository;
import com.app.vaxms_server.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;

@Component
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserUtils userUtils;

    public List<Feedback> findByUser() {
        User user = userUtils.getUserWithAuthority();
        return feedbackRepository.findByUser(user.getId());
    }

    public Feedback create(Feedback feedback) {
        feedback.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        if(feedback.getDoctor() == null && feedback.getNurse() == null) {
            feedback.setFeedbackType(FeedbackType.general);
        }
        if (feedback.getDoctor() != null) {
            feedback.setFeedbackType(FeedbackType.doctor);
        }
        if (feedback.getNurse() != null) {
           feedback.setFeedbackType(FeedbackType.nurse);
        }
        feedbackRepository.save(feedback);
        return feedback;
    }

    public void delete(Long id) {
        Feedback feedback = feedbackRepository.findById(id).get();
        if(feedback.getCustomerSchedule().getUser().getId() != userUtils.getUserWithAuthority().getId()) {
            throw new MessageException("401 access denied");
        }
        feedbackRepository.deleteById(id);
    }
}
