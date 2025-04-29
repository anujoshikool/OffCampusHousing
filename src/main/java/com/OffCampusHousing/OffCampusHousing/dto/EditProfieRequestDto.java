package com.OffCampusHousing.OffCampusHousing.dto;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditProfieRequestDto {


	    private String firstName;  // optional
	    private String lastName;   // optional
	    private String gender;     
	    @DateTimeFormat(pattern = "yyyy-MM-dd")
	    private LocalDate dob;     // optional
}
