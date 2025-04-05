package com.app.vaxms_server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

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
