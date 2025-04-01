package com.app.vaxms_server.utils;

import jakarta.mail.*;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@EnableAsync
public class MailService {
    @Autowired
    private JavaMailSender mailSender;

    private final Logger log = LoggerFactory.getLogger(MailService.class);
    private final JavaMailSender javaMailSender;

    public MailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    final static String username = "lenhnguyen10a22003@gmail.com";

    @Async
    public void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml) {
        log.debug(
                "Send email[multipart '{}' and html '{}'] to '{}' with subject '{}' and content={}",
                isMultipart,
                isHtml,
                to,
                subject,
                content
        );


        // Prepare message using a Spring helper
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
            message.setTo(to);
            message.setFrom(username);
            message.setSubject(subject);
            System.out.println("subject: " + subject);
            message.setText(content, isHtml);
            System.out.println("content: " + content);
            javaMailSender.send(mimeMessage);
            log.debug("Sent email to User '{}'", to);
        } catch (MailException | MessagingException e) {
            log.warn("Email could not be sent to user '{}'", to, e);
        }
    }

    public void sendVaccinationScheduleNotification(String to, String customerName, String appointmentDate, String username, String password) {
        String subject = "Thông báo lịch tiêm chủng";
        String body = "Xin chào " + customerName + ",\n\n"
                + "Dưới đây là thông tin tài khoản của bạn:\n"
                + "Tên tài khoản: " + username + "\n"
                + "Mật khẩu: " + password + "\n\n"
                + "Bạn có lịch tiêm chủng vào ngày: " + appointmentDate + ".\n"
                + "Vui lòng đến đúng giờ và mang theo giấy tờ cần thiết.\n\n"
                + "Trân trọng,\nĐội ngũ hỗ trợ";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("lenhnguyen10a22003@gmail.com");

        mailSender.send(message);
    }
}
