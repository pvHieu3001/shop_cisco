package online.wooden.market.repository;

import online.wooden.market.entity.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
} 