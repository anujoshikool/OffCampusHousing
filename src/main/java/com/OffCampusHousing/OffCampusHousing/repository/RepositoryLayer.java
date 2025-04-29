package com.OffCampusHousing.OffCampusHousing.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.OffCampusHousing.OffCampusHousing.entity.User;


public interface RepositoryLayer extends JpaRepository<User, Long> {
	
	 Optional<User> findById_Email(String email); 
	Optional<User> findById_EmailAndId_UserType(String email, User.UserType userType);
	boolean existsById_EmailAndId_UserType(String email, User.UserType userType);
	Optional<User> findByVerificationToken(String token);
    boolean existsById_EmailAndId_UserTypeAndIsVerified(String email, User.UserType userType, Boolean isVerified);

	
}
	


