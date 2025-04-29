package com.OffCampusHousing.OffCampusHousing.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.OffCampusHousing.OffCampusHousing.dto.PropertyFilterDto;
import com.OffCampusHousing.OffCampusHousing.entity.PropertyDocument;
import com.fasterxml.jackson.databind.ObjectMapper;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PropertySearchService {

    private final ElasticsearchClient elasticsearchClient;
    private final ObjectMapper objectMapper;

    public PropertySearchService(ElasticsearchClient elasticsearchClient, ObjectMapper objectMapper) {
        this.elasticsearchClient = elasticsearchClient;
        this.objectMapper = objectMapper;
    }

    public Page<PropertyDocument> searchProperties(PropertyFilterDto searchRequest,
                                                   int page,
                                                   int size,
                                                   String userType,
                                                   String sellerEmail) throws IOException {

        log.info("Search request by {} ({}): {}", sellerEmail, userType, searchRequest);
        log.info("Page: {}, Size: {}", page, size);

        BoolQuery.Builder boolBuilder = new BoolQuery.Builder();
        List<Query> filters = new ArrayList<>();

        // Text search
        if (StringUtils.hasText(searchRequest.getQueryText())) {
            Query multiMatchQuery = Query.of(q -> q
                .multiMatch(m -> m
                    .query(searchRequest.getQueryText())
                    .fields("title^2", "description", "address^3")
                    .fuzziness("AUTO")
                )
            );
            boolBuilder.should(multiMatchQuery).minimumShouldMatch("1");
        }

        // Price filter
        if (searchRequest.getMinPrice() != null || searchRequest.getMaxPrice() != null) {
            filters.add(Query.of(q -> q.range(r -> r
                .field("price_total_unit")
                .gte(searchRequest.getMinPrice() != null ? JsonData.of(searchRequest.getMinPrice()) : null)
                .lte(searchRequest.getMaxPrice() != null ? JsonData.of(searchRequest.getMaxPrice()) : null)
            )));
        }

        // Location filters
        addTermFilter(filters, "listing_type.keyword", searchRequest.getListingType());
        addTermFilter(filters, "city.keyword", searchRequest.getCity());
        addTermFilter(filters, "state.keyword", searchRequest.getState());
        addTermFilter(filters, "country.keyword", searchRequest.getCountry());
        addTermFilter(filters, "pincode.keyword", searchRequest.getPincode());

        // Numeric range filters
        addRangeFilter(filters, "bedrooms", searchRequest.getMinBedrooms(), searchRequest.getMaxBedrooms());
        addRangeFilter(filters, "bathrooms", searchRequest.getMinBathrooms(), searchRequest.getMaxBathrooms());
        addRangeFilter(filters, "people_present", searchRequest.getMinPeoplePresent(), searchRequest.getMaxPeoplePresent());

        // Other filters
        addTermFilter(filters, "accomodation_type.keyword", searchRequest.getAccommodationType());
        addTermFilter(filters, "preferred_gender.keyword", searchRequest.getPreferredGender());
        addTermFilter(filters, "nearest_university.keyword", searchRequest.getNearestUniversity());
        addTermFilter(filters, "dietary_preference.keyword", searchRequest.getDietaryPreference());
        addTermFilter(filters, "status.keyword", searchRequest.getStatus());

        // Date filters
        if (searchRequest.getAvailableFrom() != null) {
            filters.add(Query.of(q -> q.range(r -> r
                .field("available_from")
                .gte(JsonData.of(searchRequest.getAvailableFrom().getTime()))
            )));
        }

        if (searchRequest.getEndOfLease() != null) {
            filters.add(Query.of(q -> q.range(r -> r
                .field("end_of_lease")
                .lte(JsonData.of(searchRequest.getEndOfLease().getTime()))
            )));
        }

//        // Seller-specific filter
//        if ("SELLER".equalsIgnoreCase(userType)) {
//            filters.add(Query.of(q -> q.term(t -> t
//                .field("seller_email")
//                .value(sellerEmail)
//            )));
//        }
        
        if ("SELLER".equalsIgnoreCase(userType)) {
        	addTermFilter(filters,"seller_email.keyword",sellerEmail);
        }
        

        // Combine filters
        if (!filters.isEmpty()) {
            boolBuilder.filter(filters);
        }

        BoolQuery finalQuery = boolBuilder.build();

        log.debug("Final query: {}", finalQuery);
        
        System.out.println("Final Query: " + 
        	    JsonData.of(new co.elastic.clients.elasticsearch.core.SearchRequest.Builder()
        	        .index("offcampus-search")
        	        .query(q -> q.bool(finalQuery))
        	        .build()
        	    ).toString()
        	);

        // Execute search with error handling
        SearchResponse<PropertyDocument> response;
        try {
            response = elasticsearchClient.search(s -> s
                    .index("offcampus-search")
                    .from(page * size)
                    .size(size)
                    .query(q -> q.bool(finalQuery))
                    .trackTotalHits(t -> t.enabled(true)),
                PropertyDocument.class
            );
        } catch (Exception e) {
            log.error("Elasticsearch query failed", e);
            throw new IOException("Search execution failed", e);
        }
        System.out.println("Response :"+response);

        // Process results with deserialization safety
        List<PropertyDocument> results = response.hits().hits().stream()
            .map(hit -> {
                try {
                    return objectMapper.readValue(
                        objectMapper.writeValueAsString(hit.source()),
                        PropertyDocument.class
                    );
                } catch (Exception e) {
                    log.error("Failed to deserialize document: {}", hit.source(), e);
                    return null;
                }
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());

        long totalHits = response.hits().total() != null ?
            response.hits().total().value() : 0;

        return new PageImpl<>(results, PageRequest.of(page, size), totalHits);
    }

    private void addTermFilter(List<Query> filters, String field, String value) {
        if (StringUtils.hasText(value)) {
            filters.add(Query.of(q -> q.term(t -> t
                .field(field)
                .value(value)
            )));
        }
    }

    private void addRangeFilter(List<Query> filters, String field, Integer min, Integer max) {
        if (min != null || max != null) {
            filters.add(Query.of(q -> q.range(r -> r
                .field(field)
                .gte(min != null ? JsonData.of(min) : null)
                .lte(max != null ? JsonData.of(max) : null)
            )));
        }
    }
}
