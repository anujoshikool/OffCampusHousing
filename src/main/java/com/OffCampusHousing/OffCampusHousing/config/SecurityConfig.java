package com.OffCampusHousing.OffCampusHousing.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.OffCampusHousing.OffCampusHousing.repository.UserRepositoryImpl;
import com.OffCampusHousing.OffCampusHousing.security.CustomAuthenticationProvider;
import com.OffCampusHousing.OffCampusHousing.security.JwtAuthenticationFilter;
import com.OffCampusHousing.OffCampusHousing.security.JwtUtil;
import com.OffCampusHousing.OffCampusHousing.service.RedisService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtUtil jwtUtil;
	private final UserRepositoryImpl userRepository;
	private final RedisService redisService;

	public SecurityConfig(JwtUtil jwtUtil, UserRepositoryImpl userRepository, RedisService redisService) {
		this.jwtUtil = jwtUtil;
		this.userRepository = userRepository;
		this.redisService = redisService;

	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public CustomAuthenticationProvider customAuthenticationProvider(
			UserRepositoryImpl userDetailsService,
			PasswordEncoder passwordEncoder) {
		return new CustomAuthenticationProvider(userDetailsService, passwordEncoder);
	}

	@Bean
	public AuthenticationManager authenticationManager(HttpSecurity http,
			CustomAuthenticationProvider customAuthenticationProvider) throws Exception {
		AuthenticationManagerBuilder authenticationManagerBuilder = http
				.getSharedObject(AuthenticationManagerBuilder.class);
		authenticationManagerBuilder.authenticationProvider(customAuthenticationProvider);
		return authenticationManagerBuilder.build();
	}

	@Bean
	public JwtAuthenticationFilter jwtAuthenticationFilter() {
		return new JwtAuthenticationFilter(jwtUtil, userRepository, redisService);
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		JwtAuthenticationFilter jwtFilter = jwtAuthenticationFilter();
		http
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/auth/login", "/auth/register", "/auth/forgot-password","/api/seller-properties/webhook",
								"/auth/reset-password", "/auth/verify", "/auth/delete-account", "/auth/logout", "/")
						.permitAll() // Updated paths
						.requestMatchers("/", "/index.html", "/static/**", "/favicon.ico").permitAll()
						.requestMatchers("/auth/user-details","/auth/edit-profile", "/api/seller-properties/**").authenticated()
						.requestMatchers("/api/buyer-properties/**").authenticated()
						// .requestMatchers("/api/seller-properties/deleteProperty").authenticated()
						.anyRequest().authenticated())
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins("*").allowedMethods("*");
			}
		};

	}

	// Define CORS configuration
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		// configuration.setAllowedOrigins(List.of("*")); // Set allowed origins (e.g.,
		// "http://localhost:3000")
		configuration.setAllowedOrigins(List.of("https://offcampus-backend.onrender.com",
				"http://localhost:3000","https://offcampus-frontend.vercel.app","http://54.234.44.51:8080",
				"https://offcampus-frontend-anujoshikool-anurag-joshis-projects.vercel.app",
				"https://offcampus-frontend-anurag-joshis-projects.vercel.app")); // Set allowed origins (e.g.,
																			// "http://localhost:3000")
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed HTTP methods
		configuration.setAllowedHeaders(List.of("*")); // Allowed headers
		configuration.setAllowCredentials(true); // Enable credentials if needed
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration); // Apply to all endpoints
		return source;
	}
}
