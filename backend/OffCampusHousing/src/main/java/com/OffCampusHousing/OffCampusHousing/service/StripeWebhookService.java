package com.OffCampusHousing.OffCampusHousing.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.OffCampusHousing.OffCampusHousing.entity.UserSubscription;
import com.OffCampusHousing.OffCampusHousing.repository.SubscriptionRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.Invoice;
import com.stripe.model.InvoiceLineItem;
import com.stripe.net.Webhook;


@Service
public class StripeWebhookService {

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public ResponseEntity<?> processWebhook(String payload, String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            if ("invoice.paid".equals(event.getType())) {
                handleInvoicePaid(event);
            }
            return ResponseEntity.ok(createResponse("Webhook processed"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse(e.getMessage()));
        }
    }

 

    private void handleInvoicePaid(Event event) throws StripeException {
        try {
            // Get the invoice object
            Invoice invoice = (Invoice) event.getDataObjectDeserializer().getObject().orElseThrow(
                () -> new StripeException("Failed to deserialize invoice", null, null, null) {}
            );

            System.out.println("DEBUG - Invoice JSON: " + invoice.toJson());

            // Get subscription ID - check both possible locations
            String subscriptionId = null;
            if (invoice.getParent() != null && invoice.getParent().getSubscriptionDetails() != null) {
                subscriptionId = invoice.getParent().getSubscriptionDetails().getSubscription();
            } else {
                for (InvoiceLineItem item : invoice.getLines().getData()) {
                    if (item.getParent() != null && item.getParent().getSubscriptionItemDetails() != null) {
                        subscriptionId = item.getParent().getSubscriptionItemDetails().getSubscription();
                        break;
                    }
                }
            }

            if (subscriptionId == null) {
                throw new StripeException("No subscription ID found in invoice", null, null, null) {};
            }

            // Get customer email
            String customerEmail = invoice.getCustomerEmail();
            if (customerEmail == null || customerEmail.isEmpty()) {
                throw new StripeException("No customer email found in invoice", null, null, null) {};
            }

            // Create/update subscription
            UserSubscription subscription = new UserSubscription(
                customerEmail,
                "active",
                subscriptionId,
                Instant.now().plus(30, ChronoUnit.DAYS)  // 30 days from now in UTC
                .atZone(ZoneId.systemDefault())      // Convert to system timezone
                .toLocalDateTime()
            );
            
            // Save to database
            subscriptionRepository.save(subscription);

        } catch (StripeException e) {
            throw e;
        } catch (Exception e) {
            throw new StripeException("Error processing invoice: " + e.getMessage(), null, null, null) {};
        }
    }
    
    private Map<String, String> createResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }
}