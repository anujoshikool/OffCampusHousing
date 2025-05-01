package com.OffCampusHousing.OffCampusHousing.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@Document(indexName = "offcampus-search")
@JsonIgnoreProperties(ignoreUnknown = true) // Add this
public class PropertyDocument {
    
    @Id
    @Field(name="property_id",type=FieldType.Keyword)
    @JsonProperty("property_id") // Maps to Elasticsearch's property_id
    private String propertyId;
    
    @Field(name="seller_email",type = FieldType.Keyword)
    @JsonProperty("seller_email")
    private String sellerEmail;

    @Field(name="user_type",type = FieldType.Keyword)
    @JsonProperty("user_type")
    private String userType;
    
    @Field(name="listing_type",type = FieldType.Keyword)
    @JsonProperty("listing_type")
    private String listingType;

    @Field(type = FieldType.Text)
    private String title;

    @Field(type = FieldType.Text)
    private String description;

    @Field(name="price_total_unit",type = FieldType.Double)
    @JsonProperty("price_total_unit")
    private BigDecimal priceTotalUnit;

    @Field(name="price_per_individual",type = FieldType.Double)
    @JsonProperty("price_per_individual")
    private BigDecimal pricePerIndividual;

    @Field(name="avg_utilities_per_person",type = FieldType.Double)
    @JsonProperty("avg_utilities_per_person")
    private BigDecimal avgUtilitiesPerPerson;

    @Field(type = FieldType.Integer)
    private Integer bedrooms;

    @Field(type = FieldType.Integer)
    private Integer bathrooms;

    @Field(type = FieldType.Text)
    private String address;

    @Field(type = FieldType.Keyword)
    @JsonProperty("city")
    private String city;

    @Field(type = FieldType.Text)
    private String state;

    @Field(type = FieldType.Text)
    private String country;

    @Field(type = FieldType.Keyword)
    private String pincode;

    @Field(name="people_present",type = FieldType.Integer)
    @JsonProperty("people_present")
    private Integer peoplePresent;

    @Field(name="people_required",type = FieldType.Integer)
    @JsonProperty("people_required")
    private Integer peopleRequired;

    // Note the spelling matches Elasticsearch exactly
    @Field(name="accommodation_type",type = FieldType.Text)
    @JsonProperty("accommodation_type")
    private String accommodationType;

    @Field(name="preferred_gender",type = FieldType.Text)
    @JsonProperty("preferred_gender")
    private String preferredGender;

    @Field(name="available_from",type = FieldType.Date, format = DateFormat.date)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @JsonProperty("available_from")
    private Date availableFrom;

    @Field(name="end_of_lease",type = FieldType.Date, format = DateFormat.date)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @JsonProperty("end_of_lease")
    private Date endOfLease;

    @Field(name="nearest_university",type = FieldType.Text)
    @JsonProperty("nearest_university")
    private String nearestUniversity;

    @Field(name="dietary_preference",type = FieldType.Text)
    @JsonProperty("dietary_preference")
    private String dietaryPreference;

    @Field(type = FieldType.Keyword)
    private String status;
    
    @Field(name="media_urls",type = FieldType.Keyword)
    @JsonProperty("media_urls")
    List<String> mediaUrls;
}