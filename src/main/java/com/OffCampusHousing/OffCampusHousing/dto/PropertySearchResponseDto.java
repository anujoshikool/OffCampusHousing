package com.OffCampusHousing.OffCampusHousing.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.OffCampusHousing.OffCampusHousing.entity.PropertyDocument;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PropertySearchResponseDto {
	
	//private String sellerEmail;
	//private String userType;
	private String propertyId;
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
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date availableFrom;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date endOfLease;
    private String nearestUniversity;
    private String dietaryPreference;
    private String status;
    private List<String> mediaUrls;
    
    
    public static PropertySearchResponseDto fromDocument(PropertyDocument doc) {
    	
    	PropertySearchResponseDto dto = new PropertySearchResponseDto();
    	
    	dto.setPropertyId(doc.getPropertyId());
    	dto.setListingType(doc.getListingType());
        dto.setTitle(doc.getTitle());
        dto.setDescription(doc.getDescription());
        dto.setPriceTotalUnit(doc.getPriceTotalUnit());
        dto.setPricePerIndividual(doc.getPricePerIndividual());
        dto.setAvgUtilitiesPerPerson(doc.getAvgUtilitiesPerPerson());
        dto.setBedrooms(doc.getBedrooms());
        dto.setBathrooms(doc.getBathrooms());
        dto.setAddress(doc.getAddress());
        dto.setCity(doc.getCity());
        dto.setState(doc.getState());
        dto.setCountry(doc.getCountry());
        dto.setPincode(doc.getPincode());
        dto.setPeoplePresent(doc.getPeoplePresent());
        dto.setPeopleRequired(doc.getPeopleRequired());
        dto.setAccommodationType(doc.getAccommodationType());
        dto.setPreferredGender(doc.getPreferredGender());
        dto.setAvailableFrom(doc.getAvailableFrom());
        dto.setEndOfLease(doc.getEndOfLease());
        dto.setNearestUniversity(doc.getNearestUniversity());
        dto.setDietaryPreference(doc.getDietaryPreference());
        dto.setStatus(doc.getStatus());
        dto.setMediaUrls(doc.getMediaUrls());
        return dto;
    	
    }

}
