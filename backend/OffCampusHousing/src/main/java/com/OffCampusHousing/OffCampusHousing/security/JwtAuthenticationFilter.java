package com.OffCampusHousing.OffCampusHousing.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.OffCampusHousing.OffCampusHousing.controller.AuthController;
import com.OffCampusHousing.OffCampusHousing.entity.User;
import com.OffCampusHousing.OffCampusHousing.entity.User.UserType;
import com.OffCampusHousing.OffCampusHousing.repository.UserRepositoryImpl;
import com.OffCampusHousing.OffCampusHousing.service.RedisService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtUtil jwtUtil; // Utility class for JWT handling
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private UserRepositoryImpl userRepository;
	private RedisService redisService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepositoryImpl userRepository,RedisService redisService) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.redisService = redisService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Extract the token from the Authorization header
        //String token = getTokenFromRequest(request);
        
    	String tabId = getTabIdFromCookie(request);
    	
    	
        // Extract the token from the HttpOnly cookie
       // String token = getTokenFromCookie(request);
    	if (tabId != null) {
            String token = redisService.getToken(tabId);
        if (token != null && !jwtUtil.isTokenExpired(token)) {
        	
            try {
                // Extract subject (email_userType) from the token
                String subject = jwtUtil.extractSubject(token);
                //System.out.println("SUBJECT :"+subject);
                String[] subjectParts = subject.split("_");  // Split into email and userType

                if (subjectParts.length == 2) {
                    String email = subjectParts[0];
                    UserType userType;

                    // Safely parse userType from the subject part
                    try {
                        userType = UserType.valueOf(subjectParts[1]); // Convert string to enum
                    } catch (IllegalArgumentException e) {
                        userType = null;  // Handle invalid userType
                    }

                    // If userType is valid and token is valid (not expired)
                    if (userType != null && jwtUtil.isTokenValid(token, email, userType)) {
                        // Extract the claims from the JWT
                        Claims claims = jwtUtil.extractAllClaims(token);
                    	
                        email = claims.getSubject().split("_")[0];  // Extract email
                        userType = UserType.valueOf((String) claims.get("userType"));

                        // Validate if the email and userType exist in the database
                        if (isUserValid(email, userType)) {
                            // Create the authentication object directly without needing CustomUserDetails
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    email + "_" + userType, null, null); // Authentication with email and userType

                            logger.info("SecurityContextHolder before: " + SecurityContextHolder.getContext().getAuthentication());
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            logger.info("SecurityContextHolder after: " + SecurityContextHolder.getContext().getAuthentication());
                        }
                    }
                }

            }
            catch (JwtException e) {
                // Handle JWT exception (invalid token, expired token, etc.)
                sendErrorResponse(response, e.getMessage(), HttpServletResponse.SC_FORBIDDEN);
                return; // Prevent further processing if there's an error
            }
        }
    	}

        // Proceed with the filter chain
        filterChain.doFilter(request, response);
    }

    // Extract the token from the Authorization header
    private String getTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7); // Extract the token part
        }
        return null;
    }
    
    public String getTabIdFromCookie(HttpServletRequest request) {
        // Iterate over all cookies to find the TAB-ID cookie
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("TAB-ID".equals(cookie.getName())) {
                    return cookie.getValue(); // Return the Tab ID if found
                }
            }
        }
        return null; // Return null if no TAB-ID cookie is found
    }

    
    
    // Extract the token from the HttpOnly cookie
    public String getTokenFromCookie(HttpServletRequest request) {
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
    
    

    // Validate if the email and userType exist in the database
    private boolean isUserValid(String email, User.UserType userType) {
        return userRepository.existsByEmailAndUserType(email, userType); // Query the database
    }
    
    private void sendErrorResponse(HttpServletResponse response, String message, int statusCode) throws IOException {
        response.setStatus(statusCode); // Set the response status code
        response.setContentType("application/json");

        String jsonResponse = String.format("{\"message\": \"%s\"}", message);  // Format response as JSON
        response.getWriter().write(jsonResponse);  // Send response to the client
    }
    
}
