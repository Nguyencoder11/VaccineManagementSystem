package com.app.vaxms_server.entity;

import com.app.vaxms_server.enums.FeedbackType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Timestamp;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "feedback_seq")
    @SequenceGenerator(name = "feedback_seq", sequenceName = "feedback_sequence", allocationSize = 1)
    @Column(name = "id")
    Long id;

    String content;

    Integer rating;

    String response;

    Timestamp createdDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "feedback_type")
    FeedbackType feedbackType;

    @ManyToOne
    @JoinColumn(name = "customer_schedule_id")
    CustomerSchedule customerSchedule;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "nurse_id")
    Nurse nurse;

}
