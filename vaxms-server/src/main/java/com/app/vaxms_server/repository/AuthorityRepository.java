package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Long> {
    @Query("select a from Authority a where a.name = ?1")
    Authority findByName(String name);

    @Query("select a from Authority a")
    List<Authority> findAll();
}
