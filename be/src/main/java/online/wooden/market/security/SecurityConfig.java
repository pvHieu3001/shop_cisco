package online.wooden.market.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private static final String[] WHITE_LIST_URL = { 
			"/auth/**", "/user/product/**", "/user/category/**", "/user/blog/**", "/v2/api-docs",
			"/v3/api-docs", "/v3/api-docs/**", "/swagger-resources", "/swagger-resources/**", "/configuration/ui",
			"/configuration/security", "/swagger-ui/**", "/webjars/**", "/swagger-ui.html" };
	private static final String[] ADMIN_URL = { 
			"/admin/product/**", "/admin/category/**", "/admin/upload/**", "/admin/blog/**"};

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final AuthenticationProvider authenticationProvider;
	private final LogoutHandler logoutHandler;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		return httpSecurity.csrf(csrf -> {
			csrf.disable();
		}).authorizeHttpRequests(authResquest -> {
			authResquest.requestMatchers(WHITE_LIST_URL).permitAll();
			authResquest.requestMatchers(ADMIN_URL).hasAnyAuthority("ADMIN");
		}).sessionManagement(
				sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(authenticationProvider)
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class).logout(logout -> {
					logout.logoutUrl("/auth/logout");
					logout.addLogoutHandler(logoutHandler);
					logout.logoutSuccessHandler(
							(request, response, authentication) -> SecurityContextHolder.clearContext());
				})
				.cors(Customizer.withDefaults())
				.build();
	}
}
