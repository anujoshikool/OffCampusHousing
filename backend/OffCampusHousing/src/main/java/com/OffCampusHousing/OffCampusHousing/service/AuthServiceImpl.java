package com.OffCampusHousing.OffCampusHousing.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.OffCampusHousing.OffCampusHousing.config.MailUtil;
import com.OffCampusHousing.OffCampusHousing.dto.ForgotPasswordRequestDto;
import com.OffCampusHousing.OffCampusHousing.dto.LoginRequestDto;
import com.OffCampusHousing.OffCampusHousing.dto.LoginResponseDto;
import com.OffCampusHousing.OffCampusHousing.dto.PasswordResponseDto;
import com.OffCampusHousing.OffCampusHousing.dto.RegisterRequestDto;
import com.OffCampusHousing.OffCampusHousing.dto.RegisterResponseDto;
import com.OffCampusHousing.OffCampusHousing.dto.ResetPasswordRequestDto;
import com.OffCampusHousing.OffCampusHousing.entity.PropertyDetails;
import com.OffCampusHousing.OffCampusHousing.entity.User;
import com.OffCampusHousing.OffCampusHousing.entity.User.UserType;
import com.OffCampusHousing.OffCampusHousing.repository.PropertyDetailsRepository;
import com.OffCampusHousing.OffCampusHousing.repository.PropertyMediaRepository;
import com.OffCampusHousing.OffCampusHousing.repository.UserRepositoryImpl;
import com.OffCampusHousing.OffCampusHousing.security.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements ServiceLayer {

	@Autowired
	private UserRepositoryImpl userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private MailUtil mailUtil;

	private final PropertyDetailsRepository propertyRepository;
	private final PropertyMediaRepository mediaRepository;

	private final CloudinaryService cloudinaryService;
	@Autowired
	private final RedisService redisService;

	@Value("${frontend.url}")
	private String frontendUrl;

	@Override
	public ResponseEntity<RegisterResponseDto> registerUser(RegisterRequestDto request) {
		// Check if a user with the same email and userType already exists
		Optional<User> existingUser = userRepository.findByUserKeyEmailAndUserType(request.getEmail(),
				request.getUserType());
		// System.out.println("Received Date of Birth: " + request.getDob());

		if (existingUser.isPresent()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new RegisterResponseDto("User already exists with this email and user type"));
		}

		// If the user with the same email and userType doesn't exist, create and save
		// new user
		User user = new User();
		user.setEmail(request.getEmail());
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setGender(request.getGender());
		user.setDob(request.getDob());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(request.getRole());
		user.setUserType(request.getUserType());

		String token = UUID.randomUUID().toString();
		user.setVerificationToken(token);

		user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));

		userRepository.saveUser(user);

		String subject = "Email Verification";
		String content = "Please click the link below to verify your email address:\n" +
				frontendUrl + "/auth/verify?token=" + token;

		// Send verification email with the token
		mailUtil.sendEmail(user.getEmail(), subject, content);

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new RegisterResponseDto(
						"User registered successfully,Please verify your profile, Email has been sent."));
	}

	@Override
	public ResponseEntity<LoginResponseDto> loginUser(LoginRequestDto request) {
		// Find user by email and userType
		Optional<User> user = userRepository.findByUserKeyEmailAndUserType(request.getEmail(), request.getUserType());

		if (user.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(new LoginResponseDto("Please register the email with this user type."));
		}

		// Validate password
		if (!passwordEncoder.matches(request.getPassword(), user.get().getPassword())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new LoginResponseDto("Wrong password. Please click on forgot password."));
		}
		
		if(!user.get().getIsVerified()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new LoginResponseDto("Please Verify your Email Address."));
		}

		// Generate JWT Token
		String token = jwtUtil.generateToken(user.get().getEmail(), user.get().getRole().toString(),
				user.get().getUserType());

		// Generate Unique Tab ID
		String tabId = UUID.randomUUID().toString();

		// Store JWT Token in Redis with a TTL of 24 hours
		try {
			redisService.storeToken(tabId, token, 1440); // Store for 24 hours (1440 minutes)
		} catch (Exception e) {
			System.out.println("Iam Not able to connect Redis");
			e.printStackTrace();
		}

		// Set Tab ID and JWT Token in HttpOnly Cookie
		HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
				.getResponse();
		Cookie tabIdCookie = new Cookie("TAB-ID", tabId);
		tabIdCookie.setHttpOnly(false);
		tabIdCookie.setPath("/");
		tabIdCookie.setMaxAge(60 * 60 * 24);
		response.addCookie(tabIdCookie);

		// Set token in HttpOnly cookie

		Cookie cookie = new Cookie("JWT-TOKEN", token);
		cookie.setHttpOnly(true);
		cookie.setSecure(false); // Set this to true if you want to ensure that the cookie is only sent over
									// HTTPS
		cookie.setMaxAge(60 * 60 * 24); // Set expiry to 1 day
		// cookie.setAttribute("SameSite", "None");
		cookie.setPath("/"); // Make it accessible for all paths
		response.addCookie(cookie);

		String redirectUrl = user.get().getUserType().name().equals("SELLER") ? "/api/seller-properties"
				: "/api/buyer-properties";

		return ResponseEntity.ok(new LoginResponseDto("Logged in successfully", user.get().getEmail(),
				user.get().getFirstName(), token, user.get().getUserType(), redirectUrl));

	}

	@Override
	public ResponseEntity<PasswordResponseDto> forgotPassword(ForgotPasswordRequestDto requestDto) {

		String email = requestDto.getEmail();
		User.UserType userType = requestDto.getUserType();
		// Look up the user by email and userType
		Optional<User> userOpt = userRepository.findByUserKeyEmailAndUserType(email, userType);

		// If the user exists
		if (userOpt.isPresent()) {
			// Generate the reset token using JWT utility
			String resetToken = jwtUtil.generateToken(email, userOpt.get().getRole().toString(), userType);

			// Construct the password reset link with the token
			String resetLink = frontendUrl + "/auth/reset-password?token=" + resetToken; // Update with your app URL

			// Email content
			String subject = "Password Reset Link for OffCampusHousing";
			String text = "Hi, \n\nYou have requested a password reset. Please use the following link to reset your password:\n"
					+ resetLink;

			// Send the email using MailUtil
			try {
				// Using MailUtil to send the email
				mailUtil.sendEmail(email, subject, text);

				// Log success and return a response
				System.out.println("Password reset email sent successfully.");
				return ResponseEntity.ok(new PasswordResponseDto("Password reset link has been sent to your email."));
			} catch (Exception e) {
				e.printStackTrace();
				// Handle the error (e.g., log the error)
				return ResponseEntity.status(500).body(new PasswordResponseDto("Failed to send password reset email."));
			}
		} else {
			// User not found
			return ResponseEntity.status(404).body(new PasswordResponseDto("User not found"));
		}
	}

	@Override
	public ResponseEntity<PasswordResponseDto> resetPassword(ResetPasswordRequestDto requestDto) {
		String token = requestDto.getToken();
		String newPassword = requestDto.getNewPassword();

		String email = jwtUtil.extractSubject(token).split("_")[0];
		UserType userType = UserType.valueOf(jwtUtil.extractSubject(token).split("_")[1]);

		// Validate the token
		if (!jwtUtil.isTokenValid(token, email, userType)) {
			return ResponseEntity.status(400).body(new PasswordResponseDto("Invalid or expired reset token"));
		}

		// Update password
		Optional<User> userOpt = userRepository.findByUserKeyEmailAndUserType(email, userType);
		if (userOpt.isPresent()) {
			User user = userOpt.get();
			user.setPassword(passwordEncoder.encode(newPassword));
			userRepository.saveUser(user);
			return ResponseEntity.ok(new PasswordResponseDto("Password has been successfully reset."));
		} else {
			return ResponseEntity.status(404).body(new PasswordResponseDto("User not found"));
		}
	}

	@Transactional
	@Override
	public ResponseEntity<RegisterResponseDto> deleteUserAccount(String email, String userType) {

		List<PropertyDetails> propertiesToDelete = propertyRepository.findBySellerEmailAndUserType(email, userType);
		if ("SELLER".equals(userType)) {
			// Fetch all properties associated with the seller

			if (!propertiesToDelete.isEmpty()) {
				// Deleting property media from the database and Cloudinary
				for (PropertyDetails property : propertiesToDelete) {
					mediaRepository.findByProperty_PropertyId(property.getPropertyId());
					try {
						cloudinaryService.deleteFolderFromCloudinary(property.getPropertyId().toString());
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
						return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.body(new RegisterResponseDto("Error deleting folder from Cloudinary: "));
					}
				}
				// Delete the properties
				propertyRepository.deleteAll(propertiesToDelete);
			}
		}

		// Delete the user account
		User user = userRepository.findByUserKeyEmailAndUserType(email, User.UserType.valueOf(userType))
				.orElseThrow(() -> new RuntimeException("User not found"));

		userRepository.deleteUser(user);
		return ResponseEntity.ok(new RegisterResponseDto("Your Account has been deleted sucessfully."));

	}
}
