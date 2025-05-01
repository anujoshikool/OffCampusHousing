package com.OffCampusHousing.OffCampusHousing.entity;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import com.OffCampusHousing.OffCampusHousing.dto.PropertyDetailsDto;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "property_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDetails {
	
	  @Id
	  @GeneratedValue(strategy = GenerationType.AUTO)  // This works well for UUIDs as Hibernate supports it natively
	    @Column(name = "property_id", nullable = false, updatable = false)
	    private UUID propertyId;
	 
	    @Column(name = "seller_email", nullable = false)
	    private String sellerEmail;
	    
	   
	    @Column(name = "user_type", nullable = false)
	    private String userType; // 'SELLER'

	    @JsonIgnore
	    @ManyToOne
	    @JoinColumns({
	        @JoinColumn(name = "seller_email", referencedColumnName = "email", insertable = false, updatable = false),
	        @JoinColumn(name = "user_type", referencedColumnName = "user_type", insertable = false, updatable = false)
	    })
	    private User seller;

	    @Column(name="listing_type",nullable = false)
	    private String listingType; // 'WHOLE_UNIT' or 'ROOM'

	    @Column(name = "title",nullable = false)
	    private String title;

	    @Column(name ="description")
	    private String description;

	    @Column(name ="price_total_unit",nullable = false)
	    private BigDecimal priceTotalUnit;

	    @Column(name="price_per_individual",nullable=true)
	    private BigDecimal pricePerIndividual;
	    @Column(name="avg_utilities_per_person",nullable=true)
	    private BigDecimal avgUtilitiesPerPerson;

	    @Column(name="bedrooms",nullable = false)
	    private Integer bedrooms;

	    @Column(name="bathrooms",nullable = false)
	    private Integer bathrooms;

	    @Column(name="address",nullable = false)
	    private String address;

	    @Column(name="city",nullable = false)
	    private String city;

	    @Column(name="state",nullable = false)
	    private String state;

	    @Column(name="country",nullable = false)
	    private String country;

	    @Column(name="pincode",nullable=false)
	    private String pincode;
	    @Column(name="people_present",nullable=true)
	    private Integer peoplePresent;
	    @Column(name="people_required",nullable=true)
	    private Integer peopleRequired;
	    @Column(name="accommodation_type",nullable=true)
	    private String accommodationType;
	    @Column(name="preferred_gender")
	    private String preferredGender;

	    @Column(name="available_from",nullable = false)
	    private Date availableFrom;
	    @Column(name="end_of_lease",nullable=false)
	    private Date endOfLease;
	    @Column(name="nearest_university",nullable=true)
	    private String nearestUniversity;
	    @Column(name="dietary_preference",nullable=false)
	    private String dietaryPreference;

	    @Column(name="status",nullable = false)
	    private String status; // 'AVAILABLE', 'NOT AVAILABLE'
	    

	    public PropertyDetails(PropertyDetailsDto propertyDetailsDto) {
	    	
	    	
	    	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	        try {
	            this.availableFrom = dateFormat.parse(propertyDetailsDto.getAvailableFrom());
	            this.endOfLease = dateFormat.parse(propertyDetailsDto.getEndOfLease());
	        } catch (ParseException e) {
	            throw new IllegalArgumentException("Invalid date format. Please use yyyy-MM-dd");
	        }
	    	
	        this.sellerEmail = propertyDetailsDto.getSellerEmail();
	        this.userType = propertyDetailsDto.getUserType();
	        this.listingType = propertyDetailsDto.getListingType();
	        this.title = propertyDetailsDto.getTitle();
	        this.description = propertyDetailsDto.getDescription();
	        this.priceTotalUnit = propertyDetailsDto.getPriceTotalUnit();
	        this.pricePerIndividual = propertyDetailsDto.getPricePerIndividual();
	        this.avgUtilitiesPerPerson = propertyDetailsDto.getAvgUtilitiesPerPerson();
	        this.bedrooms = propertyDetailsDto.getBedrooms();
	        this.bathrooms = propertyDetailsDto.getBathrooms();
	        this.address = propertyDetailsDto.getAddress();
	        this.city = propertyDetailsDto.getCity();
	        this.state = propertyDetailsDto.getState();
	        this.country = propertyDetailsDto.getCountry();
	        this.pincode = propertyDetailsDto.getPincode();
	        this.peoplePresent = propertyDetailsDto.getPeoplePresent();
	        this.peopleRequired = propertyDetailsDto.getPeopleRequired();
	        this.accommodationType = propertyDetailsDto.getAccommodationType();
	        this.preferredGender = propertyDetailsDto.getPreferredGender();
	        this.nearestUniversity = propertyDetailsDto.getNearestUniversity();
	        this.dietaryPreference = propertyDetailsDto.getDietaryPreference();
	        this.status = propertyDetailsDto.getStatus();
	    }


}
