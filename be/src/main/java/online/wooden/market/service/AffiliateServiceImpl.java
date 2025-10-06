package online.wooden.market.service;

import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPostRequest;
import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPutRequest;
import online.wooden.market.entity.model.AffiliateLink;
import online.wooden.market.repository.AffiliateLinkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AffiliateServiceImpl implements AffiliateService {
    @Autowired
    private AffiliateLinkRepository affiliateLinkRepository;

    public List<AffiliateLink> getAllAffiliateLinks() {
        return affiliateLinkRepository.findAll();
    }

    public Optional<AffiliateLink> getRandomAffiliateLink() {
        List<AffiliateLink> allLinks = affiliateLinkRepository.findAllByStatusTrue();
        if (allLinks.isEmpty()) {
            return Optional.empty();
        }
        int randomIndex = new Random().nextInt(allLinks.size());
        return Optional.of(allLinks.get(randomIndex));
    }

    public AffiliateLink createAffiliateLink(Long userId, Long productId, String targetUrl) {
        AffiliateLink link = new AffiliateLink();
        link.setProductId(productId);
        link.setTargetUrl(targetUrl);
        link.setAffiliateCode(generateUniqueCode());
        return affiliateLinkRepository.save(link);
    }

    public String generateUniqueCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    public void recordClick(String affiliateCode) {
        affiliateLinkRepository.findByAffiliateCode(affiliateCode).ifPresent(link -> {
            link.setClickCount(link.getClickCount() + 1);
            affiliateLinkRepository.save(link);
        });
    }

    public void recordConversion(String affiliateCode) {
        affiliateLinkRepository.findByAffiliateCode(affiliateCode).ifPresent(link -> {
            link.setConversionCount(link.getConversionCount() + 1);
            affiliateLinkRepository.save(link);
        });
    }

    public AffiliateLink createAffiliateLink(AffiliateLinkPostRequest request) {
        AffiliateLink link = new AffiliateLink();
        link.setProductId(request.productId);
        link.setTargetUrl(request.targetUrl);
        link.setAffiliateCode(generateUniqueCode());
        link.setCreatedAt(LocalDateTime.now());
        link.setExpiredAt(request.expiredAt);
        link.setStatus(true);
        return affiliateLinkRepository.save(link);
    }

    public AffiliateLink updateAffiliateLink(Long id, AffiliateLinkPutRequest request) {
        AffiliateLink link = affiliateLinkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Link không tồn tại"));
        link.setTargetUrl(request.targetUrl);
        link.setExpiredAt(request.expiredAt);
        link.setProductId(request.productId);
        return affiliateLinkRepository.save(link);
    }
}
