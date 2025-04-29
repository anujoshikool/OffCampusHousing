package com.OffCampusHousing.OffCampusHousing.service;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.OffCampusHousing.OffCampusHousing.config.MailUtil;
import com.OffCampusHousing.OffCampusHousing.dto.AppointmentRequest;
import com.OffCampusHousing.OffCampusHousing.dto.BuyerPropertyWithMediaDto;
import com.OffCampusHousing.OffCampusHousing.entity.PropertyDetails;
import com.OffCampusHousing.OffCampusHousing.entity.PropertyMedia;
import com.OffCampusHousing.OffCampusHousing.repository.PropertyDetailsRepository;
import com.OffCampusHousing.OffCampusHousing.repository.PropertyMediaRepository;
import com.OffCampusHousing.OffCampusHousing.security.JwtAuthenticationFilter;
import com.OffCampusHousing.OffCampusHousing.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class BuyerPropertyService {

	
	private final PropertyDetailsRepository propertyDetailsRepository;
    private final PropertyMediaRepository propertyMediaRepository;
    @Autowired
    private MailUtil mailUtil; 
    @Autowired 
	private JwtAuthenticationFilter jwtFilter;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private RedisService redisService;
	
    @Autowired
    public BuyerPropertyService(PropertyDetailsRepository propertyDetailsRepository,
                           PropertyMediaRepository propertyMediaRepository 
                          ) {
        this.propertyDetailsRepository = propertyDetailsRepository;
        this.propertyMediaRepository = propertyMediaRepository;
        
    }

    public ResponseEntity<?> getAllPropertiesWithMedia(HttpServletRequest request) {
    	
//    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication == null) {
//        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body("User is not authenticated.");
//        }
//
//        // Extract user type from authentication (assuming username has user type encoded like 'user@example.com_SELLER')
//        String username = authentication.getName();
//        String[] usernameParts = username.split("_");
    	
//      
  
    	
    	String tabId = jwtFilter.getTabIdFromCookie(request);
	    //System.out.println("TAB ID: "+tabId);
	    if (tabId != null) {
	        // Retrieve the JWT token associated with the tabId from Redis
	        String token = redisService.getToken(tabId);

	        if (token != null && !jwtUtil.isTokenExpired(token)) {
	            // Extract email and userType from the token
	            String email = jwtUtil.extractSubject(token).split("_")[0];
	            String userTypeString = jwtUtil.extractSubject(token).split("_")[1].toString();
	            String userType = userTypeString;

        // Assuming last part of the username contains the userType ('SELLER' or 'BUYER')
       
            if ("SELLER".equals(userType)) {
            	return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createResponse("Please login as BUYER, You have logged in as SELLER"));
            }
        
    	
        List<PropertyDetails> properties = propertyDetailsRepository.findAll(); // Fetch all properties
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        List<BuyerPropertyWithMediaDto> dtos= properties.stream().map(property -> {
            // Create a DTO for each property
            BuyerPropertyWithMediaDto dto = new BuyerPropertyWithMediaDto();
            
            
            if (property.getAvailableFrom() != null) {
                dto.setAvailableFrom(dateFormat.format(property.getAvailableFrom()));
            }
            if (property.getEndOfLease() != null) {
                dto.setEndOfLease(dateFormat.format(property.getEndOfLease()));
            }
            
            //dto.setSellerEmail(property.getSellerEmail());
            //dto.setUserType(property.getUserType());
            dto.setPropertyId(property.getPropertyId());
            dto.setListingType(property.getListingType());
            dto.setTitle(property.getTitle());
            dto.setDescription(property.getDescription());
            dto.setPriceTotalUnit(property.getPriceTotalUnit());
            dto.setPricePerIndividual(property.getPricePerIndividual());
            dto.setAvgUtilitiesPerPerson(property.getAvgUtilitiesPerPerson());
            dto.setBedrooms(property.getBedrooms());
            dto.setBathrooms(property.getBathrooms());
            dto.setAddress(property.getAddress());
            dto.setCity(property.getCity());
            dto.setState(property.getState());
            dto.setCountry(property.getCountry());
            dto.setPincode(property.getPincode());
            dto.setPeoplePresent(property.getPeoplePresent());
            dto.setPeopleRequired(property.getPeopleRequired());
            dto.setAccommodationType(property.getAccommodationType());
            dto.setPreferredGender(property.getPreferredGender());
            
            dto.setNearestUniversity(property.getNearestUniversity());
            dto.setDietaryPreference(property.getDietaryPreference());
            dto.setStatus(property.getStatus());

            // Fetch associated media for the current property
            List<PropertyMedia> mediaList = propertyMediaRepository.findByProperty_PropertyId(property.getPropertyId());

            // Extract media URLs
            List<String> mediaUrls = mediaList.stream()
            							.filter(media -> "REGULAR".equals(media.getMediaRole()))
                                              .map(media -> media.getMediaUrl())
                                              .collect(Collectors.toList());

            dto.setMediaUrls(mediaUrls);
            String coverPhoto = mediaList.stream()
            	    .filter(media -> "COVER".equals(media.getMediaRole()))
            	    .map(media->media.getMediaUrl())
            	    .findFirst()
            	    .orElse(null); // orElse("default-cover.jpg") if you want a fallback
            
            dto.setCoverPhoto(coverPhoto);
            
            return dto;
        }).collect(Collectors.toList());
        
        return ResponseEntity.status(HttpStatus.OK)
                .body(dtos);
    }
	        else {
	            return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
	        } }
	    	else {
	            return ResponseEntity.status(400).body(createResponse("Tab ID missing in request."));
	        }
    }
    
    
    public ResponseEntity<?> getPropertyDetailsWithPropertyId(UUID propertyId,HttpServletRequest request) {
    	
//    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication == null) {
//        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body("User is not authenticated.");
//        }
//
//        // Extract user type from authentication (assuming username has user type encoded like 'user@example.com_SELLER')
//        String username = authentication.getName();
//        String[] usernameParts = username.split("_");
//        
//        
//        // Assuming last part of the username contains the userType ('SELLER' or 'BUYER')
//        if (usernameParts.length > 1) {
//            String userType = usernameParts[1];
//
//            if ("SELLER".equals(userType)) {
//            	return ResponseEntity.status(HttpStatus.FORBIDDEN)
//                        .body(createResponse("Please login as BUYER, You have logged in as SELLER"));
//            }
//        }
        

    	String tabId = jwtFilter.getTabIdFromCookie(request);
	    //System.out.println("TAB ID: "+tabId);
	    if (tabId != null) {
	        // Retrieve the JWT token associated with the tabId from Redis
	        String token = redisService.getToken(tabId);

	        if (token != null && !jwtUtil.isTokenExpired(token)) {
	            // Extract email and userType from the token
	            String email = jwtUtil.extractSubject(token).split("_")[0];
	            String userTypeString = jwtUtil.extractSubject(token).split("_")[1].toString();
	            String userType = userTypeString;

        // Assuming last part of the username contains the userType ('SELLER' or 'BUYER')
       
            if ("SELLER".equals(userType)) {
            	return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createResponse("Please login as BUYER, You have logged in as SELLER"));
            }
    	
    	
    	
    	
        PropertyDetails property = propertyDetailsRepository.findById(propertyId).orElse(null);
        
     // Check if the property exists
        if (property == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createResponse("Property Not Found."));
        }
                
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        
        
        // Create a DTO for the single property
        BuyerPropertyWithMediaDto dto = new BuyerPropertyWithMediaDto();

        if (property.getAvailableFrom() != null) {
            dto.setAvailableFrom(dateFormat.format(property.getAvailableFrom()));
        }
        if (property.getEndOfLease() != null) {
            dto.setEndOfLease(dateFormat.format(property.getEndOfLease()));
        }

        // Set other property fields to the DTO
        dto.setListingType(property.getListingType());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setPriceTotalUnit(property.getPriceTotalUnit());
        dto.setPricePerIndividual(property.getPricePerIndividual());
        dto.setAvgUtilitiesPerPerson(property.getAvgUtilitiesPerPerson());
        dto.setBedrooms(property.getBedrooms());
        dto.setBathrooms(property.getBathrooms());
        dto.setAddress(property.getAddress());
        dto.setCity(property.getCity());
        dto.setState(property.getState());
        dto.setCountry(property.getCountry());
        dto.setPincode(property.getPincode());
        dto.setPeoplePresent(property.getPeoplePresent());
        dto.setPeopleRequired(property.getPeopleRequired());
        dto.setAccommodationType(property.getAccommodationType());
        dto.setPreferredGender(property.getPreferredGender());

        dto.setNearestUniversity(property.getNearestUniversity());
        dto.setDietaryPreference(property.getDietaryPreference());
        dto.setStatus(property.getStatus());

        // Fetch associated media for the current property
        List<PropertyMedia> mediaList = propertyMediaRepository.findByProperty_PropertyId(property.getPropertyId());

        // Extract media URLs
        List<String> mediaUrls = mediaList.stream()
                                          .map(media -> media.getMediaUrl())
                                          .collect(Collectors.toList());

        dto.setMediaUrls(mediaUrls);

        // Return the DTO in the response body
        return ResponseEntity.status(HttpStatus.OK).body(dto);
	}
	        else {
	            return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
	        } }
	    	else {
	            return ResponseEntity.status(400).body(createResponse("Tab ID missing in request."));
	        }
    }
    
    
    public ResponseEntity<?> sendInterestMailToSeller(UUID propertyId,AppointmentRequest appointmentRequest,HttpServletRequest request) {
    	
//    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication == null) {
//        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body("User is not authenticated.");
//        }
//
//        // Extract user type from authentication (assuming username has user type encoded like 'user@example.com_SELLER')
//        String username = authentication.getName();
//        String[] usernameParts = username.split("_");
//        String buyerEmail = usernameParts[0];
//        
//        
//        // Assuming last part of the username contains the userType ('SELLER' or 'BUYER')
//        if (usernameParts.length > 1) {
//            String userType = usernameParts[1];
//
//            if ("SELLER".equals(userType)) {
//            	return ResponseEntity.status(HttpStatus.FORBIDDEN)
//                        .body(createResponse("Please login as BUYER, You have logged in as SELLER"));
//            }
//        }
    	
    	
    	
    	String tabId = jwtFilter.getTabIdFromCookie(request);
	    //System.out.println("TAB ID: "+tabId);
	    if (tabId != null) {
	        // Retrieve the JWT token associated with the tabId from Redis
	        String token = redisService.getToken(tabId);

	        if (token != null && !jwtUtil.isTokenExpired(token)) {
	            // Extract email and userType from the token
	            String buyerEmail = jwtUtil.extractSubject(token).split("_")[0];
	            String userTypeString = jwtUtil.extractSubject(token).split("_")[1].toString();
	            String userType = userTypeString;

        // Assuming last part of the username contains the userType ('SELLER' or 'BUYER')
       
            if ("SELLER".equals(userType)) {
            	return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createResponse("Please login as BUYER, You have logged in as SELLER"));
            }
    	
    	
        
        String sellerEmail = propertyDetailsRepository.findSellerEmailByPropertyId(propertyId);
        
        String propertySellerAddress = propertyDetailsRepository.findAddressByPropertyId(propertyId);
		
        // Step 4: Check if seller email or property address is missing
        if (sellerEmail == null || propertySellerAddress == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createResponse("Property or Seller not found."));
        }

        
        // Email content
        String subject = "Someone showed Interest in Viewing Apartment At .... ";
        String text = "Hello " + sellerEmail.substring(0, 5) + ",\n\n"
        	    + buyerEmail + " has expressed interest in scheduling a tour of your apartment at " + propertySellerAddress
        	    + ".\nThey have requested a visit on " + appointmentRequest.getDate() + " at " + appointmentRequest.getTime()
        	    + ".\nCould you please confirm your availability for the requested time?";

        try {
            mailUtil.sendEmail(sellerEmail, subject, text);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createResponse("Failed to send email to the seller."));
        }
        
        return ResponseEntity.status(HttpStatus.OK)
                .body(createResponse("Interest email sent to the seller successfully."));

	}
	        else {
	            return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
	        } }
	    	else {
	            return ResponseEntity.status(400).body(createResponse("Tab ID missing in request."));
	        }
    }


    
    
    private Map<String, String> createResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }

	
	
}
