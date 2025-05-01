package com.OffCampusHousing.OffCampusHousing.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.OffCampusHousing.OffCampusHousing.dto.PropertyDetailsAndMediaDto;
import com.OffCampusHousing.OffCampusHousing.dto.PropertyDetailsDto;
import com.OffCampusHousing.OffCampusHousing.entity.PropertyDetails;
import com.OffCampusHousing.OffCampusHousing.entity.PropertyDocument;
import com.OffCampusHousing.OffCampusHousing.entity.PropertyMedia;
import com.OffCampusHousing.OffCampusHousing.entity.UserSubscription;
import com.OffCampusHousing.OffCampusHousing.repository.PropertyDetailsRepository;
import com.OffCampusHousing.OffCampusHousing.repository.PropertyMediaRepository;
import com.OffCampusHousing.OffCampusHousing.repository.SubscriptionRepository;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class SellerPropertyService {
	
	private final PropertyDetailsRepository propertyRepository;
    private final PropertyMediaRepository mediaRepository;
    private final CloudinaryService cloudinaryService;
    private static final Logger logger = LoggerFactory.getLogger(SellerPropertyService.class);
    //private final  PropertyDocumentRepository propertyDocumentRepository; // Elastic Search
    @Autowired
    private ElasticsearchOperations elasticsearchOperations;
    @Autowired
    private SubscriptionRepository subscriptionRepository;


//    @Transactional
//    public ResponseEntity<?> addProperty(PropertyDetailsDto propertyDetailsDto, List<MultipartFile> files,MultipartFile coverPhoto) {
//        // Validate required fields
//        List<String> missingFields = validateFields(propertyDetailsDto);
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // Adjust format as needed
//
//        // Convert String to LocalDate
//        LocalDate availableFrom = LocalDate.parse(propertyDetailsDto.getAvailableFrom(), formatter);
//        LocalDate endOfLease = LocalDate.parse(propertyDetailsDto.getEndOfLease(), formatter);
//        LocalDate today = LocalDate.now();
//
//        // Validate lease dates
//        if (endOfLease.isBefore(availableFrom)) {
//            return ResponseEntity.badRequest().body(createResponse("End of lease must be after the available date."));
//        }
//        if (endOfLease.isBefore(today)) {
//            return ResponseEntity.badRequest().body(createResponse("End of lease must be after the current date."));
//        }
//        if (!missingFields.isEmpty()) {
//            return ResponseEntity.badRequest().body(createResponse("Missing required fields: " + String.join(", ", missingFields)));
//        }
//        
//        
//        boolean propertyExists = propertyRepository.existsBySellerEmailAndAddressAndCityAndStateAndPincode(
//                propertyDetailsDto.getSellerEmail(),
//                propertyDetailsDto.getAddress(),
//                propertyDetailsDto.getCity(),
//                propertyDetailsDto.getState(),
//                propertyDetailsDto.getPincode()
//            );
//
//            if (propertyExists) {
//                return ResponseEntity.status(409).body(createResponse("Property with the same seller email, address, city, state, and pincode already exists. Please modify"));
//            }
//
//        // Save Property
//       // PropertyDetails property = new PropertyDetails(propertyDetailsDto);
//        //PropertyDetails savedProperty = propertyRepository.save(property);
//       // UUID propertyId = savedProperty.getPropertyId();  // Get generated property ID
//        
//        PropertyDetails property = new PropertyDetails(propertyDetailsDto);
//        PropertyDetails savedProperty;
//        PropertyDocument propertyDocument = null;
//        
//
//        try {
//            savedProperty = propertyRepository.save(property);
//          
//        } catch (DataIntegrityViolationException e) {
//            return ResponseEntity.status(409).body("Property with the same address and city already exists.");
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(createResponse("An unexpected error occurred."));
//        }
//        UUID propertyId = savedProperty.getPropertyId();
//        
//        try {
//        
//        //ELASTIC SEAERCH
//       propertyDocument = new PropertyDocument(
//        		savedProperty.getPropertyId().toString(),
//        		savedProperty.getSellerEmail(),
//        		savedProperty.getUserType(),
//                savedProperty.getListingType(),
//                savedProperty.getTitle(),
//                savedProperty.getDescription(),
//                savedProperty.getPriceTotalUnit(),
//                
//                savedProperty.getPricePerIndividual(),
//                savedProperty.getAvgUtilitiesPerPerson(),
//                savedProperty.getBedrooms(),
//                savedProperty.getBathrooms(),
//                savedProperty.getAddress(),
//                savedProperty.getCity(),
//                savedProperty.getState(),
//                savedProperty.getCountry(),
//                savedProperty.getPincode(),
//                savedProperty.getPeoplePresent(),
//                savedProperty.getPeopleRequired(),
//                savedProperty.getAccommodationType(),
//                savedProperty.getPreferredGender(),
//                savedProperty.getAvailableFrom(),
//                savedProperty.getEndOfLease(),
//                savedProperty.getNearestUniversity(),
//                savedProperty.getDietaryPreference(),
//                savedProperty.getStatus(),new ArrayList<>()
//        		);
//        
//      propertyDocumentRepository.save(propertyDocument);
//       
//        } catch (DataIntegrityViolationException e) {
//            return ResponseEntity.status(409).body("Property with the same address and city already exists.");
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(createResponse("An unexpected error occurred in Elastic ."));
//        }
//        
//       
//        
//        //Upload Cover photo to the DB 
//        String fileType = coverPhoto.getContentType();
//        String folderType = (fileType != null && fileType.startsWith("image")) ? "image" : "video";
//        String cloudinaryFolder = propertyId + "/" + folderType;
//        PropertyMedia media1 = new PropertyMedia();
//        try {
//        	PropertyDetails property1 = propertyRepository.findById(propertyId)
//            	    .orElseThrow(() -> new RuntimeException("Property not found with ID: " + propertyId));
//
//            // Upload to Cloudinary
//        	String cloudinaryUrl = cloudinaryService.uploadFile(coverPhoto, cloudinaryFolder); // Call the service method
//        	System.out.println("Cloudinary URL FOR COVER PHOTO:"+cloudinaryUrl);
//            // Save Media Info in Database
//           
//            
//            media1.setProperty(savedProperty);
//            media1.setMediaType(folderType);  // 'IMAGE' or 'VIDEO'
//            media1.setMediaUrl(cloudinaryUrl);  // URL returned from CloudinaryService
//            media1.setUploadedAt(new Date());
//            media1.setMediaRole("COVER");
//        } catch (IOException e) {
//            throw new RuntimeException("File upload failed: " + coverPhoto.getOriginalFilename(), e);
//        }
//        
//        mediaRepository.save(media1);
//        
//        // Upload files to Cloudinary & Save to Database
//        List<PropertyMedia> mediaList = new ArrayList<>();
//        for (MultipartFile file : files) {
//             fileType = file.getContentType();
//            folderType = (fileType != null && fileType.startsWith("image")) ? "image" : "video";
//            cloudinaryFolder = propertyId + "/" + folderType;
//
//            try {
//            	PropertyDetails property1 = propertyRepository.findById(propertyId)
//                	    .orElseThrow(() -> new RuntimeException("Property not found with ID: " + propertyId));
//
//                // Upload to Cloudinary
//            	String cloudinaryUrl = cloudinaryService.uploadFile(file, cloudinaryFolder); // Call the service method
//            	System.out.println("Cloudinary URL :"+cloudinaryUrl);
//                // Save Media Info in Database
//                PropertyMedia media = new PropertyMedia();
//                
//                media.setProperty(savedProperty);
//                media.setMediaType(folderType);  // 'IMAGE' or 'VIDEO'
//                media.setMediaUrl(cloudinaryUrl);  // URL returned from CloudinaryService
//                media.setUploadedAt(new Date());
//                mediaList.add(media);
//            } catch (IOException e) {
//                throw new RuntimeException("File upload failed: " + file.getOriginalFilename(), e);
//            }
//        }
//
//        // Save all media records in batch
//        mediaRepository.saveAll(mediaList);
//        
//        
//        
//        // Update PropertyDocument with media URLs
//        List<String> mediaUrls = mediaList.stream()
//                .map(PropertyMedia::getMediaUrl)
//                .collect(Collectors.toList());
//        
//        // Add cover URL to the beginning of the media URLs list
//        
//        
//        propertyDocument.setMediaUrls(mediaUrls);  // Assuming you added a field to store media URLs
//        propertyDocumentRepository.save(propertyDocument);  // Update in Elasticsearch
//
//        
//
//        return ResponseEntity.ok(createResponse("Property and media uploaded successfully."));
//    }
    
    
    
    
    
    @Transactional
    public ResponseEntity<?> addProperty(PropertyDetailsDto propertyDetailsDto, 
                                       List<MultipartFile> files,
                                       MultipartFile coverPhoto) {
    	 PropertyDetails savedProperty =null;
    	 List<String> mediaUrls=null;
        try {
            // 1. First validate all inputs
            validateInputs(propertyDetailsDto);
            
            // 2. Check for video files and verify premium subscription
            if (hasVideoFiles(files)) {
                ResponseEntity<?> subscriptionCheck = checkVideoUploadPermission(
                    propertyDetailsDto.getSellerEmail()
                );
                if (subscriptionCheck != null) {
                    return subscriptionCheck; // Returns 403 if not premium
                }
            }
            PropertyDetailsDto dto = convertEmptyStringsToNull(propertyDetailsDto);
            
            // 2. Save to PostgreSQL (transactional)
             savedProperty = savePropertyToDatabase(dto);
            
            // 3. Upload media files (non-transactional)
         mediaUrls = uploadMediaFiles(savedProperty, files, coverPhoto);
            
            // 4. Single save to Elasticsearch (non-transactional)
            saveToElasticsearch(savedProperty, mediaUrls);
            
            return ResponseEntity.ok(createResponse("Property and media uploaded successfully."));
            
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(createResponse(e.getMessage()));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(409).body(createResponse("Duplicate property detected"));
       } 
        //    catch (IOException e) {
//            return ResponseEntity.status(500).body(createResponse("File upload failed: " + e.getMessage()));
//        } 
            catch (Exception e) {
            logger.error("Unexpected error", e);
            return ResponseEntity.status(500).body(createResponse("Operation failed: " + e.getMessage()));
        }
        
        
    }

    // Helper Methods:

    private PropertyDetailsDto convertEmptyStringsToNull(PropertyDetailsDto dto) {
        // Check each field and convert empty strings to null
       
    	 if (dto.getPricePerIndividual() != null && dto.getPricePerIndividual().compareTo(BigDecimal.ZERO) == 0) {
    	        dto.setPricePerIndividual(null);
    	    }
    	    if (dto.getAvgUtilitiesPerPerson() != null && dto.getAvgUtilitiesPerPerson().compareTo(BigDecimal.ZERO) == 0) {
    	        dto.setAvgUtilitiesPerPerson(null);
    	    }
        if (dto.getDietaryPreference().isEmpty()) {
            dto.setDietaryPreference(null);
        }
        if (dto.getStatus().isEmpty()) {
            dto.setStatus(null);
        }
       
        if (dto.getPeoplePresent() != null && dto.getPeoplePresent() == 0) {
            dto.setPeoplePresent(null);
        }
        if (dto.getPeopleRequired() != null && dto.getPeopleRequired() == 0) {
            dto.setPeopleRequired(null);
        }
        if (dto.getNearestUniversity().isEmpty()) {
            dto.setNearestUniversity(null);
        }
        if (dto.getAccommodationType().isEmpty()) {
            dto.setAccommodationType(null);
        }
        if (dto.getPreferredGender().isEmpty()) {
            dto.setPreferredGender(null);
        }
        


        return dto;
    }


	private void validateInputs(PropertyDetailsDto dto) throws ValidationException {
        List<String> missingFields = validateFields(dto);
        if (!missingFields.isEmpty()) {
            throw new ValidationException("Missing fields: " + String.join(", ", missingFields));
        }
        
        LocalDate availableFrom = LocalDate.parse(dto.getAvailableFrom());
        LocalDate endOfLease = LocalDate.parse(dto.getEndOfLease());
        
        if (endOfLease.isBefore(availableFrom)) {
            throw new ValidationException("End of lease must be after available date");
        }
        
        if (propertyRepository.existsBySellerEmailAndAddressAndCityAndStateAndPincode(
            dto.getSellerEmail(), dto.getAddress(), dto.getCity(), dto.getState(), dto.getPincode())) {
            throw new DataIntegrityViolationException("Property already exists");
        }
    }

    @Transactional(propagation = Propagation.MANDATORY)
    private PropertyDetails savePropertyToDatabase(PropertyDetailsDto dto) {
        PropertyDetails property = new PropertyDetails(dto);
        return propertyRepository.save(property);
    }

    private List<String> uploadMediaFiles(PropertyDetails property, 
                                        List<MultipartFile> files, 
                                        MultipartFile coverPhoto) throws IOException {
        List<PropertyMedia> mediaList = new ArrayList<>();
        UUID propertyId = property.getPropertyId();
        
        // Upload cover photo
        String coverUrl = uploadSingleFile(coverPhoto, propertyId, "COVER");
        mediaList.add(createMedia(property, coverUrl, "COVER"));
        
        // Upload additional files
        for (MultipartFile file : files) {
            String fileUrl = uploadSingleFile(file, propertyId, "REGULAR");
            mediaList.add(createMedia(property, fileUrl, "REGULAR"));
        }
        
        mediaRepository.saveAll(mediaList);
        return mediaList.stream().map(PropertyMedia::getMediaUrl).collect(Collectors.toList());
    }

    private String uploadSingleFile(MultipartFile file, UUID propertyId, String role) throws IOException {
        String fileType = file.getContentType();
        String folderType = fileType.startsWith("image") ? "image" : "video";
        String cloudinaryFolder = propertyId + "/" + folderType;
        return cloudinaryService.uploadFile(file, cloudinaryFolder);
    }

    private PropertyMedia createMedia(PropertyDetails property, String url, String role) {
        PropertyMedia media = new PropertyMedia();
        media.setProperty(property);
        media.setMediaType(url.contains("/image/") ? "image" : "video");
        media.setMediaUrl(url);
        media.setUploadedAt(new Date());
        media.setMediaRole(role);
        return media;
    }

   
    private void saveToElasticsearch(PropertyDetails property, List<String> mediaUrls) {
        PropertyDocument doc = new PropertyDocument(
            property.getPropertyId().toString(),
            property.getSellerEmail(),
          property.getUserType(),
            property.getListingType(),
            property.getTitle(),
            property.getDescription(),
            property.getPriceTotalUnit(),
            property.getPricePerIndividual(),
            property.getAvgUtilitiesPerPerson(),
            property.getBedrooms(),
            property.getBathrooms(),
            property.getAddress(),
            property.getCity(),
            property.getState(),
            property.getCountry(),
            property.getPincode(),
            property.getPeoplePresent(),
            property.getPeopleRequired(),
            property.getAccommodationType(),
            property.getPreferredGender(),
            property.getAvailableFrom(),
            property.getEndOfLease(),
            property.getNearestUniversity(),
            property.getDietaryPreference(),
            property.getStatus(),
            mediaUrls // All media URLs included in single save
        );
        
        //propertyDocumentRepository.save(doc);
        
        

//        IndexQuery indexQuery = new IndexQueryBuilder()
//            .withId(doc.getPropertyId())
//            .withObject(doc)
//            .build();
        
        IndexCoordinates index = IndexCoordinates.of("offcampus-search");

        try {
//            String documentId = elasticsearchOperations.index(
//                indexQuery,
//                IndexCoordinates.of("offcampus-search") // Replace with your actual index name
//            );
        	elasticsearchOperations.save(doc, index);
        	logger.debug("Saved document to Elasticsearch with ID: {}", doc.getPropertyId());
            //logger.debug("Saved document to Elasticsearch with ID: {}", documentId);
        } catch (Exception e) {
            logger.error("Failed to save document to Elasticsearch", e);
            // Implement retry logic or error handling as needed
        }
    }
    
    
    private boolean hasVideoFiles(List<MultipartFile> files) {
        return files.stream().anyMatch(file -> !file.getContentType().startsWith("image"));
    }


private ResponseEntity<?> checkVideoUploadPermission(String email) {
    Optional<UserSubscription> subscription = subscriptionRepository.findByUserEmail(email);
    
    // No subscription found
    if (subscription.isEmpty()) {
        return ResponseEntity.status(403)
            .body(createResponse("Premium subscription required for video uploads. Please upgrade your account."));
    }
    
    UserSubscription sub = subscription.get();
    LocalDateTime now = LocalDateTime.now();
    
    // Subscription exists but not active
    if (!"active".equals(sub.getStatus())) {
        return ResponseEntity.status(403)
            .body(createResponse("Your subscription is not active. Current status: " + sub.getStatus()));
    }
    
    // Subscription expired
    if (sub.getCurrentPeriodEnd().isBefore(now)) {
        return ResponseEntity.status(403)
            .body(createResponse("Your subscription expired on " + sub.getCurrentPeriodEnd()));
    }
    
    return null; // All checks passed
}
    
    
    

    private List<String> validateFields(PropertyDetailsDto propertyDetailsDto) {
        List<String> missingFields = new ArrayList<>();
        if (propertyDetailsDto.getSellerEmail() == null) missingFields.add("sellerEmail");
        if (propertyDetailsDto.getListingType() == null) missingFields.add("listingType");
        if (propertyDetailsDto.getTitle() == null) missingFields.add("title");
        if (propertyDetailsDto.getPriceTotalUnit() == null) missingFields.add("priceTotalUnit");
        if (propertyDetailsDto.getBedrooms() == 0) missingFields.add("bedrooms");
        if (propertyDetailsDto.getBathrooms() == 0) missingFields.add("bathrooms");
        if (propertyDetailsDto.getAddress() == null) missingFields.add("address");
        if (propertyDetailsDto.getCity() == null) missingFields.add("city");
        if (propertyDetailsDto.getState() == null) missingFields.add("state");
        if (propertyDetailsDto.getCountry() == null) missingFields.add("country");
        if (propertyDetailsDto.getStatus() == null) missingFields.add("status");
        if (propertyDetailsDto.getPeopleRequired() == null) missingFields.add("peopleRequired");
        
        
        return missingFields;
    }
    
    
    public PropertyDetailsAndMediaDto getPropertyById(UUID propertyId) {
        PropertyDetails property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        
        // Fetch associated media from the property_media table
        List<PropertyMedia> propertyMediaList = mediaRepository.findByProperty_PropertyId(propertyId);

        // Convert PropertyDetails to PropertyDetailsDto
        PropertyDetailsDto propertyDetailsDto = convertToDto(property);

        // Separate media URLs into image and video lists
        List<String> imageUrls = propertyMediaList.stream()
                .filter(media -> "image".equals(media.getMediaType())) // Filter by 'IMAGE' type
                .map(PropertyMedia::getMediaUrl) // Extract media URLs
                .collect(Collectors.toList());

        List<String> videoUrls = propertyMediaList.stream()
                .filter(media -> "video".equals(media.getMediaType())) // Filter by 'VIDEO' type
                .map(PropertyMedia::getMediaUrl) // Extract media URLs
                .collect(Collectors.toList());
        
        return new PropertyDetailsAndMediaDto(
                propertyDetailsDto.getSellerEmail(),
                propertyDetailsDto.getUserType(),
                propertyDetailsDto.getListingType(),
                propertyDetailsDto.getTitle(),
                propertyDetailsDto.getDescription(),
                propertyDetailsDto.getPriceTotalUnit(),
                propertyDetailsDto.getPricePerIndividual(),
                propertyDetailsDto.getAvgUtilitiesPerPerson(),
                propertyDetailsDto.getBedrooms(),
                propertyDetailsDto.getBathrooms(),
                propertyDetailsDto.getAddress(),
                propertyDetailsDto.getCity(),
                propertyDetailsDto.getState(),
                propertyDetailsDto.getCountry(),
                propertyDetailsDto.getPincode(),
                propertyDetailsDto.getPeoplePresent(),
                propertyDetailsDto.getPeopleRequired(),
                propertyDetailsDto.getAccommodationType(),
                propertyDetailsDto.getPreferredGender(),
                propertyDetailsDto.getAvailableFrom(),
                propertyDetailsDto.getEndOfLease(),
                propertyDetailsDto.getNearestUniversity(),
                propertyDetailsDto.getDietaryPreference(),
                propertyDetailsDto.getStatus(),
                imageUrls, videoUrls
        );
    
    }

    @Transactional
    public ResponseEntity<?> updateProperty(UUID propertyId, PropertyDetailsDto propertyDetailsDto,
    		List<String> imagesToDelete, List<MultipartFile> imagesToUpload) {
        PropertyDetails existingProperty = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        
        try {

        // **1. Validate Mandatory Fields**
        if (propertyDetailsDto.getListingType() == null || propertyDetailsDto.getListingType().isEmpty()) {
        	
        	return ResponseEntity.badRequest().body(createResponse("Listing Type cannot be left blank."));
        }

        if (propertyDetailsDto.getPeopleRequired() == null || propertyDetailsDto.getPeopleRequired() <= 0) {
        	return ResponseEntity.badRequest().body(createResponse("People required must be specified for both ROOM and WHOLE_UNIT."));
        }

        boolean listingTypeChanged = !existingProperty.getListingType().equals(propertyDetailsDto.getListingType());

        // **2. Handle Listing Type Changes**
        if (listingTypeChanged) {
            if (propertyDetailsDto.getListingType().equals("WHOLE_UNIT")) {
                // Reset fields specific to ROOM
                existingProperty.setPricePerIndividual(null);
                existingProperty.setAvgUtilitiesPerPerson(null);
                existingProperty.setPeoplePresent(null);
                existingProperty.setPeopleRequired(null);
                existingProperty.setPreferredGender(null);
                existingProperty.setDietaryPreference(null);
                existingProperty.setNearestUniversity(null);  // Optional, but reset on type change
                existingProperty.setAccommodationType(null);
            } else if (propertyDetailsDto.getListingType().equals("ROOM")) {
                // Reset fields specific to WHOLE_UNIT
                existingProperty.setPriceTotalUnit(null);
            }
        }

        // **3. Update Property Details**
        existingProperty.setSellerEmail(propertyDetailsDto.getSellerEmail());
        existingProperty.setUserType(propertyDetailsDto.getUserType());
        existingProperty.setListingType(propertyDetailsDto.getListingType());
        existingProperty.setTitle(propertyDetailsDto.getTitle());
        existingProperty.setDescription(propertyDetailsDto.getDescription());
        existingProperty.setAddress(propertyDetailsDto.getAddress());
        existingProperty.setCity(propertyDetailsDto.getCity());
        existingProperty.setState(propertyDetailsDto.getState());
        existingProperty.setCountry(propertyDetailsDto.getCountry());
        existingProperty.setPincode(propertyDetailsDto.getPincode());
        existingProperty.setBedrooms(propertyDetailsDto.getBedrooms());
        existingProperty.setBathrooms(propertyDetailsDto.getBathrooms());
        existingProperty.setStatus(propertyDetailsDto.getStatus());

        // **Parse Dates**
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            existingProperty.setAvailableFrom(dateFormat.parse(propertyDetailsDto.getAvailableFrom()));
            existingProperty.setEndOfLease(dateFormat.parse(propertyDetailsDto.getEndOfLease()));
        } catch (ParseException e) {
        	return ResponseEntity.badRequest().body(createResponse("Invalid date format. Please use yyyy-MM-dd"));
        }
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Convert String to LocalDate
        LocalDate availableFrom = LocalDate.parse(propertyDetailsDto.getAvailableFrom(), formatter);
        LocalDate endOfLease = LocalDate.parse(propertyDetailsDto.getEndOfLease(), formatter);
        LocalDate today = LocalDate.now();

        // Validate lease dates
        if (endOfLease.isBefore(availableFrom)) {
            return ResponseEntity.badRequest().body(createResponse("End of lease must be after the available date."));
        }
        if (endOfLease.isBefore(today)) {
            return ResponseEntity.badRequest().body(createResponse("End of lease must be after the current date."));
        }
  

        // **4. Update Fields Based on Listing Type**
        if (propertyDetailsDto.getListingType().equals("WHOLE_UNIT")) {
            if (propertyDetailsDto.getPriceTotalUnit() == null) {
            	return ResponseEntity.badRequest().body(createResponse("Price Total Unit is required for WHOLE_UNIT."));
            }
            existingProperty.setPriceTotalUnit(propertyDetailsDto.getPriceTotalUnit());
        } else if (propertyDetailsDto.getListingType().equals("ROOM")) {
            existingProperty.setPricePerIndividual(propertyDetailsDto.getPricePerIndividual());
            existingProperty.setAvgUtilitiesPerPerson(propertyDetailsDto.getAvgUtilitiesPerPerson());
            existingProperty.setPeoplePresent(propertyDetailsDto.getPeoplePresent());
            existingProperty.setPeopleRequired(propertyDetailsDto.getPeopleRequired());
            existingProperty.setPreferredGender(propertyDetailsDto.getPreferredGender());
            existingProperty.setDietaryPreference(propertyDetailsDto.getDietaryPreference());
            existingProperty.setNearestUniversity(propertyDetailsDto.getNearestUniversity()); // Optional
            existingProperty.setAccommodationType(propertyDetailsDto.getAccommodationType());
        }
        
        // Save property changes to the database
        PropertyDetails updatedProperty = propertyRepository.save(existingProperty);

       

        cloudinaryService.handleCloudinaryMedia(updatedProperty, imagesToDelete, imagesToUpload);

        // **6. Update Elasticsearch with current media URLs**
        List<String> updatedMediaUrls = mediaRepository.findByProperty_PropertyId(updatedProperty.getPropertyId())
                .stream()
                .map(PropertyMedia::getMediaUrl)
                .collect(Collectors.toList());

        updateElasticsearchDocument(updatedProperty, updatedMediaUrls);

        return ResponseEntity.ok(createResponse("Property Details updated successfully."));

    } catch (DateTimeParseException e) {
        return ResponseEntity.badRequest().body(createResponse("Invalid date format. Please use yyyy-MM-dd"));
    } catch (Exception e) {
        logger.error("Error updating property", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createResponse("Error updating property: " + e.getMessage()));
    }
        
    }
    
    
    
    
    private void updateElasticsearchDocument(PropertyDetails property, List<String> mediaUrls) {
    	
        try {
            PropertyDocument doc = new PropertyDocument(
                property.getPropertyId().toString(),
                property.getSellerEmail(),
                property.getUserType(),
                property.getListingType(),
                property.getTitle(),
                property.getDescription(),
                property.getPriceTotalUnit(),
                property.getPricePerIndividual(),
                property.getAvgUtilitiesPerPerson(),
                property.getBedrooms(),
                property.getBathrooms(),
                property.getAddress(),
                property.getCity(),
                property.getState(),
                property.getCountry(),
                property.getPincode(),
                property.getPeoplePresent(),
                property.getPeopleRequired(),
                property.getAccommodationType(),
                property.getPreferredGender(),
                property.getAvailableFrom(),
                property.getEndOfLease(),
                property.getNearestUniversity(),
                property.getDietaryPreference(),
                property.getStatus(),
                mediaUrls
            );
            
            IndexCoordinates index = IndexCoordinates.of("offcampus-search");
            elasticsearchOperations.save(doc, index);
            logger.info("Successfully updated Elasticsearch document for property ID: {}", property.getPropertyId());

        } catch (Exception e) {
            logger.error("Failed to update Elasticsearch document for property ID: {}", property.getPropertyId(), e);
            // You might want to implement a retry mechanism or queue the update for later
        }
}
    
    


    private PropertyDetailsDto convertToDto(PropertyDetails property) {
        return new PropertyDetailsDto(
                property.getSellerEmail(),
                property.getUserType(),
                property.getListingType(),
                property.getTitle(),
                property.getDescription(),
                property.getPriceTotalUnit(),
                property.getPricePerIndividual(),
                property.getAvgUtilitiesPerPerson(),
                property.getBedrooms(),
                property.getBathrooms(),
                property.getAddress(),
                property.getCity(),
                property.getState(),
                property.getCountry(),
                property.getPincode(),
                property.getPeoplePresent(),
                property.getPeopleRequired(),
                property.getAccommodationType(),
                property.getPreferredGender(),
                new SimpleDateFormat("yyyy-MM-dd").format(property.getAvailableFrom()),
                new SimpleDateFormat("yyyy-MM-dd").format(property.getEndOfLease()),
                property.getNearestUniversity(),
                property.getDietaryPreference(),
                property.getStatus() // Added status field
                
        );
    }
    
    
    
    
    
    
    private Map<String, String> createResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }
}


