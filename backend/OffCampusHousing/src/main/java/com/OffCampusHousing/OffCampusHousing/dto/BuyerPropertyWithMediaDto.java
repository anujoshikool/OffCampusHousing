package com.OffCampusHousing.OffCampusHousing.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BuyerPropertyWithMediaDto {
	
	//private String sellerEmail;
	//private String userType;
	private UUID propertyId;
	private String listingType;
	private String title;
	private String description;
	private BigDecimal priceTotalUnit;
    private BigDecimal pricePerIndividual;
    private BigDecimal avgUtilitiesPerPerson;
    private Integer bedrooms;
    private Integer bathrooms;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private Integer peoplePresent;
    private Integer peopleRequired;
    private String accommodationType;
    private String preferredGender;
    private String availableFrom;
    private String endOfLease;
    private String nearestUniversity;
    private String dietaryPreference;
    private String status;
    
    private List<String> mediaUrls;
    private String coverPhoto;

}
