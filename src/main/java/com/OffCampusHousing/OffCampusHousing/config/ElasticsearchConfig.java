package com.OffCampusHousing.OffCampusHousing.config;
import org.apache.http.Header;
import org.apache.http.HttpHost;
import org.apache.http.message.BasicHeader;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;

@Configuration
public class ElasticsearchConfig extends ElasticsearchConfiguration { 

    @Value("${elasticsearch.server.url}")
    private String serverUrl;

    @Value("${elasticsearch.server.api-key}")
    private String apiKey;

     //Low-level client (as in API docs)
    @Bean
    public RestClient elasticsearchRestClient() { 
        return RestClient.builder(HttpHost.create(serverUrl))
            .setDefaultHeaders(new Header[]{
                new BasicHeader("Authorization", "ApiKey " + apiKey)
            })
            .setRequestConfigCallback(requestConfigBuilder -> 
            requestConfigBuilder
                .setConnectTimeout(5000)
                .setSocketTimeout(60000)
        )
            .build();
    } 

     
     //Elasticsearch Java Client
    @Bean
    public ElasticsearchClient elasticsearchClient() { 
        ElasticsearchTransport transport = new RestClientTransport(
            elasticsearchRestClient(),
            new JacksonJsonpMapper()
        );
        return new ElasticsearchClient(transport);
    } 

     //Spring Data Elasticsearch Operations
    @Bean
    public ElasticsearchOperations elasticsearchOperations() { 
        return new ElasticsearchTemplate(elasticsearchClient());
    } 

    // Health check endpoint
     
    @Override
    public ClientConfiguration clientConfiguration() {
        return null;
    }
}

