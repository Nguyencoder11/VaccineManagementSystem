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
    @Query(value = "select u from User u where u.email = ?1")
    Optional<User> findByUsername(String username);

    @Query(value = "select u from User u where u.email = ?1")
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phone);

    @Query(value = "select u.* from account u where u.account_id = ?1", nativeQuery = true)
    Optional<User> findById(Long id);

    @Query(value = "select u from User u where u.activationKey = ?1 and u.email = ?2")
    Optional<User> getUserByActivationKeyAndEmail(String key, String email);

    @Query("select u from User u where u.authority.name = ?1")
    List<User> getUserByRole(String role);

    @Query("select u from User u where u.authority.id = :authorityId")
    List<User> findEmployeesByAuthority(@Param("authorityId") Long authorityId);
}
