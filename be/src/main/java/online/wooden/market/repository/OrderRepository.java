package online.wooden.market.repository;

import online.wooden.market.entity.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {
} 