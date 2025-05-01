package com.OffCampusHousing.OffCampusHousing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFeedbackRequest {
    private String name;
    private String email;
    private Integer rating;
    private String feedbackType;
    private String feedback;
}