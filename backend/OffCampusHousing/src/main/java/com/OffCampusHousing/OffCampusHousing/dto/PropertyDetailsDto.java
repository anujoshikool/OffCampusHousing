package com.OffCampusHousing.OffCampusHousing.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PropertyDetailsDto {
	@NotNull(message = "Seller email is required")
    @Email(message = "Invalid email format")
	 private String sellerEmail;
	@NotNull(message = "User type is required")
	    private String userType;
	@NotNull(message = "Listing type is required")
	    private String listingType;
	 @NotNull(message = "Title is required")
	    private String title;
	    private String description;
	    @NotNull(message = "Total price is required")
	    private BigDecimal priceTotalUnit;
	    private BigDecimal pricePerIndividual;
	    private BigDecimal avgUtilitiesPerPerson;
	    @NotNull(message = "Bedrooms are required")
	    @Min(value = 1, message = "Bedrooms must be at least 1")
	    private Integer bedrooms;
	    @NotNull(message = "Bathrooms are required")
	    @Min(value = 1, message = "Bathrooms must be at least 1")
	    private Integer bathrooms;
	    @NotNull(message = "Address is required")
	    private String address;
	    @NotNull(message = "City is required")
	    private String city;
	    @NotNull(message = "State is required")
	    private String state;
	    @NotNull(message = "Country is required")
	    private String country;
	    private String pincode;
	    private Integer peoplePresent;
	    @NotNull(message = "People required is required")
	    @Min(value = 1, message = "People required must be greater than 0")
	    private Integer peopleRequired;
	    private String accommodationType;
	    private String preferredGender;
	    @NotNull
	    private String availableFrom;
	    @NotNull(message = "Please provide an end date")
	    private String endOfLease;
	    private String nearestUniversity;
	    private String dietaryPreference;
	    @NotNull(message = "Please Give me Status")
	    private String status;

}
