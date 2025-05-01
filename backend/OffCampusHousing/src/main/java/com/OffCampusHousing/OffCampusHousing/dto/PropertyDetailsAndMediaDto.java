package com.OffCampusHousing.OffCampusHousing.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDetailsAndMediaDto {

	private String sellerEmail;
	private String userType;
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
    
    //private List<String> mediaUrls;
    
 // Lists to store media URLs segregated by type
    private List<String> imageUrls;
    private List<String> videoUrls;
}
