package com.OffCampusHousing.OffCampusHousing.security;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.OffCampusHousing.OffCampusHousing.entity.User;
import com.OffCampusHousing.OffCampusHousing.repository.UserRepositoryImpl;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final UserRepositoryImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;
    
    public CustomAuthenticationProvider( UserRepositoryImpl userDetailsService, PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		if (!(authentication instanceof CustomAuthenticationToken)) {
            return null;
        }
    
		CustomAuthenticationToken authToken = (CustomAuthenticationToken) authentication;
        String email = authToken.getName();
        String password = authToken.getCredentials().toString();
        com.OffCampusHousing.OffCampusHousing.entity.User.UserType userType = authToken.getUserType();  

        // Fetch user using email and ENUM userType
        User user = userDetailsService.findByUserKeyEmailAndUserType(email, userType)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        return new CustomAuthenticationToken(email, password, userType);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(CustomAuthenticationToken.class);
    }

	
}	