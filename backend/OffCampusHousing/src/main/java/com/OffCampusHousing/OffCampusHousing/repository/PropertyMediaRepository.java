package com.OffCampusHousing.OffCampusHousing.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.OffCampusHousing.OffCampusHousing.entity.PropertyMedia;

@Repository
public interface PropertyMediaRepository extends JpaRepository<PropertyMedia, UUID>{
	
	
	List<PropertyMedia> findByProperty_PropertyId(UUID propertyId);
	int deleteByMediaUrl(String mediaUrl);
	 @Query("SELECT pm.mediaUrl FROM PropertyMedia pm WHERE pm.property.propertyId = ?1 ORDER BY pm.id ASC LIMIT 1")
	    Optional<String> findFirstMediaUrlByPropertyId(UUID propertyId);
	    

}
