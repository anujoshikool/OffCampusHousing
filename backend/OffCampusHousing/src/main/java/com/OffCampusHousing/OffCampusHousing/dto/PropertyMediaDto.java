package com.OffCampusHousing.OffCampusHousing.dto;

public class PropertyMediaDto {
	
	  private String mediaType; // 'IMAGE' or 'VIDEO'
	    private String mediaUrl;

	    // Constructors, Getters, Setters
	    public PropertyMediaDto(String mediaType, String mediaUrl) {
	        this.mediaType = mediaType;
	        this.mediaUrl = mediaUrl;
	    }

	    public String getMediaType() {
	        return mediaType;
	    }

	    public void setMediaType(String mediaType) {
	        this.mediaType = mediaType;
	    }

	    public String getMediaUrl() {
	        return mediaUrl;
	    }

	    public void setMediaUrl(String mediaUrl) {
	        this.mediaUrl = mediaUrl;
	    }

}
