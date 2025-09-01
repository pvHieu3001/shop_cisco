package online.wooden.market.controller;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.category.CategoryDto;
import online.wooden.market.entity.dto.category.CategoryPostRequest;
import online.wooden.market.entity.dto.category.CategoryPutRequest;
import online.wooden.market.entity.model.Category;
import online.wooden.market.service.CategoryService;
import online.wooden.market.utils.DataUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("api/v1/admin/category")
@Tag(name = "Category", description = "Category controller")
public class AdminCategoryController {
    private final CategoryService categoryService;
    private final ModelMapper modelMapper;
    private final String resourceFolder;

    private Path uploadDir;
    
    // Constructor injection with qualifier for the upload URL bean
    public AdminCategoryController(CategoryService categoryService, ModelMapper modelMapper,
                            @Qualifier("uploadUrl") String resourceFolder) {
        this.categoryService = categoryService;
        this.modelMapper = modelMapper;
        this.resourceFolder = resourceFolder;
    }
    
    @PostConstruct
    public void init() {
        try {
            uploadDir = Paths.get(resourceFolder);
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

    @Operation(description = "Get all endpoint for Category", summary = "Get all Category")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAll(@RequestParam(required = false) String search) {
        List<CategoryDto> dtos = categoryService.getAll().stream()
                .filter(category -> search == null || search.isEmpty() || category.getName().toLowerCase().contains(search.toLowerCase()))
                .map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @Operation(description = "Get by id endpoint for Category", summary = "Get Category by id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> getById(@PathVariable Integer id) {
        Category category = categoryService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(toDto(category)));
    }

    @Operation(description = "Create Category", summary = "Create Category")
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDto>> create(@ModelAttribute CategoryPostRequest dto) {
        try {
            log.info("Creating category with name: {}, parentId: {}", dto.getName(), dto.getParentId());
            
            // Validate required fields
            if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                log.error("Category name is null or empty");
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Category name is required"));
            }

            String imageFilename = "";
            if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
                imageFilename = UUID.randomUUID() + "_" + dto.getImageFile().getOriginalFilename();
                Path imagePath = uploadDir.resolve(imageFilename);
                Files.copy(dto.getImageFile().getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
                log.info("Image saved: {}", imageFilename);
                dto.setImage(imageFilename);
            } else {
                dto.setImage(""); // No image uploaded
            }

            dto.setSlug(DataUtils.toSlug(dto.getName()));
            Category category = modelMapper.map(dto, Category.class);
            Category saved = categoryService.save(category);
            
            log.info("Category created successfully with ID: {}", saved.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", toDto(saved)));
        } catch (IOException e) {
            log.error("Failed to save image file", e);
            throw new RuntimeException("Failed to save image file", e);
        } catch (Exception e) {
            log.error("Failed to create category", e);
            throw new RuntimeException("Failed to create category: " + e.getMessage(), e);
        }
    }

    @Operation(description = "Update Category", summary = "Update Category")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> update(@Valid @ModelAttribute CategoryPutRequest dto, @PathVariable Integer id) {
        try {
            log.info("Updating category with ID: {}, name: {}", id, dto.getName());
            
            // Validate required fields
            if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                log.error("Category name is null or empty");
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Category name is required"));
            }

            // Get existing category to preserve image if no new image is uploaded
            Category existingCategory = categoryService.getById(id);
            
            String imageFilename = "";
            if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
                // New image uploaded
                imageFilename = UUID.randomUUID() + "_" + dto.getImageFile().getOriginalFilename();
                Path imagePath = uploadDir.resolve(imageFilename);
                Files.copy(dto.getImageFile().getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
                log.info("New image saved: {}", imageFilename);
                dto.setImage(imageFilename);
            } else {
                // Keep existing image
                dto.setImage(existingCategory.getImage());
            }

            dto.setSlug(DataUtils.toSlug(dto.getName()));
            Category category = modelMapper.map(dto, Category.class);
            Category updated = categoryService.update(category, id);
            
            log.info("Category updated successfully with ID: {}", updated.getId());
            return ResponseEntity.ok(ApiResponse.success("Updated", toDto(updated)));
        } catch (IOException e) {
            log.error("Failed to save image file", e);
            throw new RuntimeException("Failed to save image file", e);
        } catch (Exception e) {
            log.error("Failed to update category", e);
            throw new RuntimeException("Failed to update category: " + e.getMessage(), e);
        }
    }

    @Operation(description = "Delete Category", summary = "Delete Category")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            log.info("Deleting category with ID: {}", id);
            categoryService.deleteById(id);
            log.info("Category deleted successfully with ID: {}", id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success("Deleted", null));
        } catch (Exception e) {
            log.error("Failed to delete category with ID: {}", id, e);
            throw new RuntimeException("Failed to delete category: " + e.getMessage(), e);
        }
    }
} 