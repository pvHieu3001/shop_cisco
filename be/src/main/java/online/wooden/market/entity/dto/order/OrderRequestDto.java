package online.wooden.market.entity.dto.order;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDto {
    private Double subTotal;
    private Double discountAmount;
    private Double totalAmount;
    private Integer couponId;
    private String status;
} 