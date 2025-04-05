package com.app.vaxms_server.service;

import com.app.vaxms_server.entity.News;
import com.app.vaxms_server.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class NewsService {
    @Autowired
    private NewsRepository newsRepository;

    public List<News> top6News() {
        List<News> news = newsRepository.top6News();
        return news;
    }
}
