package online.wooden.market.entity.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = false)
@Data
@NoArgsConstructor
@Entity
@Table(name = "affiliate_links")
public class AffiliateLink extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long productId;
    @Column(unique = true, nullable = false)
    private String affiliateCode;
    @Column(columnDefinition = "TEXT")
    private String targetUrl;
    private LocalDateTime expiredAt;
    private Integer clickCount = 0;
    private Integer conversionCount = 0;
    private Boolean status = true;
    private String price;
    private String discount;
}
