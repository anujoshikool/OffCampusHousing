package com.OffCampusHousing.OffCampusHousing.service;

import org.springframework.http.ResponseEntity;

import com.OffCampusHousing.OffCampusHousing.dto.ForgotPasswordRequestDto;
import com.OffCampusHousing.OffCampusHousing.dto.LoginRequestDto;
import com.OffCampusHousing.OffCampusHousing.dto.LoginResponseDto;
import com.OffCampusHousing.OffCampusHousing.dto.PasswordResponseDto;
import com.OffCampusHousing.OffCampusHousing.dto.RegisterRequestDto;
import com.OffCampusHousing.OffCampusHousing.dto.RegisterResponseDto;
import com.OffCampusHousing.OffCampusHousing.dto.ResetPasswordRequestDto;
import com.OffCampusHousing.OffCampusHousing.entity.User.UserType;

public interface ServiceLayer {
	
	 ResponseEntity<RegisterResponseDto> registerUser(RegisterRequestDto request);
	    ResponseEntity<LoginResponseDto> loginUser(LoginRequestDto request);
	    ResponseEntity<PasswordResponseDto> forgotPassword(ForgotPasswordRequestDto requestDto) ;
	    ResponseEntity<PasswordResponseDto> resetPassword(ResetPasswordRequestDto requestDto);
	    ResponseEntity<RegisterResponseDto> deleteUserAccount(String email, String userType);
		
	       
}
