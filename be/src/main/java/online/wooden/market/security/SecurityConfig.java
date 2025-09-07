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
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private static final String[] WHITE_LIST_URL = {
			"/auth/**", "/user/product/**", "/user/category/**", "/user/blog/**", "/v2/api-docs",
			"/v3/api-docs", "/v3/api-docs/**", "/swagger-resources", "/swagger-resources/**", "/configuration/ui",
			"/configuration/security", "/swagger-ui/**", "/webjars/**", "/swagger-ui.html"
	};

	private static final String[] ADMIN_URL = {
			"/admin/product/**", "/admin/category/**", "/admin/upload/**", "/admin/blog/**"
	};

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final AuthenticationProvider authenticationProvider;
	private final LogoutHandler logoutHandler;

	private List<RequestMatcher> buildRegexMatchers(String[] paths) {
		return Arrays.stream(paths)
				.map(this::convertAntToRegex)
				.map(regex -> new RegexRequestMatcher(regex, null))
				.collect(Collectors.toList());
	}

	private String convertAntToRegex(String antPattern) {
		String cleanPattern = antPattern.endsWith("/**")
				? antPattern.substring(0, antPattern.length() - 3)
				: antPattern;
		return ".*" + cleanPattern.replace("/", "\\/") + ".*";
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		List<RequestMatcher> whiteListMatchers = buildRegexMatchers(WHITE_LIST_URL);
		List<RequestMatcher> adminMatchers = buildRegexMatchers(ADMIN_URL);

		return httpSecurity.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> {
					whiteListMatchers.forEach(matcher -> auth.requestMatchers(matcher).permitAll());
					adminMatchers.forEach(matcher -> auth.requestMatchers(matcher).hasAuthority("ADMIN"));
					auth.anyRequest().authenticated();
				})
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(authenticationProvider)
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.logout(logout -> logout
						.logoutUrl("/auth/logout")
						.addLogoutHandler(logoutHandler)
						.logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
				)
				.cors(Customizer.withDefaults())
				.build();
	}
}