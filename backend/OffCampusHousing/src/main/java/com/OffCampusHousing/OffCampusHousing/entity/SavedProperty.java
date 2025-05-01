package com.OffCampusHousing.OffCampusHousing.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_saved_properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SavedProperty {
    @EmbeddedId
    private SavedPropertyId id;
    
    @Column(name = "saved_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime savedAt;
}