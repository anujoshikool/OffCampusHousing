package com.OffCampusHousing.OffCampusHousing.controller;


import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.OffCampusHousing.OffCampusHousing.config.MailUtil;
import com.OffCampusHousing.OffCampusHousing.dto.EditProfieRequestDto;
import com.OffCampusHousing.OffCampusHousing.dto.ForgotPasswordRequestDto;
import com.OffCampusHousing.OffCampusHousing.dto.LoginRequestDto;
import com.OffCampusHousing.OffCampusHousing.dto.LoginResponseDto;
import com.OffCampusHousing.OffCampusHousing.dto.PasswordResponseDto;
import com.OffCampusHousing.OffCampusHousing.dto.RegisterRequestDto;
import com.OffCampusHousing.OffCampusHousing.dto.RegisterResponseDto;
import com.OffCampusHousing.OffCampusHousing.dto.ResetPasswordRequestDto;
import com.OffCampusHousing.OffCampusHousing.entity.User;
import com.OffCampusHousing.OffCampusHousing.entity.User.UserType;
import com.OffCampusHousing.OffCampusHousing.repository.UserRepositoryImpl;
import com.OffCampusHousing.OffCampusHousing.security.JwtUtil;
import com.OffCampusHousing.OffCampusHousing.service.AuthServiceImpl;
import com.OffCampusHousing.OffCampusHousing.service.RedisService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	@Autowired
	private AuthServiceImpl authService;
	@Autowired
    private JwtUtil jwtUtil;
	@Autowired
	private UserRepositoryImpl userRepository; 
	@Autowired
	private RedisService redisService;
	@Value("${frontend.url}")
	private String frontendUrl;
	@Autowired
	private MailUtil mailUtil;
	 private static final Logger logger = LoggerFactory.getLogger(AuthController.class);


	@PostMapping("/register")
	public ResponseEntity<RegisterResponseDto> registerUser(@Valid @RequestBody RegisterRequestDto request,BindingResult result) {
		
		if (result.hasErrors()) {
            String errorMessage = result.getFieldErrors()
                    .stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            System.out.println("Validation Error: " + errorMessage);
            return ResponseEntity.badRequest().body(new RegisterResponseDto(errorMessage));
        }
		
	    return authService.registerUser(request);
	}
	
	
	@PutMapping("/edit-profile")
	 public ResponseEntity<?> editMyProfile(HttpServletRequest request,@Valid @RequestBody EditProfieRequestDto req) {
		
		String token = getTokenFromCookie(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token not found in cookies");
        }
        // Extract the email and UserType from the token
        String email = jwtUtil.extractSubject(token).split("_")[0];
        UserType userType = UserType.valueOf(jwtUtil.extractSubject(token).split("_")[1]);

        // Validate the token and fetch user details from the repository
        boolean isValid = jwtUtil.isTokenValid(token, email, userType);
        if (isValid) {
            // Fetch user details from the repository
            Optional<User> userOpt = userRepository.findByUserKeyEmailAndUserType(email, userType);

            if (userOpt.isPresent()) {
            	User user = userOpt.get();
            	  if (req.getFirstName() != null) {
            	        user.setFirstName(req.getFirstName());
            	    }
            	    if (req.getLastName() != null) {
            	        user.setLastName(req.getLastName());
            	    }
            	    if (req.getGender() != null) {
            	        user.setGender(req.getGender());
            	    }
            	    if (req.getDob() != null) {
            	        user.setDob(req.getDob());
            	    }

            	    userRepository.saveUser(user);
                // Return the user details if found
            	    return ResponseEntity.ok(new RegisterResponseDto("Profile updated successfully"));

            } else {
                return ResponseEntity.status(404).body("User not found");
            }
        } else {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }
	
    	
	
//	 @GetMapping("/verify")
//	 public ResponseEntity<?> verifyEmail(@RequestParam String token) {
//		 System.out.println("Received token: " + token);
//		 
//		 if (token == null || token.isEmpty()) {
//		        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new RegisterResponseDto("Token is missing."));
//		    }
//		 
//	     // Fetch the user by verification token
//	     Optional<User> userOpt = userRepository.findByVerificationToken(token);
//	     User user = userOpt.get();
//
//	     if (!userOpt.isPresent()) {
//	    	// Check if the user is already verified
//		     if (Boolean.TRUE.equals(user.getIsVerified())) {
//		         return ResponseEntity.ok(new RegisterResponseDto("You are already verified."));
//		     }
//	         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new RegisterResponseDto("Invalid token."));
//	     }
//
//	     
//
//	     // Check if the token has expired
//	     if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
//	         return ResponseEntity.badRequest().body(new RegisterResponseDto("Token has expired."));
//	     }
//	     
//	     
//	     // Set the user as verified
//	     user.setIsVerified(true);  // Assuming isVerified is the flag indicating the email is verified.
//	     user.setVerificationToken(null);  // Nullify the verification token
//	     user.setVerificationTokenExpiry(null);  // Nullify the expiration time
//
//	     // Save the updated user
//	     userRepository.saveUser(user);
//
//	     return ResponseEntity.ok(new RegisterResponseDto("Email successfully verified."));
//	 }
//

	
	@GetMapping("/verify")
	public ResponseEntity<?> verifyEmail(@RequestParam String token) {
	    System.out.println("Received token: " + token);
	    
	    if (token == null || token.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new RegisterResponseDto("Token is missing."));
	    }
	    
	    // Fetch the user by verification token
	    Optional<User> userOpt = userRepository.findByVerificationToken(token);
	    
	    if (!userOpt.isPresent()) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new RegisterResponseDto("Invalid token."));
	    }
	    
	    User user = userOpt.get();
	    
	    // Check if the user is already verified
	    if (Boolean.TRUE.equals(user.getIsVerified())) {
	        return ResponseEntity.ok(new RegisterResponseDto("You are already verified."));
	    }
	    
	    // Check if token is expired
	    if (LocalDateTime.now().isAfter(user.getVerificationTokenExpiry())) {
	        // Generate new token and expiry
	        String newToken = UUID.randomUUID().toString();
	        user.setVerificationToken(newToken);
	        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
	        
	        // Save the user with new token
	        userRepository.saveUser(user);
	        
	        // Resend verification email
	        String subject = "New Verification Email";
	        String content = "Your previous verification link expired. Please click the new link below to verify your email address:\n" +
	                frontendUrl + "/auth/verify?token=" + newToken;
	        
	        mailUtil.sendEmail(user.getEmail(), subject, content);
	        
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body(new RegisterResponseDto("Verification link expired. A new verification email has been sent."));
	    }
	    
	    // Token is valid and not expired - verify the user
	    user.setIsVerified(true);
	    user.setVerificationToken(null); // Clear the token after verification
	    user.setVerificationTokenExpiry(null);
	    userRepository.saveUser(user);
	    
	    return ResponseEntity.ok(new RegisterResponseDto("Email verified successfully!"));
	}
	
	
	
	
	
	
	

	    @PostMapping("/login")
	    //public ResponseEntity<LoginResponseDto> loginUser(@Valid @RequestBody LoginRequestDto request,BindingResult result) {
	    	public ResponseEntity<LoginResponseDto> loginUser(@Valid @RequestBody LoginRequestDto request) {
//	    	
//	        if (result.hasErrors()) {
//	            String errorMessage = result.getFieldErrors()
//	                    .stream()
//	                    .map(error -> error.getDefaultMessage())
//	                    .collect(Collectors.joining(", "));
//	            return ResponseEntity.badRequest().body(new LoginResponseDto(errorMessage));
//	        }

	        return authService.loginUser(request);
	    }
	    
	    
	    @GetMapping("/user-details")
	    public ResponseEntity<?> getUserDetails(HttpServletRequest request) {
	    	
	    	String token = getTokenFromCookie(request);
	        if (token == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token not found in cookies");
	        }
	        // Extract the email and UserType from the token
	        String email = jwtUtil.extractSubject(token).split("_")[0];
	        UserType userType = UserType.valueOf(jwtUtil.extractSubject(token).split("_")[1]);

	        // Validate the token and fetch user details from the repository
	        boolean isValid = jwtUtil.isTokenValid(token, email, userType);
	        if (isValid) {
	            // Fetch user details from the repository
	            Optional<User> userOpt = userRepository.findByUserKeyEmailAndUserType(email, userType);

	            if (userOpt.isPresent()) {
	                // Return the user details if found
	                return ResponseEntity.ok(userOpt.get());
	            } else {
	                return ResponseEntity.status(404).body("User not found");
	            }
	        } else {
	            return ResponseEntity.status(401).body("Invalid token");
	        }
	    }
	    
	    
	    
	    @PostMapping("/forgot-password")
	    public ResponseEntity<PasswordResponseDto> forgotPassword(@RequestBody ForgotPasswordRequestDto requestDto) {
	        return authService.forgotPassword(requestDto);
	    }

	    @PostMapping("/reset-password")
	    public ResponseEntity<PasswordResponseDto> resetPassword(@RequestBody ResetPasswordRequestDto requestDto) {
	        return authService.resetPassword(requestDto);
	    }
	    
	    
	    @DeleteMapping("/delete-account")
	    public ResponseEntity<RegisterResponseDto> deleteUser(Authentication authentication) {
	    	String email = authentication.getName().split("_")[0];
	        String userType =authentication.getName().split("_")[1];
	    	return authService.deleteUserAccount(email,userType);
	    }
	    
	    private String getTokenFromCookie(HttpServletRequest request) {
	        Cookie[] cookies = request.getCookies();
	        if (cookies != null) {
	            for (Cookie cookie : cookies) {
	                if ("JWT-TOKEN".equals(cookie.getName())) {
	                    return cookie.getValue(); // Extract the JWT token from the cookie
	                }
	            }
	        }
	        return null;
	    }
	    
	    
