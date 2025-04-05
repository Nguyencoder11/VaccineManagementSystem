package com.app.vaxms_server.service;

import com.app.vaxms_server.controller.VaccineScheduleController;
import com.app.vaxms_server.entity.CustomerSchedule;
import com.app.vaxms_server.entity.Vaccine;
import com.app.vaxms_server.entity.VaccineSchedule;
import com.app.vaxms_server.exception.MessageException;
import com.app.vaxms_server.repository.CustomerScheduleRepository;
import com.app.vaxms_server.repository.VaccineRepository;
import com.app.vaxms_server.repository.VaccineScheduleRepository;
import com.app.vaxms_server.repository.VaccineScheduleTimeRepository;
import com.app.vaxms_server.utils.MailService;
import com.app.vaxms_server.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Component
public class VaccineScheduleService {
    private static final Logger log = LoggerFactory.getLogger(VaccineScheduleController.class);

    @Autowired
    private VaccineScheduleRepository vaccineScheduleRepository;
    @Autowired
    private VaccineScheduleTimeRepository vaccineScheduleTimeRepository;
    @Autowired
    private CustomerScheduleRepository customerScheduleRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private VaccineRepository vaccineRepository;
    @Autowired
    private MailService mailService;

    /*
     * api này dùng để thêm lịch tiêm vaccine
     * */
    public VaccineSchedule save(VaccineSchedule vaccineSchedule) {
        Vaccine vaccine = vaccineRepository.findById(vaccineSchedule.getVaccine().getId()).get();
        if(vaccine.getInventory() == null) {
            throw new MessageException("Vaccine không đủ số lượng");
        }
        if(vaccine.getInventory() < vaccineSchedule.getLimitPeople()) {
            throw new MessageException("Vaccine không đủ số lượng, chỉ còn " + vaccine.getInventory());
        }
        vaccineSchedule.setCreatedDate(new Timestamp(System.currentTimeMillis()));
        vaccineSchedule.setUser(userUtils.getUserWithAuthority());
        vaccineScheduleRepository.save(vaccineSchedule);
        vaccine.setInventory(vaccine.getInventory() - vaccineSchedule.getLimitPeople());
        vaccineRepository.save(vaccine);

        if(vaccineSchedule.getIdPreSchedule() != null) {
            Optional<VaccineSchedule> vc = vaccineScheduleRepository.findById(vaccineSchedule.getIdPreSchedule());
            int roundMonth = getRoundedMonthsBetween(vc.get().getStartDate(), vaccineSchedule.getStartDate());
            System.out.println("Khoảng cách tháng: " + roundMonth);
            if(vc.isPresent()) {
                List<Date> listDate = getDatesBetween(vaccineSchedule.getStartDate(), vaccineSchedule.getEndDate());
                for(Date date : listDate) {
                    System.out.println("ngày: " + date.toString());
                    List<CustomerSchedule> list = customerScheduleRepository.findByVaccineScheduleAndDate(vc.get().getId(), date, roundMonth);
                    for(CustomerSchedule cs : list) {
                        mailService.sendEmail(cs.getUser().getEmail(), "Thông báo mũi tiêm tiếp theo",
                                "Mũi tiêm "+cs.getVaccineScheduleTime().getVaccineSchedule().getVaccine().getName()+" đã có lịch tiêm tiếp theo<br>"+
                                        "Thời gian tiêm mũi tiếp theo từ ngày: "+vaccineSchedule.getStartDate()+" đến ngày: "+vaccineSchedule.getEndDate()
                                        +"<br>Mũi tiêm của bạn nên được tiêm vào ngày: " + date.toString()+
                                        "<br>"+
                                        vaccineSchedule.getDescription()
                                , false, true);
                    }
                }
            }
        }
        return vaccineSchedule;
    }

    public static int getRoundedMonthsBetween(Date startDate, Date endDate) {
        // Chuyển đổi java.sql.Date sang LocalDate
        LocalDate start = startDate.toLocalDate();
        LocalDate end = endDate.toLocalDate();

        // Tính khoảng cách giữa 2 ngày
        Period period = Period.between(start, end);

        // Lấy số tháng và làm tròn
        int months = period.getYears() * 12 + period.getMonths();

        // Nếu có ngày dư thì làm tròn lên thêm 1 tháng
        if (period.getDays() > 0) {
            months += 1;
        }

        return months;
    }

    public static List<Date> getDatesBetween(Date startDate, Date endDate) {
        List<Date> dates = new ArrayList<>();
        LocalDate start = startDate.toLocalDate();
        LocalDate end = endDate.toLocalDate();
        while (!start.isAfter(end)) {
            dates.add(Date.valueOf(start));
            start = start.plusDays(1);
        }
        return dates;
    }

