package online.wooden.market.service;

import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPostRequest;
import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPutRequest;
import online.wooden.market.entity.model.AffiliateLink;

import java.util.List;
import java.util.Optional;

public interface AffiliateService {
     void recordClick(Long id) ;
     List<AffiliateLink> getAllAffiliateLinks();
     AffiliateLink getRandomAffiliateLink();
     AffiliateLink getAffiliateLinkById(Long id);
     AffiliateLink createAffiliateLink(AffiliateLinkPostRequest request);
     AffiliateLink updateAffiliateLink(Long id, AffiliateLinkPutRequest request);
     void deleteById(Long id);
}
