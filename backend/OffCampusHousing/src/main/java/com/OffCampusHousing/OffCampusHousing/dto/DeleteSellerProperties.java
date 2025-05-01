package com.OffCampusHousing.OffCampusHousing.dto;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class DeleteSellerProperties {
	@NotBlank(message = "Seller email is required")
    @Email(message = "Invalid email format")
	 private String email;
	@NotBlank(message = "User type is required")
	 private String userType;
	@NotNull(message="Property ID is required")
	private UUID propertyId;

}
