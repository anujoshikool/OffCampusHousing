package com.OffCampusHousing.OffCampusHousing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@SpringBootApplication
public class OffCampusHousingApplication {

	public static void main(String[] args) {
		try {
		    Class.forName("org.postgresql.Driver");
		    System.out.println("Found Me");
		    //on classpath
		} catch(ClassNotFoundException e) {
		    // breaks here -> not on classpath
		    System.out.println("Not");
		}
		SpringApplication.run(OffCampusHousingApplication.class, args);
	}

}
