package com.OffCampusHousing.OffCampusHousing.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.OffCampusHousing.OffCampusHousing.entity.UserFeedback;

public interface UserFeedbackRepository extends JpaRepository<UserFeedback, Long> {
}
