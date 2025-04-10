package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    @Query(value = "SELECT * FROM news order by news_id desc limit 6", nativeQuery = true)
    List<News> top6News();
}
