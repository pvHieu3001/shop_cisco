package online.wooden.market.config;

import online.wooden.market.entity.model.UserModel;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class SpringSecurityAuditorAware implements AuditorAware<UserModel> {
    @Override
    public Optional<UserModel> getCurrentAuditor() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserModel userModel = null;
        if (principal instanceof UserModel) {
            userModel = ((UserModel)principal);
        }
        return Optional.ofNullable(userModel);
    }
}
