package online.wooden.market.security.service.impl;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import javax.crypto.SecretKey;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import online.wooden.market.security.dto.UserSecurityDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import online.wooden.market.security.entity.SecurityUser;
import online.wooden.market.security.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class DefaultJwtService implements JwtService {
	
	@Value("${application.security.jwt.secret-key}")
	  private String SECRET_KEY;
	  @Value("${application.security.jwt.expiration}")
	  private long jwtExpiration;
	  @Value("${application.security.jwt.refresh-token.expiration}")
	  private long refreshExpiration;
	
	@Override
	public String extractUsernameFromToken(String token) {
		return getClaim(token, Claims::getSubject);
	}

	public UserSecurityDto getUserFromToken(String token) throws JsonProcessingException {
		Claims claims = extractAllClaims(token);
		String userJson = claims.get("user", String.class);
		ObjectMapper objectMapper = new ObjectMapper();
		UserSecurityDto user = objectMapper.readValue(userJson, UserSecurityDto.class);
		return user;
	}
	
	public <T> T getClaim(String token, Function<Claims, T> clamsResolver) {
		final Claims claims = extractAllClaims(token);
		return clamsResolver.apply(claims);
	}
	
	private Claims extractAllClaims(String token) {
		return Jwts
				.parserBuilder()
				.setSigningKey(getSignInKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
	}

	private SecretKey getSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	@Override
	public String getToken(SecurityUser securityUser) throws JsonProcessingException {
		return getToken(new HashMap<>(), securityUser, jwtExpiration);
	}
	
	@Override
	public String getRefreshToken(
			SecurityUser securityUser
	) throws JsonProcessingException {
	    return getToken(new HashMap<>(), securityUser, refreshExpiration);
	}
	
	private String getToken(
			Map<String, Object> extraClains, 
			SecurityUser securityUser,
			long expiration) throws JsonProcessingException {
				List<String> roles = securityUser.getAuthorities()
						.stream()
						.map(GrantedAuthority::getAuthority)
						.collect(Collectors.toList());
		UserSecurityDto userSecurityDto = new UserSecurityDto(
				securityUser.getUsername(), securityUser.getFirstname(),
				securityUser.getLastname(), securityUser.getEmail());
		ObjectMapper objectMapper = new ObjectMapper();
		String userJson = objectMapper.writeValueAsString(userSecurityDto);
		return Jwts
				.builder()
				.setClaims(extraClains)
				.claim("authorities", roles)
				.claim("user", userJson)
				.setSubject(securityUser.getUsername())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis()+expiration))
				.signWith(getSignInKey(), SignatureAlgorithm.HS256)
				.compact();
	}	

	@Override
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = extractUsernameFromToken(token);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}
	
	private boolean isTokenExpired(String token) {
		return getExpiration(token).before(new Date());
	}
	
	private Date getExpiration(String token) {
		return getClaim(token, Claims::getExpiration);
	}

}
