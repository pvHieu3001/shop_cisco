package online.wooden.market.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.blog.BlogDto;
import online.wooden.market.entity.dto.blog.BlogPostRequest;
import online.wooden.market.entity.dto.blog.BlogPutRequest;
import online.wooden.market.entity.model.Blog;
import online.wooden.market.service.BlogService;
import online.wooden.market.utils.DataUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
@RequestMapping("api/v1/admin/blog")
@Tag(name = "Blog", description = "Blog controller")
public class AdminBlogController {
    private final BlogService blogService;
    private final ModelMapper modelMapper;
    private final String resourceFolder;
    private Path uploadDir;

    // Constructor injection with qualifier for the upload URL bean
    public AdminBlogController(BlogService blogService, ModelMapper modelMapper, @Qualifier("uploadUrl") String resourceFolder) {
        this.blogService = blogService;
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

    private BlogDto toDto(Blog blog) {
        return modelMapper.map(blog, BlogDto.class);
    }

    @Operation(description = "Get all endpoint for Blog", summary = "Get all Blog")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BlogDto>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String isDisplayHot) {
        Boolean displayHot =
                isDisplayHot == null || isDisplayHot.isBlank() ? null :
                        "1".equals(isDisplayHot) ? Boolean.TRUE :
                                "0".equals(isDisplayHot) ? Boolean.FALSE : null;
        List<BlogDto> dtos = blogService.filterProduct(
                !String.valueOf(status).isEmpty() ? DataUtils.convertStatus(status) : null,
                !String.valueOf(search).isEmpty() ? search : null,
                displayHot
        ).stream()
                .filter(blog -> search == null || search.isEmpty() || blog.getTitle().toLowerCase().contains(search.toLowerCase()))
                .map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @Operation(description = "Get by id endpoint for Blog", summary = "Get Blog by id")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogDto>> getById(@PathVariable Integer id) {
        Blog Blog = blogService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(toDto(Blog)));
    }

    @Operation(description = "Create Blog", summary = "Create Blog")
    @PostMapping
    public ResponseEntity<ApiResponse<BlogDto>> create(@ModelAttribute BlogPostRequest dto) {
        try {
            log.info("Creating Blog with title: {}", dto.getTitle());
            
            // Validate required fields
            if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
                log.error("Blog title is null or empty");
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Blog title is required"));
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


            dto.setSlug(DataUtils.toSlug(dto.getTitle()));
            Blog Blog = modelMapper.map(dto, Blog.class);
            Blog saved = blogService.save(Blog);
            
            log.info("Blog created successfully with ID: {}", saved.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", toDto(saved)));
        } catch (IOException e) {
            log.error("Failed to save image file", e);
            throw new RuntimeException("Failed to save image file", e);
        } catch (Exception e) {
            log.error("Failed to create Blog", e);
            throw new RuntimeException("Failed to create Blog: " + e.getMessage(), e);
        }
    }

    @Operation(description = "Update Blog", summary = "Update Blog")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogDto>> update(@Valid @ModelAttribute BlogPutRequest dto, @PathVariable Integer id) {
        try {
            log.info("Updating Blog with ID: {}, title: {}", id, dto.getTitle());
            
            // Validate required fields
            if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
                log.error("Blog title is null or empty");
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Blog title is required"));
            }

            Blog existingBlog = blogService.getById(id);

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
                dto.setImage(existingBlog.getImage());
            }

            dto.setSlug(DataUtils.toSlug(dto.getTitle()));
            Blog Blog = modelMapper.map(dto, Blog.class);
            Blog updated = blogService.update(Blog, id);
            
            log.info("Blog updated successfully with ID: {}", updated.getId());
            return ResponseEntity.ok(ApiResponse.success("Updated", toDto(updated)));
        } catch (IOException e) {
            log.error("Failed to save image file", e);
            throw new RuntimeException("Failed to save image file", e);
        } catch (Exception e) {
            log.error("Failed to update Blog", e);
            throw new RuntimeException("Failed to update Blog: " + e.getMessage(), e);
        }
    }

    @Operation(description = "Delete Blog", summary = "Delete Blog")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            log.info("Deleting Blog with ID: {}", id);
            blogService.deleteById(id);
            log.info("Blog deleted successfully with ID: {}", id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success("Deleted", null));
        } catch (Exception e) {
            log.error("Failed to delete Blog with ID: {}", id, e);
            throw new RuntimeException("Failed to delete Blog: " + e.getMessage(), e);
        }
    }
} 