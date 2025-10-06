package online.wooden.market.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.blog.BlogGetBySlugResponse;
import online.wooden.market.entity.dto.blog.BlogDto;
import online.wooden.market.entity.dto.blog.BlogGetByTypeResponse;
import online.wooden.market.entity.dto.user.UserDto;
import online.wooden.market.entity.model.Blog;
import online.wooden.market.service.BlogService;
import online.wooden.market.service.LogService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

import static online.wooden.market.utils.Constant.*;

@Slf4j
@RestController
@RequestMapping("api/v1/user/blog")
@Tag(name = "Blog", description = "Blog controller")
public class BlogController {
    private final BlogService blogService;
    private final ModelMapper modelMapper;
    private final LogService logService;
    private final String env;

    public BlogController(BlogService blogService, ModelMapper modelMapper, LogService logService, String env) {
        this.blogService = blogService;
        this.modelMapper = modelMapper;
        this.logService = logService;
        this.env = env;
    }

    private BlogDto toDto(Blog Blog) {
        return modelMapper.map(Blog, BlogDto.class);
    }

    @Operation(description = "Get pageable endpoint for Blog", summary = "Get pageable Blog")
    @GetMapping("/pageable")
    public ResponseEntity<ApiResponse<Page<BlogDto>>> getPageable(Pageable pageable) {
        Page<Blog> page = blogService.getAll() instanceof Page ? (Page<Blog>) blogService.getAll() : Page.empty();
        Page<BlogDto> pageDto = page.map(this::toDto);
        return ResponseEntity.ok(ApiResponse.success(pageDto));
    }

    @Operation(description = "Get all endpoint for Blog", summary = "Get all Blog")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BlogDto>>> getAll(@RequestParam(required = false) String search, HttpServletRequest request) {
        logService.save(env, request, LOG_VIEW_BLOG, LOG_ACTION_GET_ALL_BLOG, HttpMethod.GET.name());
        List<BlogDto> dtos = blogService.getAll().stream()
                .filter(Blog -> search == null || search.isEmpty() || Blog.getTitle().toLowerCase().contains(search.toLowerCase()))
                .map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @Operation(description = "Get by slug endpoint for Blog", summary = "Get Blog by slug")
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<BlogGetBySlugResponse>> getBySlug(@PathVariable String slug, HttpServletRequest request) {
        logService.save(env, request, LOG_VIEW_BLOG, LOG_ACTION_GET_DETAIL_BLOG, HttpMethod.GET.name());
        BlogGetBySlugResponse response = new BlogGetBySlugResponse();
        Blog blog = blogService.getBySlug(slug);
        if (blog == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), "Bài viết không tồn tại"));
        }

        List<BlogDto> blogs = blogService.getByType(blog.getType()).stream().filter(b -> !b.getSlug().equals(slug)).map(this::toDto).toList();
        response.setBlog(modelMapper.map(blog, BlogDto.class));
        response.setRelatedBlogs(blogs);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @Operation(description = "Get by slug endpoint for Blog", summary = "Get Blog by type")
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<BlogGetByTypeResponse>> getByType(@PathVariable String type, HttpServletRequest request) {
        logService.save(env, request, LOG_VIEW_BLOG, LOG_ACTION_GET_ALL_BLOG, HttpMethod.GET.name());
        List<BlogDto> blogList = blogService.getByType(type).stream().map((blog)->{
            BlogDto blogDto = modelMapper.map(blog, BlogDto.class);
            if(blog.getUpdatedBy()!= null){
                UserDto userDto = modelMapper.map(blog.getUpdatedBy(), UserDto.class);
                blogDto.setUpdatedBy(userDto);
            }
            return blogDto;
        }).collect(Collectors.toList());
        BlogGetByTypeResponse blogGetByTypeResponse = new BlogGetByTypeResponse();
        blogGetByTypeResponse.setBlogList(blogList);

        List<BlogDto> blogRecommendList = blogService.getRecommendBlog(type).stream().map(this::toDto).toList();
        blogGetByTypeResponse.setBlogRecommendList(blogRecommendList);

        return ResponseEntity.ok(ApiResponse.success(blogGetByTypeResponse));
    }
} 