package com.OffCampusHousing.OffCampusHousing.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.OffCampusHousing.OffCampusHousing.entity.UserSubscription;

public interface SubscriptionRepository 
    extends CrudRepository<UserSubscription, String> {  // String = primary key type (userEmail)

    // Find by user email
    Optional<UserSubscription> findByUserEmail(String email);

    // Find by Stripe subscription ID
    Optional<UserSubscription> findByStripeSubscriptionId(String subscriptionId);

    // Delete by Stripe ID (for cancellations)
    void deleteByStripeSubscriptionId(String subscriptionId);
}