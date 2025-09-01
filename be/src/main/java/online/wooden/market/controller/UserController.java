package online.wooden.market.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.ObjectUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import online.wooden.market.entity.dto.user.UserDto;
import online.wooden.market.entity.dto.user.UserPostRequest;
import online.wooden.market.entity.dto.user.UserPutRequest;
import online.wooden.market.entity.model.UserModel;
import online.wooden.market.exception.CJNotFoundException;
import online.wooden.market.service.UserService;
import online.wooden.market.utils.CustomCodeException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/user")
@Tag(name = "User",description = "User controller")
public class UserController {

	private final UserService userService;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;

	@Operation(description = "Get pageable endpoint for user", summary = "This is a summary for user get pageable endpoint")
	@GetMapping(value = "/pageable")
	public ResponseEntity<Page<UserDto>> getPageable(Pageable pageable) {
		Page<UserModel> userPage = userService.finadAll(pageable);
		Page<UserDto> userPageDto = userPage.map(user -> modelMapper.map(user, UserDto.class));
		return ResponseEntity.status(HttpStatus.OK).body(userPageDto);
	}

	@Operation(description = "Get all endpoint for user", summary = "This is a summary for user get all endpoint")
	@GetMapping
	public ResponseEntity<List<UserDto>> getAll() {
		// Get All user for user services
		List<UserModel> user = userService.getAll();
		// Map user model to DTO objects
		List<UserDto> userDtos = user.stream().map(userModel -> modelMapper.map(userModel, UserDto.class))
				.collect(Collectors.toList());
		// return endpoint
		return ResponseEntity.status(HttpStatus.OK).body(userDtos);
	}

	@Operation(description = "Get by name endpoint for user", summary = "This is a summary for user get by name endpoint")
	@GetMapping("/{name}/name")
	public ResponseEntity<UserDto> getUserByName(@PathVariable String name) {
		UserModel userDb = userService.getByName(name);
		if(ObjectUtils.isEmpty(userDb))
			throw new CJNotFoundException(CustomCodeException.CODE_400, "user not found with name "+name);
		UserDto userDto = modelMapper.map(userDb, UserDto.class);
		return ResponseEntity.status(HttpStatus.OK).body(userDto);
	}

	@Operation(description = "Save  endpoint for user", summary = "This is a summary for user save endpoint")
	@PostMapping
	public ResponseEntity<UserDto> saveUser(@Valid @RequestBody UserPostRequest dto) {
		dto.setPassword(passwordEncoder.encode(dto.getPassword()));
		UserModel user = modelMapper.map(dto, UserModel.class);
		UserModel userDb = userService.save(user);
		UserDto userDto = modelMapper.map(userDb, UserDto.class);
		return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
	}

	@Operation(description = "Update  endpoint for user", summary = "This is a summary for user update endpoint")
	@PutMapping(value = "/{id}")
	public ResponseEntity<UserDto> updateUser(@Valid @RequestBody UserPutRequest dto,
											  @PathVariable(name = "id") Long id) {
		// Map DTO to Model object for service
		UserModel user = modelMapper.map(dto, UserModel.class);
		// Send object to update service
		UserModel userDb = userService.update(user, id);
		// Map Model to DTO object for return endpoint
		UserDto userDto = modelMapper.map(userDb, UserDto.class);
		// Return endpoint
		return ResponseEntity.status(HttpStatus.OK).body(userDto);
	}

	@Operation(description = "Delete  endpoint for user", summary = "This is a summary for user delete endpoint")
	@DeleteMapping(value = "{id}")
	public ResponseEntity<UserDto> deleteUser(@PathVariable(name = "id") Long id) {
		// Send id to delete service
		userService.deleteById(id);
		// return endpoint
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
}
