
package com.OffCampusHousing.OffCampusHousing.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.OffCampusHousing.OffCampusHousing.entity.PropertyDocument;

@Repository
public interface PropertyDocumentRepository extends ElasticsearchRepository<PropertyDocument, String> {

	
}