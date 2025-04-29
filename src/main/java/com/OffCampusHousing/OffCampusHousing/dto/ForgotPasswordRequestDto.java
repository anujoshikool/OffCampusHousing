package com.OffCampusHousing.OffCampusHousing.dto;

import com.OffCampusHousing.OffCampusHousing.entity.User;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ForgotPasswordRequestDto {
	
	 private String email;
	 private User.UserType userType;
}
