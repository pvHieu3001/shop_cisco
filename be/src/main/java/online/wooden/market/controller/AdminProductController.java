package online.wooden.market.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.category.CategoryDto;
import online.wooden.market.entity.dto.product.ProductDto;
import online.wooden.market.entity.dto.product.ProductPostRequest;
import online.wooden.market.entity.dto.product.ProductPutRequest;
import online.wooden.market.entity.model.Category;
import online.wooden.market.entity.model.Product;
import online.wooden.market.service.CategoryService;
import online.wooden.market.service.LogService;
import online.wooden.market.service.ProductService;
import online.wooden.market.utils.DataUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static online.wooden.market.utils.Constant.*;

@RestController
@RequestMapping("api/v1/admin/product")
@Tag(name = "Product", description = "Product controller")
public class AdminProductController {

    private final LogService logService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final ModelMapper modelMapper;
    private final String resourceFolder;
    private final String env;

    private Path uploadDir;

    public AdminProductController(LogService logService, ProductService productService, CategoryService categoryService, ModelMapper modelMapper,
                                  @Qualifier("uploadUrl") String resourceFolder, @Qualifier("env") String environment) {
        this.logService = logService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.modelMapper = modelMapper;
        this.resourceFolder = resourceFolder;
        this.env = environment;
    }

    @PostConstruct
    public void init() {
        try {
            uploadDir = Paths.get(resourceFolder);
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

    @Operation(description = "Get all endpoint for Product", summary = "This is a summary for Product get all endpoint")
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

    @Operation(description = "Get by id endpoint for Product", summary = "This is a summary for Product get by id endpoint")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getById(@PathVariable Integer id, HttpServletRequest request) {
        logService.save(env, request, LOG_DETAIL_PRODUCT, LOG_ACTION_GET_DETAIL_PRODUCT, HttpMethod.GET.name());

        Product product = productService.getById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), "Product not found"));
        }
        return ResponseEntity.ok(ApiResponse.success(toDto(product)));
    }

    @Operation(description = "Save endpoint for Product", summary = "This is a summary for Product save endpoint")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductDto>> saveProduct(@Valid @ModelAttribute ProductPostRequest dto, HttpServletRequest request) {
        try {
            if(!Files.exists(uploadDir)){
                Files.createDirectories(uploadDir);
            }

            String imageFilename="";
            if(dto.getImageFile() != null){
                imageFilename = UUID.randomUUID()+"_"+dto.getImageFile().getOriginalFilename();
                Path imagePath = uploadDir.resolve(imageFilename);
                Files.copy(dto.getImageFile().getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            }

            String sourceFilename="";
            if(dto.getSourceFile() != null){
                sourceFilename = UUID.randomUUID()+"_"+dto.getSourceFile().getOriginalFilename();
                Path sourcePath = uploadDir.resolve(sourceFilename);
                Files.copy(dto.getSourceFile().getInputStream(), sourcePath, StandardCopyOption.REPLACE_EXISTING);
            }

            dto.setSlug(DataUtils.toSlug(dto.getName()));
            dto.setImageUrl(imageFilename);
            dto.setSourceUrl(sourceFilename);
            Product product = modelMapper.map(dto, Product.class);
            Category category = categoryService.getById(dto.getCategoryId());
            product.setCategory(category);
            Product productDb = productService.save(product);
            categoryService.refreshProductCount(
                    Stream.of(product.getCategory() !=null ? product.getCategory().getId() : null)
                            .filter(Objects::nonNull)
                            .collect(Collectors.toSet()));
            logService.save(env, request, LOG_CREATE_PRODUCT, LOG_ACTION_CREATE_NEW_PRODUCT, HttpMethod.POST.name());
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", toDto(productDb)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Operation(description = "Update endpoint for Product", summary = "This is a summary for Product update endpoint")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(@Valid @ModelAttribute ProductPutRequest dto,
                                                                @PathVariable Integer id, HttpServletRequest request) {
        try {
            if(!Files.exists(uploadDir)){
                Files.createDirectories(uploadDir);
            }

            String imageFilename="";
            if(dto.getImageFile() != null){
                imageFilename = UUID.randomUUID()+"_"+dto.getImageFile().getOriginalFilename();
                Path imagePath = uploadDir.resolve(imageFilename);
                Files.copy(dto.getImageFile().getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            }

            String sourceFilename = dto.getSourceUrl();
            if(dto.getSourceFile() != null){
                sourceFilename = UUID.randomUUID()+"_"+dto.getSourceFile().getOriginalFilename();
                Path sourcePath = uploadDir.resolve(sourceFilename);
                Files.copy(dto.getSourceFile().getInputStream(), sourcePath, StandardCopyOption.REPLACE_EXISTING);
            }

            dto.setSlug(DataUtils.toSlug(dto.getName()));
            dto.setImageUrl(imageFilename);
            dto.setSourceUrl(sourceFilename);

            Product product = modelMapper.map(dto, Product.class);
            Product productDb = productService.update(product, id, dto.getCategoryId());
            logService.save(env, request, LOG_CREATE_PRODUCT, LOG_ACTION_UPDATE_PRODUCT, HttpMethod.PUT.name());
            return ResponseEntity.ok(ApiResponse.success("Updated", toDto(productDb)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Operation(description = "Delete endpoint for product", summary = "This is a summary for product delete endpoint")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Integer id, HttpServletRequest request) {
        productService.deleteById(id);
        logService.save(env, request, LOG_DELETE_PRODUCT, LOG_ACTION_DELETE_PRODUCT, HttpMethod.DELETE.name());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success("Deleted", null));
    }
}
