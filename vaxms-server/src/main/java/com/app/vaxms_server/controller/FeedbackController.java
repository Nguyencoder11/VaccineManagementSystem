package com.app.vaxms_server.controller;

import com.app.vaxms_server.entity.Feedback;
import com.app.vaxms_server.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/customer/my-feedback")
    public ResponseEntity<?> getAll() {
        List<Feedback> result = feedbackService.findByUser();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/customer/create")
    public ResponseEntity<?> create(@RequestBody Feedback feedback) {
        Feedback newFeedback = feedbackService.create(feedback);
        return new ResponseEntity<>(newFeedback, HttpStatus.CREATED);
    }

    @DeleteMapping("/customer/delete")
    public void delete(@RequestParam("id") Long id) {
        feedbackService.delete(id);
    }
}
