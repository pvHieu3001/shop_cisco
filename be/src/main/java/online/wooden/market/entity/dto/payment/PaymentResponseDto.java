package online.wooden.market.entity.dto.payment;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private Integer id;
    private Integer orderId;
    private Double amount;
    private String paymentMethod;
    private String transactionId;
    private String paymentStatus;
} 