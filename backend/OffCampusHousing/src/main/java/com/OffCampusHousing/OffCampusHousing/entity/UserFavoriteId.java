package com.OffCampusHousing.OffCampusHousing.entity;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFavoriteId implements Serializable {
    private static final long serialVersionUID = 1L;
    @Column(name = "user_email")
	private String userEmail;
    
    @Column(name = "property_id")
    private UUID propertyId;
}