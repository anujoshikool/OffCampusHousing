package com.OffCampusHousing.OffCampusHousing.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.OffCampusHousing.OffCampusHousing.entity.UserFavorite;
import com.OffCampusHousing.OffCampusHousing.entity.UserFavoriteId;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, UserFavoriteId> {
    
    boolean existsByIdUserEmailAndIdPropertyId(String userEmail, UUID propertyId);
    
    void deleteByIdUserEmailAndIdPropertyId(String userEmail, UUID propertyId);
    
    List<UserFavorite> findByIdUserEmail(String userEmail);
}

