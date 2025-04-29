package com.OffCampusHousing.OffCampusHousing.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import jakarta.annotation.PostConstruct;

@Service
public class StripeService {

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public String createCheckoutSession(String email) throws StripeException {
        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
            .setSuccessUrl("https://offcampus-frontend.vercel.app/success")
            .setCancelUrl("https://offcampus-frontend.vercel.app/cancel")
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setPrice("price_1RGWelH8x6jydMcNqPsiUuUB") // Your Stripe price ID
                    .setQuantity(1L)
                    .build()
            )
            .setCustomerEmail(email)
            .build();

        Session session = Session.create(params);
        return session.getId();
    }
}