package com.app.vaxms_server.utils;

import com.app.vaxms_server.entity.CustomerSchedule;
import com.app.vaxms_server.enums.CustomerSchedulePay;
import com.app.vaxms_server.repository.CustomerScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Configuration
@EnableAsync
@EnableScheduling
public class Autorun {
    @Autowired
    private CustomerScheduleRepository customerScheduleRepository;

    @Autowired
    private MailService mailService;

    @Async
    public void checkCustomerSchedule() {
        Timestamp twentyFourHoursAgo = Timestamp.from(Instant.now().minusSeconds(24 * 60 * 60));
        System.out.println("time cronjon: " + twentyFourHoursAgo);
        // lay danh sach cac CustomerSchedule duoc tao sau 24h
        List<CustomerSchedule> recentSchedules = customerScheduleRepository.findByCreatedDateAfter(twentyFourHoursAgo, CustomerSchedulePay.CHUA_THANH_TOAN);
        System.out.println("so luong lich dang ky het han sau 24h: " + recentSchedules.size());
        // Xu li cac ban ghi tim duoc
        recentSchedules.forEach(schedule -> {
            mailService.sendEmail(schedule.getUser().getEmail(), "Lịch đăng ký tiêm đã bị hủy",
                    "<div style='max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #e74c3c; border-radius: 5px; background-color: #fce4e4; color: #e74c3c; font-family: Arial, sans-serif; text-align: center;'>" +
                            "    <h2 style='margin-top: 0;'>Thông Báo Hủy Lịch Đăng Ký Tiêm</h2><br>" +
                            "    <p>Rất tiếc, lịch đăng ký tiêm của bạn đã bị hủy tự động sau 24h.</p>" +
                            "    <span>Tên mũi tiêm: </span>"+ schedule.getVaccineScheduleTime().getVaccineSchedule().getVaccine().getName()+"<br>"+
                            "    <span>Ngày đăng ký: </span>"+ schedule.getCreatedDate()+"<br>"+
                            "    <p style='margin-bottom: 0;'>Nếu cần thêm thông tin, vui lòng liên hệ trung tâm hỗ trợ.</p>" +
                            "    <a href='localhost:3000' style='margin-top: 15px; padding: 10px 20px; background-color: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer;'>" +
                            "        Liên hệ hỗ trợ" +
                            "    </a>" +
                            "</div>"
                    , false, true);
            customerScheduleRepository.deleteById(schedule.getId());
        });
    }
}
