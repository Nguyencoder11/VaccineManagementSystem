package com.app.vaxms_server.service;

import com.app.vaxms_server.dto.ScheduleTimeDto;
import com.app.vaxms_server.dto.VaccineScheduleTimeResponse;
import com.app.vaxms_server.entity.VaccineSchedule;
import com.app.vaxms_server.entity.VaccineScheduleTime;
import com.app.vaxms_server.exception.MessageException;
import com.app.vaxms_server.repository.VaccineScheduleRepository;
import com.app.vaxms_server.repository.VaccineScheduleTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
public class VaccineScheduleTimeService {
    @Autowired
    private VaccineScheduleTimeRepository vaccineScheduleTimeRepository;
    @Autowired
    private VaccineScheduleRepository vaccineScheduleRepository;

    public List<VaccineScheduleTime> createMulti(ScheduleTimeDto dto) {
        VaccineSchedule vaccineSchedule = vaccineScheduleRepository.findById(dto.getScheduleId()).get();
        List<VaccineScheduleTime> list = new ArrayList<>();
        Time startTime = dto.getStartTime();
        Time endTime = dto.getEndTime();
        Integer numHour = dto.getNumHour();
        Integer maxPeople = dto.getMaxPeople();

        LocalTime startLocalTime = startTime.toLocalTime();
        LocalTime endLocalTime = endTime.toLocalTime();
        if(startLocalTime.getMinute() != 0 || endLocalTime.getMinute() != 0){
            throw new MessageException("Phải dùng giờ chẵn để thực hiện");
        }

        // Tinh tong so phut giua startTime va endTime
        long diffInMilliSeconds = endTime.getTime() - startTime.getTime();
        long diffInMinutes = TimeUnit.MILLISECONDS.toMinutes(diffInMilliSeconds);   // chuyen tu milliseconds sang phut

        // tinh tong so luong khoang thoi gian, moi khoang la numHour gio (numHour * 60phut)
        int slotDurationInMinutes = numHour * 60;   // moi slot co numHour gio
        int numSlots = (int) (diffInMinutes / slotDurationInMinutes);
        if(diffInMinutes % slotDurationInMinutes != 0) {
            numSlots++; // them 1 slot neu co khoang thoi gian du
        }

        // Tinh so luong nguoi cho tung khoang thoi gian
        int peoplePerSlot = maxPeople / numSlots;   // so nguoi cho moi slot
        int remainer = maxPeople % numSlots;    // so nguoi du

        // Tao danh sach phan bo so nguoi
        List<Integer> peopleDistribution = new ArrayList<>();

        // Them so nguoi vao danh sach cho cac khoang thoi gian
        for(int i = 0; i < numSlots; i++){
            if(i < numSlots - 1) {
                peopleDistribution.add(peoplePerSlot);  // Cac slot dau nhan so nguoi chia deu
            } else {
                peopleDistribution.add(peoplePerSlot + remainer);   // Slot cuoi nhan so nguoi du
            }
        }

        // Kiem tra va hoan doi so luong nguoi giua slot dau va slot cuoi neu can
        if(peopleDistribution.size() > 1 && peopleDistribution.get(peopleDistribution.size() - 1) > peopleDistribution.get(0)){
            // Hoan doi
            int temp = peopleDistribution.get(0);
            peopleDistribution.set(0, peopleDistribution.get(peopleDistribution.size() - 1));
            peopleDistribution.set(peopleDistribution.size() - 1, temp);
        }

        // In ra ket qua
        System.out.println("Tổng số khoảng thời gian: " + numSlots);

        // In ra thoi gian cu the cho tung slot
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");
        long currentTimeMillis = startTime.getTime();   // Thoi gian hien tai bat dau tu startTime

        for(int i = 0; i < peopleDistribution.size(); i++) {
            long slotEndTimeInMillis = currentTimeMillis + slotDurationInMinutes * 60 * 1000;   // Thoi gian ket thuc cua moi slot

            // Neu thoi gian ket thuc cua slot vuot qua endTime, thi dieu chinh lai thoi gian ket thuc
            if(slotEndTimeInMillis > endTime.getTime()) {
                slotEndTimeInMillis = endTime.getTime();
            }

            // In ra khoang thoi gian tu start den end cho tung slot
            System.out.println("Khoảng thời gian " + timeFormat.format(new Time(currentTimeMillis))
                    + " - " + timeFormat.format(new Time(slotEndTimeInMillis))
                    + ": " + peopleDistribution.get(i) + " người");

            VaccineScheduleTime vaccineScheduleTime = new VaccineScheduleTime();
            vaccineScheduleTime.setVaccineSchedule(vaccineSchedule);
            vaccineScheduleTime.setTimeEnd(new Time(slotEndTimeInMillis));
            vaccineScheduleTime.setTimeStart(new Time(currentTimeMillis));
            vaccineScheduleTime.setInjectDate(dto.getDate());
            vaccineScheduleTime.setLimitPeople(peopleDistribution.get(i));
            list.add(vaccineScheduleTime);

            currentTimeMillis = slotEndTimeInMillis;

            // kiem tra neu currenTimeInMillis da dat endTime thi thoat vong lap
            if(currentTimeMillis >= endTime.getTime()) {
                break;
            }
        }

        Integer tong = 0;
        for(VaccineScheduleTime v : list) {
            tong += v.getLimitPeople();
        }
        Long count = vaccineScheduleTimeRepository.quantityBySchedule(dto.getScheduleId());
        if (count == null) {
            count = 0L;
        }
        if(vaccineSchedule.getLimitPeople() < count + tong) {
            throw new MessageException("Số lượng mũi tiêm hiện tại đang phát hành là: "+count+" chỉ được phát hành thêm: "+(vaccineSchedule.getLimitPeople() - count)+" mũi tiêm");
        }
        vaccineScheduleTimeRepository.saveAll(list);
        return list;
    }

