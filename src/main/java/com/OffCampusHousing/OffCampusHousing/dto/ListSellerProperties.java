package com.OffCampusHousing.OffCampusHousing.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ListSellerProperties {
	
	@NotBlank(message = "Seller email is required")
    @Email(message = "Invalid email format")
	 private String email;
	@NotBlank(message = "User type is required")
	 private String userType;
}
