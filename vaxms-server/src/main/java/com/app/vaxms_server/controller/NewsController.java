package com.app.vaxms_server.controller;

import com.app.vaxms_server.entity.News;
import com.app.vaxms_server.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin
public class NewsController {
    @Autowired
    private NewsService newsService;

    @GetMapping("/public/top-6")
    public ResponseEntity<?> top6() {
        List<News> result = newsService.top6News();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
