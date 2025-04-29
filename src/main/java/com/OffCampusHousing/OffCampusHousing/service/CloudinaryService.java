package com.OffCampusHousing.OffCampusHousing.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.OffCampusHousing.OffCampusHousing.entity.PropertyDetails;
import com.OffCampusHousing.OffCampusHousing.entity.PropertyMedia;
import com.OffCampusHousing.OffCampusHousing.repository.PropertyMediaRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {
	
	@Autowired
    private Cloudinary cloudinary;
	@Autowired
	private PropertyMediaRepository mediaRepository;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
    	String resourceType = file.getContentType().startsWith("image") ? "image" : "video";
    	 try {
             Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                     ObjectUtils.asMap("folder", folder, "resource_type", resourceType));
             System.out.println("Cloudinary Upload Result "+uploadResult);
             return uploadResult.get("secure_url").toString();
         } catch (IOException e) {
             throw new RuntimeException("Error reading file", e);
         } catch (Exception e) {
        	 e.printStackTrace();
             throw new RuntimeException("Error uploading file to Cloudinary", e);
         }
    }
    
    private void deleteMediaFromCloudinary(String mediaUrl) {
        try {
            String publicId = extractPublicIdFromUrl(mediaUrl);  // Extract the publicId from the URL
            System.out.println("Deleting from Cloudinary: " + publicId);
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("invalidate", true));
        } catch (IOException e) {
            throw new RuntimeException("Error deleting media from Cloudinary", e);
        }
    }
    
    // Method to delete all files in a specific folder (using prefix)
    public void deleteFolderFromCloudinary(String folderName) throws Exception {
        try {
            // Use the 'deleteResourcesByPrefix' API call to delete all files in the folder
            cloudinary.api().deleteResourcesByPrefix(folderName, ObjectUtils.emptyMap());
        	cloudinary.api().deleteFolder(folderName, ObjectUtils.emptyMap());
            System.out.println("All resources in folder " + folderName + " have been deleted.");
        } catch (IOException e) {
            throw new RuntimeException("Error deleting folder from Cloudinary", e);
        }
    }
    
    

    
    public ResponseEntity<?> handleCloudinaryMedia(PropertyDetails property, 
            List<String> imagesToDelete, 
            List<MultipartFile> imagesToUpload) {
		UUID propertyId = property.getPropertyId();  // Get the property ID
		
		// Handle deletion of images
		if (imagesToDelete != null && !imagesToDelete.isEmpty() ) {
			System.out.println("Images to delete: " + imagesToDelete);
		// Prevent deletion of all images (ensure at least one image remains)
		List<PropertyMedia> propertyMediaList = mediaRepository.findByProperty_PropertyId(propertyId);
		if (propertyMediaList.size() - imagesToDelete.size() < 1 && imagesToUpload.isEmpty()) {
		return ResponseEntity.badRequest().body("At least one image must remain for the property.");
		}
		
		
		  // Track failed deletions
        List<String> failedDeletions = new ArrayList<>();

        for (String imageUrl : imagesToDelete) {
            try {
                deleteMediaFromCloudinary(imageUrl);  // Delete from Cloudinary
                int deletedRows = mediaRepository.deleteByMediaUrl(imageUrl);  // Delete from DB

                if (deletedRows == 0) {
                    System.out.println("Warning: No matching media record found for URL: " + imageUrl);
                } else {
                    System.out.println("Deleted: " + imageUrl);
                }
            } catch (Exception e) {
                failedDeletions.add(imageUrl);
                System.err.println("Error deleting image: " + imageUrl + " - " + e.getMessage());
            }
        }

        if (!failedDeletions.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to delete the following images: " + failedDeletions);
        }
    }
		
		
		// Handle uploading of new images
		if (imagesToUpload != null && !imagesToUpload.isEmpty()) {
		List<PropertyMedia> mediaList = new ArrayList<>();
		
		for (MultipartFile file : imagesToUpload) {
		String fileType = file.getContentType();
		String folderType = (fileType != null && fileType.startsWith("image")) ? "image" : "video";
		String cloudinaryFolder = propertyId + "/" + folderType;
		
		try {
		// Upload to Cloudinary
		String cloudinaryUrl = uploadFile(file, cloudinaryFolder);  // Upload using CloudinaryService
		System.out.println("Cloudinary URL: " + cloudinaryUrl);
		
		// Save Media Info in Database
		PropertyMedia media = new PropertyMedia();
		media.setProperty(property);
		media.setMediaType(folderType);  // 'IMAGE' or 'VIDEO'
		media.setMediaUrl(cloudinaryUrl);  // URL returned from CloudinaryService
		media.setUploadedAt(new Date());
		mediaList.add(media);
		} catch (IOException e) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		.body("File upload failed: " + file.getOriginalFilename());
		}
		}
		
		// Save all media records in batch
		mediaRepository.saveAll(mediaList);
		}

			return ResponseEntity.ok("Media handling completed successfully.");
}

    

    // Helper method to extract the publicId from the URL (for Cloudinary deletion)
    private String extractPublicIdFromUrl(String url) {
    	 String[] parts = url.split("/upload/");
    	    
    	    if (parts.length < 2) {
    	        throw new IllegalArgumentException("Invalid Cloudinary URL format");
    	    }
    	    
    	    // The public ID is everything after "/upload/"
    	    String publicIdWithExtension = parts[1];
    	    
    	    // Remove the file extension
    	    int dotIndex = publicIdWithExtension.lastIndexOf('.');
    	    if (dotIndex != -1) {
    	        return publicIdWithExtension.substring(0, dotIndex);
    	    }
    	    
    	    return publicIdWithExtension;
    }

}
