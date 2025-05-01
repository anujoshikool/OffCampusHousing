package com.OffCampusHousing.OffCampusHousing.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.OffCampusHousing.OffCampusHousing.dto.PropertyDetailsAndMediaDto;
import com.OffCampusHousing.OffCampusHousing.dto.PropertyDetailsDto;
import com.OffCampusHousing.OffCampusHousing.dto.PropertyFilterDto;
import com.OffCampusHousing.OffCampusHousing.dto.UserFeedbackRequest;
import com.OffCampusHousing.OffCampusHousing.entity.PropertyDetails;
import com.OffCampusHousing.OffCampusHousing.entity.PropertyDocument;
import com.OffCampusHousing.OffCampusHousing.entity.User;
import com.OffCampusHousing.OffCampusHousing.entity.UserFeedback;
import com.OffCampusHousing.OffCampusHousing.entity.UserSubscription;
import com.OffCampusHousing.OffCampusHousing.repository.PropertyDetailsRepository;
import com.OffCampusHousing.OffCampusHousing.repository.PropertyMediaRepository;
import com.OffCampusHousing.OffCampusHousing.repository.SubscriptionRepository;
import com.OffCampusHousing.OffCampusHousing.repository.UserFeedbackRepository;
import com.OffCampusHousing.OffCampusHousing.repository.UserRepositoryImpl;
import com.OffCampusHousing.OffCampusHousing.security.JwtAuthenticationFilter;
import com.OffCampusHousing.OffCampusHousing.security.JwtUtil;
import com.OffCampusHousing.OffCampusHousing.service.CloudinaryService;
import com.OffCampusHousing.OffCampusHousing.service.PropertySearchService;
import com.OffCampusHousing.OffCampusHousing.service.RedisService;
import com.OffCampusHousing.OffCampusHousing.service.SellerPropertyService;
import com.OffCampusHousing.OffCampusHousing.service.StripeService;
import com.OffCampusHousing.OffCampusHousing.service.StripeWebhookService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.StripeException;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/seller-properties")
public class SellerPropertyController {
		
	@Autowired
	private SellerPropertyService sellerService;
	@Autowired 
	private JwtAuthenticationFilter jwtFilter;
	@Autowired
	private RedisService redisService;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private PropertyDetailsRepository propertyDetailsRepository;
	@Autowired
	 private UserRepositoryImpl userRepository;
	@Autowired
	private  CloudinaryService cloudinaryService;
	@Autowired
	private PropertySearchService propertySearchService;
	 @Autowired
	    private StripeService stripeService;
	 @Autowired
	 private StripeWebhookService stripeWebhookService;
	 @Autowired
	    private SubscriptionRepository subscriptionRepository;
	 @Autowired
		private UserFeedbackRepository userFeedbackRepository;
	 @Autowired
	 private  PropertyMediaRepository mediaRepository;
	    @Autowired
	    private ObjectMapper objectMapper;
		

	
	
