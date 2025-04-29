package com.OffCampusHousing.OffCampusHousing.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.OffCampusHousing.OffCampusHousing.dto.AppointmentRequest;
import com.OffCampusHousing.OffCampusHousing.dto.PropertyFilterDto;
import com.OffCampusHousing.OffCampusHousing.dto.PropertySearchResponseDto;
import com.OffCampusHousing.OffCampusHousing.dto.UserFeedbackRequest;
import com.OffCampusHousing.OffCampusHousing.entity.PropertyDocument;
import com.OffCampusHousing.OffCampusHousing.entity.UserFeedback;
import com.OffCampusHousing.OffCampusHousing.repository.PropertyDetailsRepository;
import com.OffCampusHousing.OffCampusHousing.repository.UserFeedbackRepository;
import com.OffCampusHousing.OffCampusHousing.security.JwtAuthenticationFilter;
import com.OffCampusHousing.OffCampusHousing.security.JwtUtil;
import com.OffCampusHousing.OffCampusHousing.service.BuyerPropertyService;
import com.OffCampusHousing.OffCampusHousing.service.PropertySaveService;
import com.OffCampusHousing.OffCampusHousing.service.PropertySearchService;
import com.OffCampusHousing.OffCampusHousing.service.RedisService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/buyer-properties")
public class BuyerPropertyController {
	
	@Autowired
	private BuyerPropertyService buyerPropertyService;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired 
	private JwtAuthenticationFilter jwtFilter;
	@Autowired
	private PropertySearchService propertySearchService;
	@Autowired
	private RedisService redisService;
	@Autowired
	private  PropertyDetailsRepository propertyDetailsRepository;
	@Autowired
	private  PropertySaveService saveService;
	@Autowired
	private UserFeedbackRepository userFeedbackRepository;
	
	
	@GetMapping("/allProperties")
	public ResponseEntity<?> getAllProperties(HttpServletRequest request) {
		
        return buyerPropertyService.getAllPropertiesWithMedia(request);
    }

	@GetMapping("/buyerProperty/{propertyId}")
	public ResponseEntity<?> getPropertyDetilsById(@PathVariable UUID propertyId,HttpServletRequest request){
		
		return buyerPropertyService.getPropertyDetailsWithPropertyId(propertyId,request);
	}
	
