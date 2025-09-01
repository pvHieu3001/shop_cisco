package online.wooden.market.security.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import online.wooden.market.security.dto.AuthDto;
import online.wooden.market.security.dto.LoginDto;
import online.wooden.market.security.dto.RegisterDto;
import online.wooden.market.security.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
	
	private final AuthService authService;
	
	@PostMapping(value="/login")
	public ResponseEntity<AuthDto> login(@RequestBody LoginDto dto){					
		return ResponseEntity.ok(authService.login(dto));
	}
	
	@PostMapping(value="/register")
	public ResponseEntity<AuthDto> register(@Valid @RequestBody RegisterDto dto){			
		return ResponseEntity.ok(authService.register(dto));
	}
	
	@PostMapping(value="/refresh-token")
	public void refreshToken(
				HttpServletRequest request,
				HttpServletResponse response
			) throws IOException{			
		authService.refreshToken(request,response);
	}
}
