package com.OffCampusHousing.OffCampusHousing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequestDto {
	 private String token;
	 private String newPassword;

}
