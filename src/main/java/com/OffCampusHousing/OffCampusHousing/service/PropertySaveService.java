package com.OffCampusHousing.OffCampusHousing.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.OffCampusHousing.OffCampusHousing.entity.SavedProperty;
import com.OffCampusHousing.OffCampusHousing.entity.SavedPropertyId;
import com.OffCampusHousing.OffCampusHousing.entity.UserFavorite;
import com.OffCampusHousing.OffCampusHousing.entity.UserFavoriteId;
import com.OffCampusHousing.OffCampusHousing.repository.SavedPropertyRepository;
import com.OffCampusHousing.OffCampusHousing.repository.UserFavoriteRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import redis.clients.jedis.Jedis;

@Service
@RequiredArgsConstructor
public class PropertySaveService {
    private final UserFavoriteRepository favoriteRepo;
    private final SavedPropertyRepository savedRepo;
    private final RedisService redisService; // Changed to RedisService
    private final BuyerPropertyService propertyService;

    // Favorites
    public boolean toggleFavorite(String userEmail, UUID propertyId) {
    	
    	
    	 if (!redisService.allowAction("rate:fav:" + userEmail, 10, 60)) {
             return false; // Silently reject
         }
    	
    	
        String redisKey = "user:" + userEmail + ":favorites";
        String propertyIdStr = propertyId.toString();
        
        try (Jedis jedis = redisService.getJedisResource()) {
            if (jedis.sismember(redisKey, propertyIdStr)) {
                // Remove favorite
                jedis.srem(redisKey, propertyIdStr);
                favoriteRepo.deleteByIdUserEmailAndIdPropertyId(userEmail, propertyId);
                return false;
            } else {
                // Add favorite
                jedis.sadd(redisKey, propertyIdStr);
                favoriteRepo.save(new UserFavorite(
                    new UserFavoriteId(userEmail, propertyId),
                    LocalDateTime.now()
                ));
                return true;
            }
        }
    }

    // Saved Properties
    public boolean toggleSavedProperty(String userEmail, UUID propertyId) {
    	
    	 if (!redisService.allowAction("rate:save:" + userEmail, 10, 60)) {
             return false; // Silently reject
         }
    	
    	
        String redisKey = "user:" + userEmail + ":saved";
        String propertyIdStr = propertyId.toString();
        
        try (Jedis jedis = redisService.getJedisResource()) {
            if (jedis.sismember(redisKey, propertyIdStr)) {
                jedis.srem(redisKey, propertyIdStr);
                savedRepo.deleteByIdUserEmailAndIdPropertyId(userEmail, propertyId);
                return false;
            } else {
                jedis.sadd(redisKey, propertyIdStr);
                savedRepo.save(new SavedProperty(
                    new SavedPropertyId(userEmail, propertyId),
                    LocalDateTime.now()
                ));
                return true;
            }
        }
    }

    // Get all favorites with details
    public List<?> getFavorites(String userEmail,HttpServletRequest request) {
    	
        String redisKey = "user:" + userEmail + ":favorites";
        
        try (Jedis jedis = redisService.getJedisResource()) {
            Set<String> propertyIds = jedis.smembers(redisKey);
            System.out.println(propertyIds+"property");
            return propertyIds.stream()
                    .map(UUID::fromString)
                    .collect(Collectors.toList());
            
//            return propertyIds.stream()
//                .map(id -> propertyService.getPropertyDetailsWithPropertyId(UUID.fromString(id), request))
//                .collect(Collectors.toList());
        }
    }

    // Get all saved properties with details
    public List<?> getSavedProperties(String userEmail,HttpServletRequest request) {
        String redisKey = "user:" + userEmail + ":saved";
        
        try (Jedis jedis = redisService.getJedisResource()) {
            Set<String> propertyIds = jedis.smembers(redisKey);
            return propertyIds.stream()
                    .map(UUID::fromString)
                    .collect(Collectors.toList());
            
//            return propertyIds.stream()
//                .map(id -> propertyService.getPropertyDetailsWithPropertyId(UUID.fromString(id), request))
//                .collect(Collectors.toList());
        }
    }
}
