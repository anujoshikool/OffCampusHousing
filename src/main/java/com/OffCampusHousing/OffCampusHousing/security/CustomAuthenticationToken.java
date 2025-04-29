package com.OffCampusHousing.OffCampusHousing.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {
    private static final long serialVersionUID = 1L;
	private final com.OffCampusHousing.OffCampusHousing.entity.User.UserType userType;

    public CustomAuthenticationToken(String email, String password, com.OffCampusHousing.OffCampusHousing.entity.User.UserType userType) {
        super(email, password);
        this.userType = userType;
    }

    public com.OffCampusHousing.OffCampusHousing.entity.User.UserType getUserType() {
        return userType;
    }
}
