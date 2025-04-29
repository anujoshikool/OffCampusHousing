package com.OffCampusHousing.OffCampusHousing.entity;

import java.io.Serializable;

import com.OffCampusHousing.OffCampusHousing.entity.User.UserType;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
@Embeddable
public class UserKey implements Serializable {

	private static final long serialVersionUID = 1L;

	
    private String email;
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type",nullable = false)
    private UserType userType;

    // Default constructor
    public UserKey() {
    	
    }

    // Constructor with parameters
    public UserKey(String email, UserType userType) {
        this.email = email;
        this.userType = userType;
    }

    // Getters and Setters
    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    // Override equals() and hashCode() for composite key comparison
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserKey userKey = (UserKey) o;

        if (!email.equals(userKey.email)) return false;
        return userType == userKey.userType;
    }

    @Override
    public int hashCode() {
        int result = email.hashCode();
        result = 31 * result + userType.hashCode();
        return result;
    }
}
