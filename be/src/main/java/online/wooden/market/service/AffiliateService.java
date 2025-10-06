package online.wooden.market.service;

import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPostRequest;
import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPutRequest;
import online.wooden.market.entity.model.AffiliateLink;

import java.util.List;
import java.util.Optional;

public interface AffiliateService {
     AffiliateLink createAffiliateLink(Long userId, Long productId, String targetUrl) ;
     void recordClick(String affiliateCode) ;
     void recordConversion(String affiliateCode) ;
     List<AffiliateLink> getAllAffiliateLinks();
     Optional<AffiliateLink> getRandomAffiliateLink();
     AffiliateLink createAffiliateLink(AffiliateLinkPostRequest request);
     AffiliateLink updateAffiliateLink(Long id, AffiliateLinkPutRequest request);
}
