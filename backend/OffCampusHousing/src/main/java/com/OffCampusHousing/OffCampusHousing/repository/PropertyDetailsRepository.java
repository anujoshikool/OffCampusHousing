package com.OffCampusHousing.OffCampusHousing.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.OffCampusHousing.OffCampusHousing.entity.PropertyDetails;

@Repository
public interface PropertyDetailsRepository extends JpaRepository<PropertyDetails, UUID> {

	 List<PropertyDetails> findAllByPropertyIdIn(List<UUID> propertyIds);

	boolean existsBySellerEmailAndAddressAndCityAndStateAndPincode(String sellerEmail, String address, String city,
			String state, String pincode);
	
	List<PropertyDetails> findBySellerEmailAndUserType(String sellerEmail, String userType);

	boolean existsBySellerEmailAndUserTypeAndPropertyId(String email, String userType, UUID propertyId);

	@Query("SELECT p.sellerEmail FROM PropertyDetails p WHERE p.propertyId = :propertyId")
	String findSellerEmailByPropertyId(UUID propertyId);

	@Query("SELECT p.address FROM PropertyDetails p WHERE p.propertyId = :propertyId")
	String findAddressByPropertyId(UUID propertyId);
	
	 @Query(value = "SELECT p.address FROM property_details p " +
             "WHERE seller_email = :email " +
             "ORDER BY ctid DESC LIMIT 1", 
      nativeQuery = true)
String findLatestAddressByEmailUsingCtid(String email);


}
