package online.wooden.market.security;

import java.io.IOException;
import java.util.Set;
import java.util.regex.Pattern;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import online.wooden.market.security.repository.TokenRepository;
import online.wooden.market.security.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import static online.wooden.market.utils.Constant.*;
import static org.apache.commons.lang3.StringEscapeUtils.escapeJson;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	final static String BEARER_SPACE = "Bearer ";

	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;
	private final TokenRepository tokenRepository;

	private static final Set<Pattern> WHITE_LIST_URL = Set.of(
			Pattern.compile("^/api/v1/auth.*$"),
			Pattern.compile("^/api/v1/user/product.*$"),
			Pattern.compile("^/api/v1/user/category.*$"),
			Pattern.compile("^/api/v1/user/blog.*$"));

	private boolean isWhitelisted(String path) {
		return WHITE_LIST_URL.stream().anyMatch(pattern -> pattern.matcher(path).matches());
	}

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain)
			throws ServletException, IOException {

		String path = request.getServletPath();
		if (isWhitelisted(path)) {
			filterChain.doFilter(request, response);
			return;
		}

		HttpServletRequest processedRequest = request;
		StandardServletMultipartResolver multipartResolver = new StandardServletMultipartResolver();
		boolean isMultipart = false;

		try {
			// Xử lý multipart nếu có
			if (request.getContentType() != null &&
					request.getContentType().toLowerCase().startsWith("multipart/form-data")) {

				if (multipartResolver.isMultipart(request)) {
					processedRequest = multipartResolver.resolveMultipart(request);
					isMultipart = true;
				}
			}

			final String jwt = getTokenFromRequest(processedRequest);
			if (jwt == null) {
				sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token không được cung cấp.", TOKEN_NOT_PROVIDED);
				return;
			}

			final String username;
			try {
				username = jwtService.extractUsernameFromToken(jwt);
			} catch (ExpiredJwtException e) {
				sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token đã hết hạn.", TOKEN_EXPIRED);
				return;
			} catch (MalformedJwtException | SignatureException | IllegalArgumentException e) {
				sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ.", TOKEN_INVALID);
				return;
			}

			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails;
				try {
					userDetails = userDetailsService.loadUserByUsername(username);
				} catch (UsernameNotFoundException e) {
					sendErrorResponse(response, HttpServletResponse.SC_NOT_FOUND, "Không tìm thấy người dùng.", USER_NOT_FOUND);
					return;
				}

				boolean isTokenValid = tokenRepository.findByToken(jwt)
						.map(t -> !t.isExpired() && !t.isRevoked())
						.orElse(false);

				if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid) {
					UsernamePasswordAuthenticationToken authToken =
							new UsernamePasswordAuthenticationToken(
									userDetails, null, userDetails.getAuthorities());
					authToken.setDetails(
							new WebAuthenticationDetailsSource().buildDetails(processedRequest));
					SecurityContextHolder.getContext().setAuthentication(authToken);
				} else {
					sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ hoặc đã bị thu hồi.", TOKEN_REVOKED);
					return;
				}
			}

			filterChain.doFilter(processedRequest, response);
		} catch (Exception e) {
			sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Lỗi nội bộ server.", INTERNAL_SERVER_ERROR);
		} finally {
			if (isMultipart) {
				multipartResolver.cleanupMultipart((MultipartHttpServletRequest) processedRequest);
			}
		}
	}

	private String getTokenFromRequest(HttpServletRequest request) {
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

		if (StringUtils.hasText(authHeader) && authHeader.startsWith(BEARER_SPACE)) {
			return authHeader.replace(BEARER_SPACE, "");
		}

		return null;
	}

	private void sendErrorResponse(HttpServletResponse response, int statusCode, String message, String errorCode) throws IOException {
		response.setStatus(statusCode);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		String json = String.format(
				"{ \"error\": \"%s\", \"errorCode\": \"%s\" }",
				escapeJson(message),
				escapeJson(errorCode)
		);

		response.getWriter().write(json);
	}

}
