package com.OffCampusHousing.OffCampusHousing.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "user_subscriptions")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSubscription {

    @Id
    private String userEmail;  // Primary key (seller's email)

    @Column(nullable = false)
    private String status;     // "active", "canceled", "past_due"

    private String stripeSubscriptionId;  // Stripe's subscription ID (e.g., "sub_123")

    @Column(name = "current_period_end")
    private LocalDateTime currentPeriodEnd;  // When subscription renews

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    // Constructors, getters, setters
    

    public UserSubscription(String userEmail, String status, 
                          String stripeSubscriptionId, 
                          LocalDateTime currentPeriodEnd) {
        this.userEmail = userEmail;
        this.status = status;
        this.stripeSubscriptionId = stripeSubscriptionId;
        this.currentPeriodEnd = currentPeriodEnd;
    }

    // Helper method to check active status
    public boolean isActive() {
        return "active".equals(status) && 
               currentPeriodEnd.isAfter(LocalDateTime.now());
    }
}