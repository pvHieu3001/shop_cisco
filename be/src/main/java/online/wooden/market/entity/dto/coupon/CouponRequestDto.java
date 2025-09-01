package online.wooden.market.entity.dto.coupon;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequestDto {
    private String code;
    private Long discountValue;
    private Long minOrderValue;
    private Long maxDiscountAmount;
    private Date startAt;
    private Date expireAt;
    private Integer usageLimit;
    private Integer usageCount;
} 