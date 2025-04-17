package com.app.vaxms_server.controller;

import com.app.vaxms_server.dto.VaccineRes;
import com.app.vaxms_server.entity.Vaccine;
import com.app.vaxms_server.repository.CustomerScheduleRepository;
import com.app.vaxms_server.repository.PaymentRepository;
import com.app.vaxms_server.repository.UserRepository;
import com.app.vaxms_server.repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/statistic")
public class StatiticsController {

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private VaccineRepository vaccineRepository;
    @Autowired
    private CustomerScheduleRepository customerScheduleRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/admin/revenue-year")
    public List<Double> doanhThu(@RequestParam("year") Integer year) {
        List<Double> list = new ArrayList<>();
        for(int i=1; i< 13; i++){
            Double sum = paymentRepository.calDt(i, year);
            if(sum == null){
                sum = 0D;
            }
            list.add(sum);
        }
        return list;
    }

    @GetMapping("/admin/vaccine-bc")
    public List<VaccineRes> vaccineRes(){
        List<VaccineRes> list = new ArrayList<>();
        List<Vaccine> vaccines = vaccineRepository.findAll();

        for(Vaccine v : vaccines){
            Integer count = customerScheduleRepository.countRegisByVaccine(v.getId());
            VaccineRes vaccineRes = new VaccineRes();
            vaccineRes.setVaccine(v);
            vaccineRes.setSold(count);
            if(vaccineRes.getSold() != 0){
                list.add(vaccineRes);
            }
        }
        Collections.sort(list, (s1, s2) -> Integer.compare(s2.getSold(), s1.getSold()));
        return list;
    }

    @GetMapping("/admin/thong-ke")
    public ResponseEntity<?> thongKe(){
        Map<String, Object> map = new HashMap<>();
        Date date = new java.sql.Date(System.currentTimeMillis());
        String[] str = date.toString().split("-");
        Integer year = Integer.valueOf(str[0]);
        Integer month = Integer.valueOf(str[1]);
        Double doanhThuThangNay = paymentRepository.calDt(month, year);
        map.put("doanhThuThangNay", doanhThuThangNay);
        Double doanhThuHomNay = paymentRepository.calToday(java.sql.Date.valueOf(LocalDate.now()));
        map.put("doanhThuHomNay", doanhThuHomNay);
        Long nunUser = userRepository.count();
        map.put("nunUser", nunUser);
        Long nunVaccine = vaccineRepository.count();
        map.put("nunVaccine", nunVaccine);
        return new ResponseEntity<>(map, HttpStatus.OK);
    }
}