    public List<VaccineScheduleTime> findBySchedule(Long scheduleId) {
        return vaccineScheduleTimeRepository.findByVaccineSchedule(scheduleId);
    }

    public Set<Date> findDateBySchedule(Long scheduleId) {
        LocalDate localDate = LocalDate.now();
        Date sqlDate = Date.valueOf(localDate);
        return vaccineScheduleTimeRepository.findDateByVaccineSchedule(scheduleId, sqlDate);
    }

    public VaccineScheduleTime update(VaccineScheduleTime vaccineScheduleTime) {
        VaccineScheduleTime ex = vaccineScheduleTimeRepository.findById(vaccineScheduleTime.getId()).get();
        ex.setTimeStart(vaccineScheduleTime.getTimeStart());
        ex.setTimeEnd(vaccineScheduleTime.getTimeEnd());
        ex.setLimitPeople(vaccineScheduleTime.getLimitPeople());
        vaccineScheduleTimeRepository.save(ex);
        return ex;
    }

    public VaccineScheduleTime save(VaccineScheduleTime vaccineScheduleTime) {
        Long count = vaccineScheduleTimeRepository.quantityBySchedule(vaccineScheduleTime.getVaccineSchedule().getId());
        VaccineSchedule vaccineSchedule = vaccineScheduleRepository.findById(vaccineScheduleTime.getVaccineSchedule().getId()).get();
        if(count == null) {
            count = 0L;
        }
        if(vaccineSchedule.getLimitPeople() < count + vaccineScheduleTime.getLimitPeople()) {
            throw new MessageException("Số lượng mũi tiêm hiện tại đang phát hành là: "+count+" chỉ được phát hành thêm: "+(vaccineSchedule.getLimitPeople() - count)+" mũi tiêm");
        }
        vaccineScheduleTimeRepository.save(vaccineScheduleTime);
        return vaccineScheduleTime;
    }

    public void delete(Long id) {
        vaccineScheduleTimeRepository.deleteById(id);
    }

    public List<VaccineScheduleTimeResponse> findTimeBySchedule(Long idSchedule, Date date) {
        return vaccineScheduleTimeRepository.findTimeBySchedule(idSchedule, date);
    }

    public VaccineScheduleTime findById(Long id) {
        return vaccineScheduleTimeRepository.findById(id).get();
    }

}
