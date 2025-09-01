package online.wooden.market.entity.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * HAQ Answer
 */

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "coupons")
@NoArgsConstructor
public class Coupon extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull
    private String code;
    @NotNull
    private Long discountValue;
    @NotNull
    private Long minOrderValue;
    @NotNull
    private Long maxDiscountAmount;
    @NotNull
    private Date startAt;
    @NotNull
    private Date expireAt;
    @NotNull
    private Integer usageLimit;
    @NotNull
    private Integer usageCount;
}