    /*
     * api này dùng để cập nhật lịch tiêm vaccine
     * */
    public VaccineSchedule update(VaccineSchedule vaccineSchedule) {
        Vaccine vaccine = vaccineRepository.findById(vaccineSchedule.getVaccine().getId()).get();
        if(vaccine.getInventory() == null) {
            throw new MessageException("Vaccine không đủ số lượng");
        }
        if(vaccine.getInventory() < vaccineSchedule.getLimitPeople()) {
            throw new MessageException("Vaccine không đủ số lượng, chỉ còn " + vaccine.getInventory());
        }
        if(vaccineSchedule.getId() == null) {
            throw new MessageException("Id không được null");
        }
        Optional<VaccineSchedule> exist = vaccineScheduleRepository.findById(vaccineSchedule.getId());
        if(exist.isPresent()) {
            throw new MessageException("Không tìm thấy lích tiêm có id: " + vaccineSchedule.getId());
        }
        Long num = vaccineScheduleTimeRepository.quantityBySchedule(vaccineSchedule.getId());
        if(num == null) {
            num = 0L;
        }
        if (num > vaccineSchedule.getLimitPeople()) {
            throw new MessageException("Số lượng mũi tiêm đã phát hành là : " + num + ", số mũi tiêm bạn cập nhật không chính xác");
        }
        vaccineSchedule.setCreatedDate(exist.get().getCreatedDate());
        vaccineSchedule.setUser(exist.get().getUser());
        vaccineScheduleRepository.save(vaccineSchedule);
        vaccine.setInventory(vaccine.getInventory() + exist.get().getLimitPeople() - vaccineSchedule.getLimitPeople());
        vaccineRepository.save(vaccine);
        return vaccineSchedule;
    }

    /*
     * api này dùng để xóa lịch tiêm vaccine
     * */
    public void delete(Long id) {
        try {
            VaccineSchedule vaccineSchedule = vaccineScheduleRepository.findById(id).get();
            Vaccine vaccine = vaccineSchedule.getVaccine();
            Integer limitPeople = vaccineSchedule.getLimitPeople();
            vaccineScheduleRepository.deleteById(id);
            vaccine.setInventory(vaccine.getInventory() + limitPeople);
            vaccineRepository.save(vaccine);
        } catch (Exception e) {
            throw new MessageException("Lịch tiêm này đã được đăng ký, không thể xóa");
        }
    }

    /*
     * api này dùng để lấy danh sách lịch tiêm vaccine, truyền vào ngày bắt đầu và kết thúc
     * nếu không truyền ngày bd hoặc kt thì lấy mặc định tất cả
     * */
    public Page<VaccineSchedule> vaccineSchedules(Date from, Date to, Pageable pageable) {
        Page<VaccineSchedule> page = null;
        if(from == null || to == null) {
            page = vaccineScheduleRepository.findAll(pageable);
        } else {
            page = vaccineScheduleRepository.findByDate(from, to, pageable);
        }
        return page;
    }

    public List<VaccineSchedule> findByVaccine(Long vaccineId) {
        LocalDateTime now = LocalDateTime.now();
        List<VaccineSchedule> list = vaccineScheduleRepository.findByVaccine(vaccineId, now);
        return list;
    }

    public VaccineSchedule findById(Long id) {
        Optional<VaccineSchedule> vaccineSchedule = vaccineScheduleRepository.findById(id);
        if (vaccineSchedule.isEmpty()) {
            throw new MessageException("Không tìm thấy lịch tiêm với id: " + id);
        }
        return vaccineSchedule.get();
    }

    public Page<VaccineSchedule> nextSchedule(String param, Pageable pageable) {
        if(param == null) {
            param = "";
        }
        param = "%" + param + "%";
        Page<VaccineSchedule> page = vaccineScheduleRepository.findByParam(param, new Date(System.currentTimeMillis()), pageable);
        for(VaccineSchedule v : page.getContent()) {
            if(customerScheduleRepository.countRegis(v.getId()) < v.getLimitPeople()) {
                v.setInStock(true);
            }
        }
        return page;
    }

    public Page<VaccineSchedule> preSchedule(String param, Pageable pageable) {
        if(param == null) {
            param = "";
        }
        param = "%" + param + "%";
        Page<VaccineSchedule> page = vaccineScheduleRepository.preFindByParam(param, new Date(System.currentTimeMillis()), pageable);
        return page;
    }

    public List<VaccineSchedule> list() {
        return vaccineScheduleRepository.findAll();
    }

    public List<VaccineSchedule> getCenter(Date start, Long vaccineId) {
        List<VaccineSchedule> list = new ArrayList<>();
        if(start == null) {
            start = new Date(System.currentTimeMillis());
        }
        if (start.toLocalDate().isBefore(LocalDate.now())) {
            throw new MessageException("Thời gian tối thiểu phải bắt đầu từ ngày hiện tại");
        }
        list = vaccineScheduleRepository.getCenter(start, vaccineId);
        return list;
    }

    public Page<VaccineSchedule> advancedSearch(
            String vaccineName,
            String centerName,
            LocalDate fromDate,
            LocalDate toDate,
            String status,
            Pageable pageable) {
        log.info("Service Layer - fromDate: {}, toDate: {}, status: {}", fromDate, toDate, status);
        return vaccineScheduleRepository.findAdvancedSearch(
            vaccineName,
            centerName,
            fromDate,
            toDate,
            status,
            pageable
        );
    }

}
