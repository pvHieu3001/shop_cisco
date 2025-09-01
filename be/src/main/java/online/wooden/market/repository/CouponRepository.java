package online.wooden.market.repository;

import online.wooden.market.entity.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon, Integer> {
} 