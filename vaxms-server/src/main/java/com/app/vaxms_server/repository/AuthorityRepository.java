package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Long> {

    public Authority findByName(String name);

    public List<Authority> findAll();
}
