package online.wooden.market.security.service;

import java.io.IOException;

import online.wooden.market.security.dto.AuthDto;
import online.wooden.market.security.dto.LoginDto;
import online.wooden.market.security.dto.RegisterDto;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

	AuthDto login(LoginDto dto);

	AuthDto register(RegisterDto dto);
	
	void refreshToken(final HttpServletRequest request, final HttpServletResponse response) throws IOException;
	
	boolean isUsernameValid(String username);
}
