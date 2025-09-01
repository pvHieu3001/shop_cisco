package online.wooden.market.entity.dto.user;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDto {
		Long id;		
		String firstname;		
		String username;		
		String password;		
		String lastname;	
		String email;
		Date createAt;

}
