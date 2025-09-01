package online.wooden.market.controller;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.category.CategoryDto;
import online.wooden.market.entity.model.Category;
import online.wooden.market.service.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("api/v1/user/category")
@Tag(name = "Category", description = "Category controller")
public class CategoryController {
    private final CategoryService categoryService;
    private final ModelMapper modelMapper;
    private final String resourceFolder;

    // Constructor injection with qualifier for the upload URL bean
    public CategoryController(CategoryService categoryService, ModelMapper modelMapper, 
                            @Qualifier("uploadUrl") String resourceFolder) {
        this.categoryService = categoryService;
        this.modelMapper = modelMapper;
        this.resourceFolder = resourceFolder;
    }
    
    @PostConstruct
    public void init() {
        try {
            Path uploadDir = Paths.get(resourceFolder);
            // Create directory if it doesn't exist
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            log.info("Upload directory initialized: {}", uploadDir);
        } catch (IOException e) {
            log.error("Failed to initialize upload directory: {}", resourceFolder, e);
            throw new RuntimeException("Failed to initialize upload directory: " + resourceFolder, e);
        }
    }

    private CategoryDto toDto(Category category) {
        return modelMapper.map(category, CategoryDto.class);
    }

    @Operation(description = "Get pageable endpoint for Category", summary = "Get pageable Category")
    @GetMapping("/pageable")
    public ResponseEntity<ApiResponse<Page<CategoryDto>>> getPageable(Pageable pageable) {
        Page<Category> page = categoryService.getAll() instanceof Page ? (Page<Category>) categoryService.getAll() : Page.empty();
        Page<CategoryDto> pageDto = page.map(this::toDto);
        return ResponseEntity.ok(ApiResponse.success(pageDto));
    }

    @Operation(description = "Get all endpoint for Category", summary = "Get all Category")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAll(@RequestParam(required = false) String search) {
        List<CategoryDto> dtos = categoryService.getAll().stream()
                .filter(category -> search == null || search.isEmpty() || category.getName().toLowerCase().contains(search.toLowerCase()))
                .map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @Operation(description = "Get by slug endpoint for Category", summary = "Get Category by slug")
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<CategoryDto>> getBySlug(@PathVariable String slug) {
        Category category = categoryService.getBySlug(slug);
        if (category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), "Danh mục không tồn tại"));
        }
        return ResponseEntity.ok(ApiResponse.success(toDto(category)));
    }
} 