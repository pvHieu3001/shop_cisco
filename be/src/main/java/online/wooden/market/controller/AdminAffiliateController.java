package online.wooden.market.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkDto;
import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPostRequest;
import online.wooden.market.entity.dto.affiliate.link.AffiliateLinkPutRequest;
import online.wooden.market.entity.dto.category.CategoryDto;
import online.wooden.market.entity.model.AffiliateLink;
import online.wooden.market.entity.model.Category;
import online.wooden.market.service.AffiliateService;
import online.wooden.market.service.LogService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static online.wooden.market.utils.Constant.LOG_ACTION_GET_ALL_BLOG;
import static online.wooden.market.utils.Constant.LOG_VIEW_BLOG;

@Slf4j
@RestController
@RequestMapping("api/v1/admin/affiliate")
@Tag(name = "Blog", description = "Blog controller")
public class AdminAffiliateController {
    private final AffiliateService affiliateService;
    private final ModelMapper modelMapper;
    private final LogService logService;
    private final String env;
    private final String resourceFolder;
    private Path uploadDir;

    @PostConstruct
    public void init() {
        try {
            uploadDir = Paths.get(resourceFolder);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            log.info("Upload directory initialized: {}", uploadDir);
        } catch (IOException e) {
            log.error("Failed to initialize upload directory: {}", resourceFolder, e);
            throw new RuntimeException("Failed to initialize upload directory: " + resourceFolder, e);
        }
    }

    public AdminAffiliateController(AffiliateService affiliateService, ModelMapper modelMapper, LogService logService, String env,
                                    @Qualifier("uploadUrl") String resourceFolder) {
        this.affiliateService = affiliateService;
        this.modelMapper = modelMapper;
        this.logService = logService;
        this.env = env;
        this.resourceFolder = resourceFolder;
    }

    private AffiliateLinkDto toDto(AffiliateLink affiliateLink) {
        return modelMapper.map(affiliateLink, AffiliateLinkDto.class);
    }

    @Operation(description = "Get all endpoint for Category", summary = "Get all Category")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AffiliateLinkDto>>> getAll(@RequestParam(required = false) String search) {
        List<AffiliateLinkDto> dtos = affiliateService.getAllAffiliateLinks().stream()
                .filter(affiliate -> search == null || search.isEmpty() || affiliate.getName().toLowerCase().contains(search.toLowerCase()))
                .map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @Operation(description = "Get by id endpoint for Category", summary = "Get Category by id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AffiliateLinkDto>> getById(@PathVariable Long id) {
        AffiliateLink affiliateLink = affiliateService.getAffiliateLinkById(id);
        return ResponseEntity.ok(ApiResponse.success(toDto(affiliateLink)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AffiliateLinkDto>> createLink(@RequestBody AffiliateLinkPostRequest request) {
        try {
            AffiliateLink link = affiliateService.createAffiliateLink(request);
            log.info("Category created successfully with ID: {}", link.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", toDto(link)));
        } catch (Exception e) {
            log.error("Failed to create category", e);
            throw new RuntimeException("Failed to create category: " + e.getMessage(), e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AffiliateLinkDto>> updateLink(@PathVariable Long id, @RequestBody AffiliateLinkPutRequest request) {
        try {
            AffiliateLink updated = affiliateService.updateAffiliateLink(id, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", toDto(updated)));
        }catch (Exception e) {
            log.error("Failed to create category", e);
            throw new RuntimeException("Failed to create category: " + e.getMessage(), e);
        }
    }

    @Operation(description = "Delete Category", summary = "Delete Category")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            log.info("Deleting category with ID: {}", id);
            affiliateService.deleteById(id);
            log.info("Category deleted successfully with ID: {}", id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success("Deleted", null));
        } catch (Exception e) {
            log.error("Failed to delete category with ID: {}", id, e);
            throw new RuntimeException("Failed to delete category: " + e.getMessage(), e);
        }
    }
} 