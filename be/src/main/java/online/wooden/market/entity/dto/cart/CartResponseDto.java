package online.wooden.market.entity.dto.cart;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDto {
    private Integer id;
    private Integer userId;
    private Integer couponId;
} 