package online.wooden.market.entity.dto.blog;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private String content;
    private String image;
    private MultipartFile imageFile;
    private String slug;
    private Boolean status;
    private Boolean isDisplayHot;
    private String type;
} 