//	    
//	    @PostMapping("/logout")
//	    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
//	        // Create a cookie with the same name "JWT-TOKEN" to invalidate it
//	        Cookie cookie = new Cookie("JWT-TOKEN", null);
//	        cookie.setHttpOnly(true);
//	        cookie.setSecure(false); // Set to 'true' if using HTTPS
//	        cookie.setMaxAge(0); // Expire the cookie immediately
//	        cookie.setPath("/"); // Ensure the cookie is valid for all paths
//	        response.addCookie(cookie); // Add the invalidated cookie to the response
//
//	        // Optional: Clear Spring Security Context (if you're using Spring Security)
//	        SecurityContextHolder.clearContext();
//	        
//	        return ResponseEntity.ok(new RegisterResponseDto("You have Logged out Successfully."));
//	        
//	    }
	    
	    
	    @PostMapping("/logout")
	    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
	        // Retrieve cookies from the request
	        Cookie[] cookies = request.getCookies();
	        if (cookies != null) {
	            for (Cookie cookie : cookies) {
	                if ("TAB-ID".equals(cookie.getName())) {
	                    // Remove the JWT Token from Redis using TAB-ID as the key
	                    redisService.deleteToken(cookie.getValue());

	                    // Invalidate the TAB-ID cookie
	                    Cookie tabIdCookie = new Cookie("TAB-ID", null);
	                    tabIdCookie.setHttpOnly(false);
	                    tabIdCookie.setPath("/");
	                    tabIdCookie.setMaxAge(0); // Expire immediately
	                    response.addCookie(tabIdCookie);
	                }
	            }
	        }

	        // Invalidate the JWT Token cookie
	        Cookie jwtCookie = new Cookie("JWT-TOKEN", null);
	        jwtCookie.setHttpOnly(true);
	        jwtCookie.setPath("/");
	        jwtCookie.setMaxAge(0); // Expire immediately
	        response.addCookie(jwtCookie);

	        // Optional: Clear Spring Security Context (if using Spring Security)
	        SecurityContextHolder.clearContext();

	        return ResponseEntity.ok(new RegisterResponseDto("You have logged out successfully."));
	    }
	    
	    
}
