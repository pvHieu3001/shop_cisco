package online.wooden.market.entity.dto.affiliate.link;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AffiliateLinkDto {
    private Long id;
    private Long userId;
    private Long productId;
    private String affiliateCode;
    private String targetUrl;
    private LocalDateTime expiredAt;
    private Integer clickCount = 0;
    private Integer conversionCount = 0;
    private Boolean status = true;
    private String image;
}
