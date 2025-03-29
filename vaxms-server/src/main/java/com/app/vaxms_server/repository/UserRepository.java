package com.app.vaxms_server.repository;

import com.app.vaxms_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query()
    Optional<User> findByUsername(String username);

    @Query()
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phone);

    @Query()
    Optional<User> findById(Long id);

    @Query()
    Optional<User> getUserByActivationKeyAndEmail(String key, String email);

    @Query()
    List<User> getUserByRole(String role);

    @Query()
    List<User> findEmployeesByAuthority(@Param("authorityId") Long authorityId);
}