	@PostMapping(value = "/addProperty" ,consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> addProperty(
			@ModelAttribute PropertyDetailsDto propertyDetailsDto, @RequestParam("coverPhoto") MultipartFile coverPhoto,
	    @RequestParam("files") List<MultipartFile> files,HttpServletRequest request) {
		
		System.out.println("Pro:"+propertyDetailsDto.getUserType() +propertyDetailsDto.getSellerEmail() + propertyDetailsDto.getAddress());
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

	
	 if (!"SELLER".equals(userType)) {
	        return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
	    }
	
	 
		
		 String sellerEmail = propertyDetailsDto.getSellerEmail();
	        userTypeString = propertyDetailsDto.getUserType();
	      
	        User.UserType userType1;
	        try {
	            userType1 = User.UserType.valueOf(userTypeString);
	            System.out.println(userType1+"user :");
	        } catch (IllegalArgumentException e) {
	            return ResponseEntity.badRequest().body("Invalid user type: " + userTypeString);
	        }
	        
	        boolean userExistsAndVerified = userRepository.existsByEmailAndUserTypeAndIsVerified(sellerEmail, userType1, true);

	        if (!userExistsAndVerified) {
	            return ResponseEntity.status(403).body(createResponse("User is not verified or does not exist."));
	        }
		
		
	    return sellerService.addProperty(propertyDetailsDto, files,coverPhoto);
	}	
	        else {
	            return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
	        } }
	    	else {
	            return ResponseEntity.status(400).body(createResponse("Tab ID missing in request."));
	        }
	}
	

	@GetMapping({"/myProperties/{propertyId}", "/{propertyId}"})
	    public ResponseEntity<?> getPropertyById(@PathVariable UUID propertyId,HttpServletRequest request) {
		  
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

		
//		 if (!"SELLER".equals(userType)) {
//		        return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
//		    }
		 if(!propertyDetailsRepository.existsBySellerEmailAndUserTypeAndPropertyId(email, userType, propertyId)) { 
			 return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
		 }
		 System.out.println("Propety ID:"+propertyId);
		  PropertyDetailsAndMediaDto property = sellerService.getPropertyById(propertyId);
	        return ResponseEntity.ok(property);
	    }
		        else {
		            return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
		        } }
		    	else {
		            return ResponseEntity.status(400).body(createResponse("Tab ID missing in request."));
		        }
	}

	    @PutMapping(value = "/{propertyId}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	    public ResponseEntity<?> updateProperty(
	    		@PathVariable UUID propertyId, 
	    		@RequestPart("propertyDetails") String propertyDetailsJson, 
	            @RequestParam(value = "imagesToDeleteList", required = false) String imagesToDeleteListJson, 
	            @RequestParam(value = "imagesToUpload", required = false) List<MultipartFile> imagesToUpload,
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

			
			 if (!"SELLER".equals(userType)) {
			        return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
			    }
	    	
	         
	    	try {
	    	ObjectMapper objectMapper = new ObjectMapper();
	    	PropertyDetailsDto propertyDetailsDto = objectMapper.readValue(propertyDetailsJson, PropertyDetailsDto.class);
	    	
	    	List<String> imagesToDelete = null;
	        if (imagesToDeleteListJson != null) {
	            imagesToDelete = objectMapper.readValue(imagesToDeleteListJson, new TypeReference<List<String>>() {});
	        }
	    	
	    	return sellerService.updateProperty(propertyId, propertyDetailsDto,imagesToDelete,imagesToUpload);
	    	}
	    	catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body("Error processing request: " + e.getMessage());
	        }
	        //return ResponseEntity.ok("Property updated successfully.");
	    }
	 else {
			    return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
	   } }
			else {
			            return ResponseEntity.status(400).body(createResponse("Tab ID missing in request."));
			   }
}
	
	
	@GetMapping("/myProperties")
		public ResponseEntity<?> getPropertiesBySeller(HttpServletRequest request){
//		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//		System.out.println("Authentication: "+authentication);
//		String email = authentication.getName().split("_")[0];
//		String userType = authentication.getName().split("_")[1];
		
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

		
		 if (!"SELLER".equals(userType)) {
		        return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
		    }
		
		List<PropertyDetails> properties = propertyDetailsRepository.findBySellerEmailAndUserType(
				email, userType);
		
		if (properties.isEmpty()) {
			return ResponseEntity.status(404).body(createResponse("No properties Found."));
		}
		
		
		 // Transform properties to include mediaUrl
	    List<Map<String, Object>> response = properties.stream()
	        .map(property -> {
	            // 1. Convert entire property to Map automatically
	            Map<String, Object> propertyMap = objectMapper.convertValue(property, Map.class);
	            
	            // 2. Just add mediaUrl to the existing fields
	            propertyMap.put("mediaUrl", 
	                mediaRepository.findFirstMediaUrlByPropertyId(property.getPropertyId())
	                    .orElse(null));
	            
	            return propertyMap;
	        })
	        .collect(Collectors.toList());
		
	    return ResponseEntity.ok(response);
	}
	else {
        return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
    } }
	else {
        return ResponseEntity.status(400).body(createResponse("Tab ID missing in request."));
    }
}
	
	@Transactional
	@DeleteMapping("/deleteProperty")
	public ResponseEntity<?> deleteProperty(
			@RequestBody List<UUID> propertyIds,HttpServletRequest request
	        ) {

		//Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    // Extract the currently authenticated user's email and userType (from JWT or Security Context)
	    //String email = authentication.getName().split("_")[0];  // This assumes that the email is used as the principal name
	    
	    //String userType = "SELLER"; // You can extract this from JWT token if you're using JWT authentication

		String tabId = jwtFilter.getTabIdFromCookie(request);
	    
	    if (tabId != null) {
	        // Retrieve the JWT token associated with the tabId from Redis
	        String token = redisService.getToken(tabId);

	        if (token != null && !jwtUtil.isTokenExpired(token)) {
	            // Extract email and userType from the token
	            String email = jwtUtil.extractSubject(token).split("_")[0];
//	            String userTypeString = jwtUtil.extractSubject(token).split("_")[1].toString();
//	            String userType = userTypeString;
//		
	  
	    // Find the property by its propertyId
	    List<PropertyDetails> propertiesToDelete = propertyDetailsRepository.findAllByPropertyIdIn(propertyIds);
	    
	    if (propertiesToDelete.isEmpty()) {
	        // If no properties are found with the provided IDs
	        return ResponseEntity.status(404).body(createResponse("Property not found."));
	    }
	    
	    
	    
	    List<PropertyDetails> ownedProperties = propertiesToDelete.stream()
	            .filter(property -> property.getSellerEmail().equals(email) && property.getUserType().equals("SELLER"))
	            .collect(Collectors.toList());

	    if (ownedProperties.isEmpty()) {
	        // If no owned properties are found in the selected ones
	        return ResponseEntity.status(403).body(createResponse("You do not have permission to delete the selected property(s)."));
	    }

	    try {
	        propertyDetailsRepository.deleteAll(ownedProperties);
	        // If no exception is thrown, the deletion was successful
	    } catch (Exception e) {
	        // Handle exception, such as a database constraint violation or connection issue
	        throw new RuntimeException("Error occurred while deleting properties: " + e.getMessage());
	    }
	    
	    // Now, delete the associated files/folder from Cloudinary (assuming folder name is based on the propertyId)
	    try {
	        // Assume this is injected via Spring

	        for (PropertyDetails property : ownedProperties) {
	            String propertyId = property.getPropertyId().toString(); // Get the propertyId
	            cloudinaryService.deleteFolderFromCloudinary(propertyId);  // Delete all resources in this folder
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body(createResponse("Error occurred while deleting files from Cloudinary: " + e.getMessage()));
	    }

	    return ResponseEntity.ok(createResponse(ownedProperties.size() + " property(ies) deleted successfully."));
	}
	   else {
	            return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
	    } }
	   else {
	            return ResponseEntity.status(400).body(createResponse("Tab ID missing in request."));
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
		    
		    if (tabId != null) {
		        // Retrieve the JWT token associated with the tabId from Redis
		        String token = redisService.getToken(tabId);

		        if (token != null && !jwtUtil.isTokenExpired(token)) {
		           
		            String email = jwtUtil.extractSubject(token).split("_")[0];
		            String userType = jwtUtil.extractSubject(token).split("_")[1];
		            if (!"SELLER".equals(userType)) {
		                return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
		            }
	            try {
	                Page<PropertyDocument> properties = propertySearchService.searchProperties(searchRequest, page, size, userType, email);
	                return ResponseEntity.ok(properties);
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
	
	
	@PostMapping("/subscribe")
    public ResponseEntity<?> createSubscription(HttpServletRequest request) {
		
		 String tabId = jwtFilter.getTabIdFromCookie(request);  
		    
		    if (tabId != null) {
		        // Retrieve the JWT token associated with the tabId from Redis
		        String token = redisService.getToken(tabId);

		        if (token != null && !jwtUtil.isTokenExpired(token)) {
		           
		            String email = jwtUtil.extractSubject(token).split("_")[0];
		            String userType = jwtUtil.extractSubject(token).split("_")[1];
		            if (!"SELLER".equals(userType)) {
		                return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
		            }
        try {
            String sessionId = stripeService.createCheckoutSession(email);
            return ResponseEntity.ok(Map.of("sessionId", sessionId));
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        } 
		}else {
            return ResponseEntity.status(403).body(createResponse("Invalid token structure."));
		} } else {
        return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
       }
	}
	
	
	@GetMapping("/status")
	public ResponseEntity<?> checkSubscriptionStatus(HttpServletRequest request) {
	    String tabId = jwtFilter.getTabIdFromCookie(request);  
	    
	    if (tabId != null) {
	        // Retrieve the JWT token associated with the tabId from Redis
	        String token = redisService.getToken(tabId);

	        if (token != null && !jwtUtil.isTokenExpired(token)) {
	           
	            String email = jwtUtil.extractSubject(token).split("_")[0];
	            String userType = jwtUtil.extractSubject(token).split("_")[1];
	            if (!"SELLER".equals(userType)) {
	                return ResponseEntity.status(403).body(createResponse("You do not have permission to view property(s)."));
	            }

	            // Check subscription status
	            UserSubscription subscription = subscriptionRepository.findByUserEmail(email).orElse(null);

	            if (subscription == null) {
	                return ResponseEntity.status(403).body(createResponse("Subscription not found."));
	            }

	            Map<String, Object> response = new HashMap<>();
	            response.put("isSubscribed", subscription.isActive());
	            response.put("status", subscription.getStatus());
	            response.put("currentPeriodEnd", subscription.getCurrentPeriodEnd());
	            response.put("stripeSubscriptionId", subscription.getStripeSubscriptionId());

	            return ResponseEntity.ok(response);
	        } else {
	            return ResponseEntity.status(403).body(createResponse("Invalid token structure."));
	        }
	    }

	    return ResponseEntity.status(403).body(createResponse("Invalid or expired token."));
	}
	
	
	
	@PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(HttpServletRequest request,
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
		
		 
		            return stripeWebhookService.processWebhook(payload, sigHeader);
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
	
	
	@GetMapping("/recentActivity")
	public ResponseEntity<?> recentActivity(HttpServletRequest request) {
		
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
		            	
		            	 String fullAddress = propertyDetailsRepository.findLatestAddressByEmailUsingCtid(email);
		            	    
		            	    if (fullAddress != null) {
		            	        // Extract the place name from the address
		            	        String placeName = extractPlaceName(fullAddress);
		            	        
		            	        String message = "You have just added your latest listing in " + placeName;
		            	        return ResponseEntity.status(200).body(createResponse(message));
		            	    } else {
		            	        return ResponseEntity.status(200).body(createResponse("No properties found for this user"));
		            	    }
		            	
		            	
		            }
		            catch (Exception e) {
		                return ResponseEntity.status(500).body("An error occurred while submitting feedback: " + e.getMessage());
		            }
		        } else {
		            return ResponseEntity.status(403).body("Invalid token structure.");
		        }
		    } else {
		        return ResponseEntity.status(403).body("Invalid or expired token.");
		    }
	}
	
	
	private String extractPlaceName(String fullAddress) {
	    // Split by comma to separate street from city/state
	    String[] parts = fullAddress.split(",");
	    
	    if (parts.length >= 2) {
	        // Case: "212 E 125th St, New York, NY 10035"
	        // Return city name (New York)
	        return parts[1].trim().split(" ")[0] + " " + parts[1].trim().split(" ")[1]; // Gets city and state
	    } else {
	        // Case: "36 Blossom st" or "1 Hawthrone Street APT 3"
	        // Return the street name
	        String[] streetParts = fullAddress.split(" ");
	        if (streetParts.length >= 2) {
	            return streetParts[1] + " " + streetParts[2]; // Gets the street name and type
	        }
	        return fullAddress; // Fallback to return full address if pattern doesn't match
	    }
	
	}
	 private Map<String, String> createResponse(String message) {
	        Map<String, String> response = new HashMap<>();
	        response.put("message", message);
	        return response;
	    }
	


}
