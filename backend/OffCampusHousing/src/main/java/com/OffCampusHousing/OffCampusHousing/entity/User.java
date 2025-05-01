package com.OffCampusHousing.OffCampusHousing.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
public class User implements UserDetails {

	private static final long serialVersionUID = 1L;

	public enum Role {
	    USER,
	    ADMIN
	}

	public enum UserType {
	    SELLER,
	    BUYER
	}
	
	@EmbeddedId
    private UserKey id;

    @Column(name = "first_name",nullable = false)
    private String firstName;

    @Column(name = "last_name",nullable = false)
    private String lastName;

    @Column(name = "gender",nullable = false)
    private String gender; // Male, Female, Other

    @Column(name = "dob",nullable = true)
    private LocalDate dob;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role",nullable = false)
    private Role role = Role.USER; // Default is USER

   

    @Column(name = "created_at",nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at",nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    
    @Column(name = "verification_token")
    private String verificationToken;  // The verification token

    @Column(name = "verification_token_expiry")
    private LocalDateTime verificationTokenExpiry;  // The expiration date and time of the token

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
    // UserDetails interface methods for security
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList(); // No specific roles assigned for now
    }

    @Override
    public String getUsername() {
        return this.id.getEmail(); // email is now part of the composite key
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

	@Override
	public String getPassword() {
		return this.password;
	}

	public String getEmail() {
        return id.getEmail();
    }

    public void setEmail(String email) {
    	if (this.id == null) {
            this.id = new UserKey();  // Ensure UserKey is initialized
        }
        this.id.setEmail(email);
    }

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public LocalDate getDob() {
		return dob;
	}

	public void setDob(LocalDate dob) {
		this.dob = dob;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public UserType getUserType() {
        return id.getUserType();
    }

    public void setUserType(UserType userType) {
        id.setUserType(userType);
    }


	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public User() {
        if (this.id == null) {
            this.id = new UserKey(); // Initialize the UserKey if it's null
        }
    }
	public Boolean getIsVerified() {
	    return isVerified;
	}

	public void setIsVerified(Boolean isVerified) {
	    this.isVerified = isVerified;
	}
}
