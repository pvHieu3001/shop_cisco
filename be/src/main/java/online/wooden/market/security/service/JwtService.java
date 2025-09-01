package online.wooden.market.security.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.security.core.userdetails.UserDetails;
import online.wooden.market.security.entity.SecurityUser;

public interface JwtService {

	public String extractUsernameFromToken(String jwt);

	public String getToken(final SecurityUser securityUser) throws JsonProcessingException;

	public String getRefreshToken(final SecurityUser securityUser) throws JsonProcessingException;

	public boolean isTokenValid(String token, UserDetails userDetails);
}
