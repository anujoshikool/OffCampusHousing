package com.OffCampusHousing.OffCampusHousing.dto;

import com.OffCampusHousing.OffCampusHousing.entity.User.UserType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDto {
	    private String message;
	    private String email;
	    private String firstName;
	    private String token;
	    private UserType userType;
	    private String redirectUrl;

	    // Default constructor
	    public LoginResponseDto() {}
	    public LoginResponseDto(String message) {this.message=message;}

	    // Constructor with message and email
	    public LoginResponseDto(String message, String email) {
	        this.message = message;
	        this.email = email;
	    }

	    // Getter for message
	    public String getMessage() {
	        return message;
	    }

	    // Setter for message
	    public void setMessage(String message) {
	        this.message = message;
	    }

	    // Getter for email
	    public String getEmail() {
	        return email;
	    }

	    // Setter for email
	    public void setEmail(String email) {
	        this.email = email;
	    }

}
