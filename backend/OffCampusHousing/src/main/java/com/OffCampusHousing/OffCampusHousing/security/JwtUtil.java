package com.OffCampusHousing.OffCampusHousing.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.OffCampusHousing.OffCampusHousing.entity.User;
import com.OffCampusHousing.OffCampusHousing.entity.User.UserType;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

@Component
public class JwtUtil {
	
	private static final String SECRET_KEY = "1F9DEC2042D8074517C0109DF26CDC3AD6C190F8FE2F5FDD601D7C60D1F5E0BC";
	private static final long EXPIRATION_TIME = 86400000; // 1 day
	 
	
	 private static SecretKey getSigningKey() {
		 byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
	        return Keys.hmacShaKeyFor(keyBytes);
	    }

	    public String generateToken(String email, String role, User.UserType userType) {
	        Map<String, Object> claims = new HashMap<>();
	        claims.put("role", role);
	        claims.put("userType", userType);
	        
	        String uniqueIdentifier = email + "_" + userType;

	        return Jwts.builder()
	                .claims(claims)
	                .subject(uniqueIdentifier)
	                .issuedAt(new Date())
	                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
	                .signWith(getSigningKey())
	                .compact();
	    }
	    
	   
	    public String extractSubject(String token) {
	        return extractClaim(token, Claims::getSubject);  // Extract the subject (email_userType)
	    }

	    // Generic method to extract a claim from the token using a given claimsResolver
	    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
	        Claims claims = extractAllClaims(token);  // Extract all claims from the token
	        return claimsResolver.apply(claims);  // Apply the claimsResolver function to the claims
	    }

	    // Extract all claims from the JWT token
	    public Claims extractAllClaims(String token) {
	        
	        try {
	        	 if (token.startsWith("Bearer ")) {
	                 token = token.substring(7).trim(); // Remove "Bearer " and trim whitespace
	             }
	             System.out.println("Token After Removing Bearer: " + token);
	             
	            return Jwts.parser()
		        		.verifyWith(getSigningKey())
		        		.build()
		        		.parseSignedClaims(token)
		        		.getPayload();
	         
	        } catch (SignatureException e) {
	            throw new JwtException("Invalid token signature. Please log in again.", e);
	        } catch (ExpiredJwtException e) {
	            throw new JwtException("Token has expired. Please log in again.", e);
	        } catch (JwtException e) {
	            throw new JwtException("Invalid token. Please log in again.", e);
	        } catch (Exception e) {
	            throw new JwtException("Error while parsing JWT token.", e);
	        }
	    }
	    
	    
	    // Method to validate the token based on email and userType
	    public boolean isTokenValid(String token, String email, UserType userType) {
	        String[] subjectParts = extractSubjectParts(token);  // Extract and split subject into email and userType
	        System.out.println("Received JWT Token: " + token);
	        if (subjectParts.length == 2) {
	            String extractedEmail = subjectParts[0];
	            UserType extractedUserType = UserType.valueOf(subjectParts[1]);

	            // Check if email and userType match and token is not expired
	            return extractedEmail.equals(email) && extractedUserType.equals(userType) && !isTokenExpired(token);
	        }
	        return false;  // Return false if the subject is malformed
	    }

	    // Method to extract the subject (email and userType) and split it into parts
	    private String[] extractSubjectParts(String token) {
	        String subject = extractClaim(token, Claims::getSubject);  // Extract subject (email_userType)
	        return subject.split("_");  // Split the subject into email and userType
	    }

	    // Method to check if the token has expired
	    public boolean isTokenExpired(String token) {
	        return extractClaim(token, Claims::getExpiration).before(new Date());  // Check if the token expiration date is before current time
	    }
	    
	    
	    
	    
	}
