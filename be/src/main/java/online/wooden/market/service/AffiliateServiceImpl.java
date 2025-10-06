package online.wooden.market.service;

import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPostRequest;
import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPutRequest;
import online.wooden.market.entity.model.AffiliateLink;
import online.wooden.market.entity.model.Blog;
import online.wooden.market.exception.CJNotFoundException;
import online.wooden.market.repository.AffiliateLinkRepository;
import online.wooden.market.utils.CustomCodeException;
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

    public AffiliateLink getRandomAffiliateLink() {
        List<AffiliateLink> allLinks = affiliateLinkRepository.findAllByStatusTrue();
        if (allLinks.isEmpty()) {
            return null;
        }
        int randomIndex = new Random().nextInt(allLinks.size());
        return allLinks.get(randomIndex);
    }

    @Override
    public AffiliateLink getAffiliateLinkById(Long id) {
        return affiliateLinkRepository.findById(id)
                .orElseThrow(() -> new CJNotFoundException(CustomCodeException.CODE_400, "Link không tồn tại"));
    }

    public String generateUniqueCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    public void recordClick(Long id) {
        affiliateLinkRepository.findById(id).ifPresent(link -> {
            link.setClickCount(link.getClickCount() + 1);
            affiliateLinkRepository.save(link);
        });
    }


    public AffiliateLink createAffiliateLink(AffiliateLinkPostRequest request) {
        AffiliateLink link = new AffiliateLink();
        link.setName(request.getName());
        link.setTargetUrl(request.getTargetUrl());
        link.setImage(request.getImage());
        link.setPrice(request.getPrice());
        link.setOriginalPrice(request.getOriginalPrice());
        link.setClickCount(0);
        link.setStatus(true);
        return affiliateLinkRepository.save(link);
    }

    public AffiliateLink updateAffiliateLink(Long id, AffiliateLinkPutRequest request) {
        AffiliateLink link = affiliateLinkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Link không tồn tại"));
        link.setName(request.getName());
        link.setTargetUrl(request.getTargetUrl());
        link.setImage(request.getImage());
        link.setPrice(request.getPrice());
        link.setOriginalPrice(request.getOriginalPrice());
        link.setClickCount(0);
        link.setStatus(true);
        return affiliateLinkRepository.save(link);
    }

    @Override
    public void deleteById(Long id) {
        AffiliateLink affiliateLink = affiliateLinkRepository.findById(id).orElseThrow(() -> new RuntimeException("Link không tồn tại"));
        affiliateLinkRepository.delete(affiliateLink);
    }
}
