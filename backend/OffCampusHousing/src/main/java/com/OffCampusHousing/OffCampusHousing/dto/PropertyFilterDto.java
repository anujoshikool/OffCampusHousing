package com.OffCampusHousing.OffCampusHousing.dto;


import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PropertyFilterDto {
	
	private String queryText;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal minPrice;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal maxPrice;
    
    private String city;
    private String listingType;
    private String status;
    private Integer minBedrooms;
    private Integer maxBedrooms;
    private Integer minBathrooms;
    private Integer maxBathrooms;
    private String address;
    private String state;
    private String country;
    private String pincode;
    private Integer minPeoplePresent;
    private Integer maxPeoplePresent;
    private Integer minPeopleRequired;
    private String accommodationType;
    private String preferredGender;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date availableFrom;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date endOfLease;
    
	
	    private String nearestUniversity; // Filter by nearest university
	    private String dietaryPreference; // Filter by dietary preference
	
	 

}
