package online.wooden.market.entity.dto.affiliate.link;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AffiliateLinkPutRequest {
    private Long id;
    private String name;
    private String targetUrl;
    private Integer clickCount = 0;
    private Boolean status = true;
    private String price;
    private String originalPrice;
    private String image;
}
