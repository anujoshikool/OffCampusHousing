package com.OffCampusHousing.OffCampusHousing.entity;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "property_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PropertyMedia {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)  // This works well for UUIDs as Hibernate supports it natively
    @Column(name = "media_id", nullable = false, updatable = false)
    private UUID mediaId; // Automatically generates media_id UUID

    // Defining the foreign key relationship with PropertyDetails
    @ManyToOne
    @JoinColumn(name = "property_id", referencedColumnName = "property_id", nullable = false)
    private PropertyDetails property; // Many-to-one relationship with PropertyDetails

    @Column(name = "media_type", nullable = false)
    private String mediaType; // 'IMAGE' or 'VIDEO'

    @Column(name = "media_url", nullable = false)
    private String mediaUrl;

    @Column(name = "media_role", nullable = false)
    private String mediaRole = "REGULAR"; 
    
    // Using @Temporal to store the timestamp for when the media was uploaded
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "uploaded_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date uploadedAt = new Date(); // Sets the default value to the current timestamp
}
