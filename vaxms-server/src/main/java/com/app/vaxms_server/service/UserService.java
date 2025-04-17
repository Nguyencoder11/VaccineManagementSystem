package com.app.vaxms_server.service;

import com.app.vaxms_server.dto.UserRequest;
import com.app.vaxms_server.dto.UserUpdate;
import com.app.vaxms_server.entity.Authority;
import com.app.vaxms_server.entity.CustomerProfile;
import com.app.vaxms_server.utils.Contains;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.app.vaxms_server.dto.CustomerUserDetails;
import com.app.vaxms_server.dto.TokenDto;
import com.app.vaxms_server.entity.User;
import com.app.vaxms_server.enums.UserType;
import com.app.vaxms_server.exception.MessageException;
import com.app.vaxms_server.jwt.JwtTokenProvider;
import com.app.vaxms_server.repository.AuthorityRepository;
import com.app.vaxms_server.repository.CustomerProfileRepository;
import com.app.vaxms_server.repository.UserRepository;
import com.app.vaxms_server.utils.MailService;
import com.app.vaxms_server.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Component
public class UserService {
    private static final Logger logger = Logger.getLogger(UserService.class.getName());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    public TokenDto login(String email, String password) throws Exception {
        Optional<User> users = userRepository.findByEmail(email);

        if(users.isPresent()) {
            if(users.get().getUserType().equals(UserType.google)) {
                throw new MessageException("Hãy đăng nhập bằng google");
            }
        }
        // Kiem tra thong tin user
        System.out.println(email);
        checkUser(users);

        if(passwordEncoder.matches(password, users.get().getPassword())) {
            CustomerUserDetails customerUserDetails = new CustomerUserDetails(users.get());
            String token = jwtTokenProvider.generateToken(customerUserDetails);
            TokenDto tokenDto = new TokenDto();
            tokenDto.setToken(token);
            tokenDto.setUser(users.get());
            return tokenDto;
        } else {
            throw new MessageException("Mật khẩu không chính xác", 400);
        }
    }

    public TokenDto loginWithGoogle(GoogleIdToken.Payload payload) throws Exception {
        User user = new User();
        user.setEmail(payload.getEmail());
        user.setActived(true);
        user.setAuthority(authorityRepository.findByName(Contains.ROLE_CUSTOMER));
        user.setCreatedDate(new Date(System.currentTimeMillis()));
        user.setUserType(UserType.google);

        Optional<User> users = userRepository.findByEmail(user.getEmail());
        // Kiem tra thong tin nguoi dung
        if(users.isPresent()) {
            if(users.get().getActived() == false) {
                throw new MessageException("Tài khoản đã bị khóa");
            }

            CustomerUserDetails customerUserDetails = new CustomerUserDetails(users.get());
            String token = jwtTokenProvider.generateToken(customerUserDetails);
            TokenDto tokenDto = new TokenDto();
            tokenDto.setToken(token);
            tokenDto.setUser(users.get());
            CustomerProfile ex = customerProfileRepository.findByUser(users.get().getId());
            if(ex == null) {
                CustomerProfile customerProfile = new CustomerProfile();
                customerProfile.setUser(users.get());
                customerProfileRepository.save(customerProfile);
            }
            return tokenDto;
        } else {
            User u = userRepository.save(user);
            CustomerProfile customerProfile = new CustomerProfile();
            customerProfile.setUser(u);
            customerProfileRepository.save(customerProfile);
            CustomerUserDetails customerUserDetails = new CustomerUserDetails(u);
            String token = jwtTokenProvider.generateToken(customerUserDetails);
            TokenDto tokenDto = new TokenDto();
            tokenDto.setToken(token);
            tokenDto.setUser(u);
            return tokenDto;
        }
    }

    public Boolean checkUser(Optional<User> users) {
        if(users.isPresent() == false) {
            throw new MessageException("Không tìm thấy tài khoản", 404);
        } else if(users.get().getActivationKey() != null && users.get().getActived() == false) {
            throw new MessageException("Tài khoản chưa được kích hoạt", 300);
        } else if(users.get().getActived() == false && users.get().getActivationKey() == null) {
            throw new MessageException("Tài khoản đã bị khóa", 500);
        }
        return true;
    }

    public User regisUser(UserRequest userRequest) {
        userRepository.findByEmail(userRequest.getEmail())
                .ifPresent(exist -> {
                   if(exist.getActivationKey() != null) {
                       throw new MessageException("Tài khoản chưa được kích hoạt", 330);
                   }
                   throw new MessageException("Email đã được sử dụng", 400);
                });
        User user = new User();
        user.setUserType(UserType.standard);
        user.setPassword(userRequest.getPassword());
        user.setAuthority(authorityRepository.findByName(Contains.ROLE_CUSTOMER));
        user.setActived(false);
        user.setEmail(userRequest.getEmail());
        user.setCreatedDate(new Date(System.currentTimeMillis()));
        user.setActivationKey(userUtils.randomKey());
        User result = userRepository.save(user);
        mailService.sendEmail(user.getEmail(), "Xác nhận tài khoản của bạn", "Cảm ơn bạn đã tin tưởng và xử dụng dịch vụ của chúng tôi:<br>" +
                "Để kích hoạt tài khoản của bạn, hãy nhập mã xác nhận bên dưới để xác thực tài khoản của bạn<br><br>" +
                "<a style=\"background-color: #2f5fad; padding: 10px; color: #fff; font-size: 18px; font-weight: bold;\">" + user.getActivationKey() + "</a>", false, true);
        CustomerProfile customerProfile = new CustomerProfile();
        customerProfile.setUser(result);
        customerProfileRepository.save(customerProfile);
        return result;
    }

