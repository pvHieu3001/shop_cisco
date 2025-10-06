package online.wooden.market.controller;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import jakarta.servlet.http.HttpServletRequest;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.category.CategoryDto;
import online.wooden.market.entity.dto.product.ProductDto;
import online.wooden.market.entity.dto.product.QuickViewProductGetResponse;
import online.wooden.market.entity.model.Product;
import online.wooden.market.service.LogService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import online.wooden.market.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.PostConstruct;

import static online.wooden.market.utils.Constant.*;

@RestController
@RequestMapping("api/v1/user/product")
@Tag(name = "Product", description = "Product controller")
public class ProductController {

    private final LogService logService;
    private final ProductService productService;
    private final ModelMapper modelMapper;
    private final String resourceFolder;
    private final String env;

    public ProductController(LogService logService, ProductService productService, ModelMapper modelMapper,
                             @Qualifier("uploadUrl") String resourceFolder, @Qualifier("env") String environment) {
        this.logService = logService;
        this.productService = productService;
        this.modelMapper = modelMapper;
        this.resourceFolder = resourceFolder;
        this.env = environment;
    }

    @PostConstruct
    public void init() {
        try {
            Path uploadDir = Paths.get(resourceFolder);
            // Create directory if it doesn't exist
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize upload directory: " + resourceFolder, e);
        }
    }

    // Helper: map Product sang GetProductDto
    private ProductDto toDto(Product product) {
        return modelMapper.map(product, ProductDto.class);
    }

    @Operation(description = "Get pageable endpoint for Product", summary = "This is a summary for Product get pageable endpoint")
    @GetMapping("/pageable")
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getPageable(Pageable pageable) {
        Page<Product> productPage = productService.finadAll(pageable);
        Page<ProductDto> productPageDto = productPage.map(this::toDto);
        return ResponseEntity.ok(ApiResponse.success(productPageDto));
    }

    @Operation(description = "Get all endpoint for product", summary = "This is a summary for product get all endpoint")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String isDisplayHot,
            HttpServletRequest request) {
        logService.save(env, request, LOG_VIEW_PRODUCT, LOG_ACTION_GET_ALL_PRODUCT, HttpMethod.GET.name());
        Boolean displayHot =
                isDisplayHot == null || isDisplayHot.isBlank() ? null :
                        "1".equals(isDisplayHot) ? Boolean.TRUE :
                                "0".equals(isDisplayHot) ? Boolean.FALSE : null;
        List<ProductDto> getProductDtos = productService.filterProduct(
                !String.valueOf(status).isEmpty() ? status : null,
                !String.valueOf(search).isEmpty() ? search : null,
                        displayHot
            )
                .stream().map(product -> {
                ProductDto productDto = toDto(product);
                Optional.ofNullable(product.getCategory())
                        .ifPresent(category -> productDto.setCategory(modelMapper.map(category, CategoryDto.class)));
                return productDto;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(getProductDtos));
    }

    @Operation(description = "Get by name endpoint for Product", summary = "This is a summary for Product get by name endpoint")
    @GetMapping("/quick_view")
    public ResponseEntity<ApiResponse<List<QuickViewProductGetResponse>>> GetQuickViewProduct() {
        List<QuickViewProductGetResponse> quickViewProduct = productService.getQuickViewProduct();
        return ResponseEntity.ok(ApiResponse.success(quickViewProduct));
    }

    @Operation(description = "Get by name endpoint for Product", summary = "This is a summary for Product get by name endpoint")
    @GetMapping("/recommend")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getRecommendProduct() {
        List<ProductDto> recommendProduct = productService.getRecommendProduct().stream().map(this::toDto).toList();
        return ResponseEntity.ok(ApiResponse.success(recommendProduct));
    }

    @Operation(description = "Get by slug endpoint for Product", summary = "This is a summary for Product get by id endpoint")
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<ProductDto>> getById(@PathVariable String slug, HttpServletRequest request) {
        Product product = productService.getBySlug(slug);
        logService.save(env, request, LOG_CREATE_PRODUCT, LOG_ACTION_GET_DETAIL_PRODUCT, HttpMethod.GET.name());
        return ResponseEntity.ok(ApiResponse.success(toDto(product)));
    }

    @Operation(description = "Get product by category endpoint", summary = "This is a summary for product get by category endpoint")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getByCategoryId(@PathVariable Integer categoryId) {
        List<ProductDto> getProductDtos = productService.getByCategoryId(categoryId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(getProductDtos));
    }
}
