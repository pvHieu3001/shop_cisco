package online.wooden.market.service;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.model.Coupon;
import online.wooden.market.repository.CouponRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CouponServiceImpl implements CouponService {
    private final CouponRepository couponRepository;

    @Override
    public Coupon getById(Integer id) {
        return couponRepository.findById(id).orElse(null);
    }

    @Override
    public List<Coupon> getAll() {
        return couponRepository.findAll();
    }

    @Override
    public Coupon save(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    public Coupon update(Coupon coupon, Integer id) {
        Optional<Coupon> optionalCoupon = couponRepository.findById(id);
        if (optionalCoupon.isPresent()) {
            Coupon existing = optionalCoupon.get();
            existing.setCode(coupon.getCode());
            existing.setDiscountValue(coupon.getDiscountValue());
            existing.setMinOrderValue(coupon.getMinOrderValue());
            existing.setMaxDiscountAmount(coupon.getMaxDiscountAmount());
            existing.setStartAt(coupon.getStartAt());
            existing.setExpireAt(coupon.getExpireAt());
            existing.setUsageLimit(coupon.getUsageLimit());
            existing.setUsageCount(coupon.getUsageCount());
            return couponRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteById(Integer id) {
        couponRepository.deleteById(id);
    }
} 