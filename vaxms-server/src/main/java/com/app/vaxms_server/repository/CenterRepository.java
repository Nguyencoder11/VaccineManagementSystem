package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.Center;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CenterRepository extends JpaRepository<Center, Long> {
    Optional<Center> findByCenterName(String id);
    Optional<Center> findByCity(String city);
}