	@PostMapping("/express-Interest/{propertyId}")
	public ResponseEntity<?> sendInterestMailToSeller(@PathVariable UUID propertyId,
			@RequestBody AppointmentRequest appointmentRequest,HttpServletRequest request){
		return buyerPropertyService.sendInterestMailToSeller(propertyId,appointmentRequest,request);
		
	}
	
	
	 // Toggle Favorite
    @PostMapping("/buyerProperty/{propertyId}/favorite")
    public ResponseEntity<?> toggleFavorite(
            @PathVariable UUID propertyId,
            HttpServletRequest request) {
    	
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
	            
	            if (!"BUYER".equals(userType)) {
	                return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
	            }

            try {
            	 boolean isFavorite = saveService.toggleFavorite(email, propertyId);
                 return ResponseEntity.ok(Collections.singletonMap("isFavorite", isFavorite));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(createResponse("An error occurred while searching properties: " + e.getMessage()));
            }
        } else {
            return ResponseEntity.status(403).body(createResponse("Invalid token structure."));
        }
    } else {
        return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
    }

    }
	
    
    
    // Toggle Saved Property
    @PostMapping("/buyerProperty/{propertyId}/save")
    public ResponseEntity<?> toggleSavedProperty(
            @PathVariable UUID propertyId,
            HttpServletRequest request) {
        		
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
	            
	            if (!"BUYER".equals(userType)) {
	                return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
	            }

            try {
            	
            	 boolean isSaved = saveService.toggleSavedProperty(email, propertyId);
                 return ResponseEntity.ok(Collections.singletonMap("isSaved", isSaved));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(createResponse("An error occurred while searching properties: " + e.getMessage()));
            }
        } else {
            return ResponseEntity.status(403).body(createResponse("Invalid token structure."));
        }
    } else {
        return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
    }  
       
    }
    
    
    
    
    
    // Get All Favorites
    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites(HttpServletRequest request) {
    	 if (request == null) {
    		 
    	        return ResponseEntity.badRequest().body(createResponse("Request cannot be null"));
    	    }
    	

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
	            
	            if (!"BUYER".equals(userType)) {
	                return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
	            }

            try {
            	
            	return ResponseEntity.ok(saveService.getFavorites(email,request));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(createResponse("An error occurred while fetching properties: " + e.getMessage()));
            }
        } else {
            return ResponseEntity.status(403).body(createResponse("Invalid token structure."));
        }
    } else {
        return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
    }  

    }
    
    
    
    // Get All Saved Properties
    @GetMapping("/saved")
    public ResponseEntity<?> getSavedProperties(HttpServletRequest request) {

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
	            
	            if (!"BUYER".equals(userType)) {
	                return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
	            }

            try {
            	
            	return ResponseEntity.ok(saveService.getSavedProperties(email,request));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(createResponse("An error occurred while searching properties: " + e.getMessage()));
            }
        } else {
            return ResponseEntity.status(403).body(createResponse("Invalid token structure."));
        }
    } else {
        return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
    }  

        
    }

    
	
	
	@PostMapping(value="/search",
			consumes = MediaType.APPLICATION_JSON_VALUE,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> searchProperties(
	        @RequestBody PropertyFilterDto searchRequest,
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "10") int size,
	        HttpServletRequest request) {
	    
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

	            try {
	                Page<PropertyDocument> properties = propertySearchService.searchProperties(searchRequest, page, size, userType, email);
	             // Convert to response DTO
	                Page<PropertySearchResponseDto> response = properties.map(PropertySearchResponseDto::fromDocument);
	                return ResponseEntity.ok(response);

	            } catch (Exception e) {
	                return ResponseEntity.status(500).body(createResponse("An error occurred while searching properties: " + e.getMessage()));
	            }
	        } else {
	            return ResponseEntity.status(403).body(createResponse("Invalid token structure."));
	        }
	    } else {
	        return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
	    }
	}
	
	@GetMapping("/totalListing")
	public long getCount() {
		return propertyDetailsRepository.count();
	}
	
	
	@PostMapping("/feedback")
	public ResponseEntity<?> submitFeedback(@RequestBody UserFeedbackRequest feedbackRequest, HttpServletRequest request) {
	    // Create a UserFeedback entity from the request body
	    
	    String tabId = jwtFilter.getTabIdFromCookie(request);
	    // System.out.println("TAB ID: " + tabId);
	    if (tabId != null) {
	        // Retrieve the JWT token associated with the tabId from Redis
	        String token = redisService.getToken(tabId);

	        if (token != null && !jwtUtil.isTokenExpired(token)) {
	            // Extract email and userType from the token
	            String email = jwtUtil.extractSubject(token).split("_")[0];
	            String userTypeString = jwtUtil.extractSubject(token).split("_")[1];
	            String userType = userTypeString;

	            try {
	                // Creating UserFeedback entity using the request data
	                UserFeedback feedback = UserFeedback.builder()
	                        .name(feedbackRequest.getName())
	                        .email(feedbackRequest.getEmail())
	                        .rating(feedbackRequest.getRating())
	                        .feedbackType(feedbackRequest.getFeedbackType())
	                        .feedback(feedbackRequest.getFeedback())
	                        .build();
	                
	                // Save feedback to the database
	                UserFeedback savedFeedback = userFeedbackRepository.save(feedback);
	                
	                // Return a custom response message with the saved feedback's name and success message
	                return ResponseEntity.status(200).body(createResponse("Thank you for your feedback, " + savedFeedback.getName() + "!"));

	            } catch (Exception e) {
	                return ResponseEntity.status(500).body("An error occurred while submitting feedback: " + e.getMessage());
	            }
	        } else {
	            return ResponseEntity.status(403).body("Invalid token structure.");
	        }
	    } else {
	        return ResponseEntity.status(403).body("Invalid or expired token.");
	    }
	}


	
	 private Map<String, String> createResponse(String message) {
	        Map<String, String> response = new HashMap<>();
	        response.put("message", message);
	        return response;
	    }
	
}
