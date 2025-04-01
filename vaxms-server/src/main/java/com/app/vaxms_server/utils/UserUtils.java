package com.app.vaxms_server.utils;

import com.app.vaxms_server.config.SecurityUtils;
import com.app.vaxms_server.dto.CustomerUserDetails;
import com.app.vaxms_server.entity.User;
import com.app.vaxms_server.repository.UserRepository;
import org.apache.catalina.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserUtils implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.get() == null) {
            throw new UsernameNotFoundException(username);
        }
        return new CustomerUserDetails(user.get());
    }

    public User getUserWithAuthority() {
        try {
            Long id = Long.valueOf(SecurityUtils.getCurrentUserLogin().get());
            return userRepository.findById(id).get();
        } catch (Exception e) {
            return null;
        }
    }

    public String randomKey() {
        String str = "1234567890";
        Integer length = str.length()-1;
        StringBuilder sb = new StringBuilder("");
        for (int i = 0; i < 6; i++) {
            Integer random = (int) (Math.random() * length);
            sb.append(str.charAt(random));
        }
        return String.valueOf(sb);
    }
}
