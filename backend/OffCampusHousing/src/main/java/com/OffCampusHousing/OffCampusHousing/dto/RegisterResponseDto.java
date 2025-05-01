package com.OffCampusHousing.OffCampusHousing.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter

@RequiredArgsConstructor
public class RegisterResponseDto {

	private String message;
	public RegisterResponseDto(String message) {
        this.message = message;
    }
	

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
}
	

