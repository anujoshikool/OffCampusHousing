package com.OffCampusHousing.OffCampusHousing.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.OffCampusHousing.OffCampusHousing.entity.SavedProperty;
import com.OffCampusHousing.OffCampusHousing.entity.SavedPropertyId;

public interface SavedPropertyRepository extends JpaRepository<SavedProperty, SavedPropertyId> {
	
	    // Corrected method to find by user email inside the embedded ID
	    boolean existsByIdUserEmailAndIdPropertyId(String email, UUID propertyId);

	    // Corrected method to delete by user email inside the embedded ID
	    void deleteByIdUserEmailAndIdPropertyId(String email, UUID propertyId);

	    // Corrected method to find properties by user email inside the embedded ID
	    List<SavedProperty> findByIdUserEmail(String email);
	}

