package online.wooden.market.entity.dto.affiliate.link;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AffiliateLinkDto {
    private Long id;
    private String name;
    private String targetUrl;
    private Integer clickCount = 0;
    private Boolean status = true;
    private String price;
    private String originalPrice;
    private String image;
}
