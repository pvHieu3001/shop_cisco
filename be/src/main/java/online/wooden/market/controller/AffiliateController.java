package online.wooden.market.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkDto;
import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPostRequest;
import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPutRequest;
import online.wooden.market.entity.dto.blog.BlogDto;
import online.wooden.market.entity.dto.blog.BlogGetBySlugResponse;
import online.wooden.market.entity.dto.blog.BlogGetByTypeResponse;
import online.wooden.market.entity.dto.user.UserDto;
import online.wooden.market.entity.model.AffiliateLink;
import online.wooden.market.entity.model.Blog;
import online.wooden.market.service.AffiliateService;
import online.wooden.market.service.BlogService;
import online.wooden.market.service.LogService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static online.wooden.market.utils.Constant.*;

@Slf4j
@RestController
@RequestMapping("api/v1/user/affiliate")
@Tag(name = "Blog", description = "Blog controller")
public class AffiliateController {
    private final AffiliateService affiliateService;
    private final ModelMapper modelMapper;
    private final LogService logService;
    private final String env;

    public AffiliateController( AffiliateService affiliateService, ModelMapper modelMapper, LogService logService, String env) {
        this.affiliateService = affiliateService;
        this.modelMapper = modelMapper;
        this.logService = logService;
        this.env = env;
    }

    private AffiliateLinkDto toDto(AffiliateLink affiliateLink) {
        return modelMapper.map(affiliateLink, AffiliateLinkDto.class);
    }

    @Operation(description = "Get all endpoint for Blog", summary = "Get all Blog")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AffiliateLinkDto>>> getAll(@RequestParam(required = false) String search, HttpServletRequest request) {
        logService.save(env, request, LOG_VIEW_BLOG, LOG_ACTION_GET_ALL_BLOG, HttpMethod.GET.name());
        List<AffiliateLinkDto> linkDtoList = affiliateService.getAllAffiliateLinks().stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(linkDtoList));
    }

    @Operation(description = "Get all endpoint for Blog", summary = "Get all Blog")
    @GetMapping("/random")
    public ResponseEntity<ApiResponse<AffiliateLinkDto>> getRandomAffiliateLink(@RequestParam(required = false) String search, HttpServletRequest request) {
        logService.save(env, request, LOG_VIEW_BLOG, LOG_ACTION_GET_ALL_BLOG, HttpMethod.GET.name());
        AffiliateLink randomAffiliateLink = affiliateService.getRandomAffiliateLink();
        return ResponseEntity.ok(ApiResponse.success(toDto(randomAffiliateLink)));
    }

    @Operation(description = "Get pageable endpoint for Blog", summary = "Get pageable Blog")
    @GetMapping("/click/{id}")
    public Void handleClick(@PathVariable Long id) {
        affiliateService.recordClick(id);
        return null;
    }
} 