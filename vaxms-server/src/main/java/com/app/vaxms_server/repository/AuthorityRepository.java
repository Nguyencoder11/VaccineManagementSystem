package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Long> {
    @Query()
    Authority findByName(String name);

    @Query()
    List<Authority> findAll();
}
