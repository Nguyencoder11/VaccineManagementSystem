package com.app.vaxms_server.controller;

import com.app.vaxms_server.dto.*;
import com.app.vaxms_server.entity.Authority;
import com.app.vaxms_server.entity.User;
import com.app.vaxms_server.exception.MessageException;
import com.app.vaxms_server.jwt.JwtTokenProvider;
import com.app.vaxms_server.repository.AuthorityRepository;
import com.app.vaxms_server.repository.UserRepository;
import com.app.vaxms_server.service.GoogleOAuth2Service;
import com.app.vaxms_server.service.UserService;
import com.app.vaxms_server.utils.MailService;
import com.app.vaxms_server.utils.UserUtils;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {
    private final UserRepository userRepository;
    private final UserUtils userUtils;
    private final JwtTokenProvider jwtTokenProvider;
    private final MailService mailService;

    @Autowired
    private UserService userService;
    @Autowired
    private AuthorityRepository authorityRepository;

    public UserController(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, UserUtils userUtils, MailService mailService) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userUtils = userUtils;
        this.mailService = mailService;
    }

    @Autowired
    private GoogleOAuth2Service googleOAuth2Service;

    @PostMapping("/login/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody String credential) throws Exception {
        GoogleIdToken.Payload payload = googleOAuth2Service.verifyToken(credential);
        if (payload == null) {
            throw new MessageException("Đăng nhập thất bại");
        }
        TokenDto tokenDto = userService.loginWithGoogle(payload);
        return new ResponseEntity<>(tokenDto, HttpStatus.OK);
    }

    @PostMapping("/login/email")
    public ResponseEntity<?> loginWithEmail(@RequestBody LoginDto loginDto) throws Exception {
        TokenDto tokenDto = userService.login(loginDto.getEmail(), loginDto.getPassword());
        return new ResponseEntity<>(tokenDto, HttpStatus.OK);
    }

    @PostMapping("/admin/update-role")
    public ResponseEntity<?> updateRole(@RequestParam Long userId, @RequestParam Long authorityId) throws Exception {
        userService.updateRole(userId, authorityId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/public/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequest userRequest) {
        User result = userService.registerUser(userRequest);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/public/regis")
    public ResponseEntity<?> regisUser(@RequestBody UserRequest userRequest) {
        User result = userService.regisUser(userRequest);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/public/active-account")
    public ResponseEntity<?> activeAccount(@RequestBody ActiveAccountDto activeAccountDto) {
        try {
            userService.activeAccount(activeAccountDto.getKey(), activeAccountDto.getEmail());
            SuccessResponse successResponse = new SuccessResponse("Kích hoạt thành công");
            return new ResponseEntity<>(successResponse, HttpStatus.OK);
        } catch (MessageException e) {
            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse("Đã xảy ra lỗi", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/public/send-request-forgot-password")
    public ResponseEntity<?> forgetPassword(@RequestBody ForgotPasswordDto forgotPasswordDto) {
        userService.sendRequestForgotPassword(forgotPasswordDto.getEmail(), forgotPasswordDto.getUrl());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/public/complete-forgot-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email,
                                           @RequestParam String key,
                                           @RequestParam String password) {
        userService.confirmResetPassword(email, key, password);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/all/user-logged")
    public ResponseEntity<?> infoLogged(){
        return new ResponseEntity<>(userUtils.getUserWithAuthority(), HttpStatus.OK);
    }

    @PostMapping("/all/update-info")
    public void updateInfo(@RequestBody UserUpdate userUpdate){
        userService.updateInfo(userUpdate);
    }

    @PostMapping("/all/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordDto passwordDto) {
        userService.changePassword(passwordDto.getOldPassword(), passwordDto.getNewPassword());
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @PostMapping("/admin/lockOrUnlockUser")
    public void activeOrUnactiveUser(@RequestParam("id") Long id) {
        User user = userRepository.findById(id).get();
        if (user.getActived() == true) {
            user.setActived(false);
            userRepository.save(user);
            return;
        } else {
            user.setActived(true);
            userRepository.save(user);
        }
    }

    @PostMapping("/admin/change-role")
    public void changeRole(@RequestParam("id") Long id, @RequestParam String role) {
        User user = userRepository.findById(id).get();
        Authority authority = authorityRepository.findByName(role);
        user.setAuthority(authority);
        userRepository.save(user);
    }

    @GetMapping("/admin/get-user-by-role")
    public ResponseEntity<?> getUserByRole(@RequestParam(value = "role", required = false) String role) {
        List<User> users = userService.getUserByRole(role);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id) {
        try {
            userRepository.deleteById(id);
        } catch (Exception e) {
            throw new MessageException("Tài khoản đã liên kết dữ liệu không thể xóa");
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/check-role-admin")
    public void checkRoleAdmin() {
        System.out.println("admin");
    }

    @GetMapping("/user/check-role-user")
    public void checkRoleUser() {
        System.out.println("user");
    }

    @GetMapping("/{accountId}/roles")
    public ResponseEntity<List<String>> getUserRoles(@PathVariable Long accountId) {
        List<String> roles = userService.getRolesByAccountId(accountId);
        if (roles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonList("Không tìm thấy quyền cho tài khoản này."));
        }
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/employee/check-role-employee")
    public void checkRoleEmp() {
        System.out.println("user");
    }











}
