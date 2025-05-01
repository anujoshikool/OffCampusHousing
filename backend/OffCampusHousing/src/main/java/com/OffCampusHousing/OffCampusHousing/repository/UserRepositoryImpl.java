package com.OffCampusHousing.OffCampusHousing.repository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.OffCampusHousing.OffCampusHousing.entity.User;
import com.OffCampusHousing.OffCampusHousing.entity.User.UserType;


@Repository
public class UserRepositoryImpl {
		
	   private final RepositoryLayer userRepository;

	    @Autowired
	    public UserRepositoryImpl(RepositoryLayer userRepository) {
	        this.userRepository = userRepository;
	    }

	    public Optional<User> findByUserKeyIdEmail(String email) {
	        return userRepository.findById_Email(email);  // Use the updated method
	    }
	    public Optional<User> findByUserKeyEmailAndUserType(String email, UserType userType){
	    	return userRepository.findById_EmailAndId_UserType( email,  userType);
	    }
	    
	    public boolean existsByEmailAndUserType(String email, UserType userType){
	    	return userRepository.existsById_EmailAndId_UserType(email,userType);
	    }
	    
	  public boolean existsByEmailAndUserTypeAndIsVerified(String email, User.UserType userType, Boolean isVerified) {
		  return userRepository.existsById_EmailAndId_UserTypeAndIsVerified(email,userType,isVerified);
	  }

    public void saveUser(User user) {
        userRepository.save(user);
    }
    
	public Optional<User> findByVerificationToken(String token) {
		
		return userRepository.findByVerificationToken(token);
	}

	 public void deleteUser(User user) {
	        userRepository.delete(user);  // This is defined in JpaRepository
	    }
	

	
	
}
