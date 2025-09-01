package online.wooden.market.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import online.wooden.market.entity.model.UserModel;

public interface UserService {
	UserModel getByName(final String name);
	List<UserModel> getAll();
	UserModel save(final UserModel user);
	UserModel update(final UserModel user, final Long id);
	void deleteById(final Long id);
	Page<UserModel> finadAll(Pageable pageable);
}