    public User registerUser(UserRequest userRequest) {
        userRepository.findByEmail(userRequest.getEmail())
                .ifPresent(exist -> {
                   if(exist.getActivationKey() != null) {
                       throw new MessageException("Tài khoản chưa được kích hoạt", 330);
                   }
                    throw new MessageException("Email đã được sử dụng", 400);
                });
        User user = new User();
        user.setUserType(UserType.standard);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setAuthority(authorityRepository.findByName(Contains.ROLE_CUSTOMER));
        user.setActived(false);
        user.setEmail(userRequest.getEmail());
        user.setCreatedDate(new Date(System.currentTimeMillis()));
        user.setActivationKey(userUtils.randomKey());

        User result = userRepository.save(user);

        mailService.sendEmail(user.getEmail(), "Xác nhận tài khoản của bạn",
                "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi:<br>" +
                        "Để kích hoạt tài khoản của bạn, hãy nhập mã xác nhận bên dưới để xác thực tài khoản của bạn<br><br>" +
                        "<a style=\"background-color: #2f5fad; padding: 10px; color: #fff; font-size: 18px; font-weight: bold;\">" +
                        user.getActivationKey() + "</a>", false, true);

        return result;
    }

    public void activeAccount(String key, String email) {
        logger.info("Bắt đầu kích hoạt tài khoản cho email: " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                   logger.severe("Không tìm thấy user với email: " + email);
                   return new MessageException("Email không tồn tại", 404);
                });

        logger.info("User tìm thấy: " + user.getEmail());
        logger.info("Mã kích hoạt từ yêu cầu: " + key + ", Mã kích hoạt trong DB: " + user.getActivationKey());

        if(user.getActived()) {
            logger.warning("User đã được kích hoạt: " + email);
            throw new MessageException("Tài khoản đã được kích hoạt trước đó", 400);
        }

        if(user.getActivationKey() == null || !key.equals(user.getActivationKey())) {
            logger.warning("Key kích hoạt không hợp lệ cho email: " + email);
            throw new MessageException("Mã kích hoạt không hợp lệ", 400);
        }

        user.setActived(true);
        user.setActivationKey(null);
        userRepository.save(user);
        logger.info("Trạng thái tài khoản sau khi lưu: Actived = " + user.getActived() + ", Activation Key = " + user.getActivationKey());
        logger.info("User đã được kích hoạt thành công: " + email);
    }

    public void updateRole(Long userId, Long authorityId) {
        User user = userRepository.findById(userId).get();
        Authority authority = authorityRepository.findById(authorityId).get();
        user.setAuthority(authority);
        userRepository.save(user);
    }

    public void sendRequestForgotPassword(String email, String url) {
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent()) {
            if(user.get().getUserType().equals(UserType.google)) {
                throw new MessageException("Tài khoản đăng nhập bằng google, không thể thực hiện chức năng này");
            }
        }
        checkUser(user);
        String random = userUtils.randomKey();
        user.get().setRememberKey(random);
        userRepository.save(user.get());

        mailService.sendEmail(email, "Đặt lại mật khẩu", "Cảm ơn bạn đã tin tưởng và xử dụng dịch vụ của chúng tôi:<br>" +
                "Chúng tôi đã tạo một mật khẩu mới từ yêu cầu của bạn<br>" +
                "Hãy lick vào bên dưới để đặt lại mật khẩu mới của bạn<br><br>" +
                "<a href='" + url + "?email=" + email + "&key=" + random + "' style=\"background-color: #2f5fad; padding: 10px; color: #fff; font-size: 18px; font-weight: bold;\">Đặt lại mật khẩu</a>", false, true);

    }

    public void confirmResetPassword(String email, String password, String key) {
        Optional<User> user = userRepository.findByEmail(email);
        checkUser(user);
        if(user.get().getRememberKey().equals(key)) {
            user.get().setPassword(passwordEncoder.encode(password));
            userRepository.save(user.get());
        } else {
            throw new MessageException("Mã xác thực không chính xác");
        }
    }

    public void updateInfo(UserUpdate userUpdate) {
        User user = userUtils.getUserWithAuthority();

        userRepository.save(user);
    }

    public void changePassword(String oldPassword, String newPassword) {
        User user = userUtils.getUserWithAuthority();
        if(user.getUserType().equals(UserType.google)) {
            throw new MessageException("Xin lỗi, chức năng này không hỗ trợ đăng nhập bằng google");
        }
        if(oldPassword.equals(user.getPassword())) {
            user.setPassword(newPassword);
            userRepository.save(user);
        } else {
            throw new MessageException("Mật khẩu cũ không chính xác", 500);
        }
    }

    public List<User> getUserByRole(String role) {
        if(role == null) {
            return userRepository.findAll();
        }
        return userRepository.getUserByRole(role);
    }

    public List<User> getEmployeesByAuthority(Long authorityId) {
        return userRepository.findEmployeesByAuthority(authorityId);
    }

    public List<String> getRolesByAccountId(Long accountId) {
        Optional<User> userOpt = userRepository.findById(accountId);
        if(userOpt.isPresent()) {
            Authority authority = userOpt.get().getAuthority();
            return Collections.singletonList(authority.getName());
        }
        return Collections.emptyList();
    }

}
