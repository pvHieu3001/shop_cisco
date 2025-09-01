package online.wooden.market.entity.dto.category;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryPostRequest {
    private Integer parentId;
    @NotBlank(message = "Name is required")
    private String name;
    private String content;
    private String description;
    private String slug;
    private Boolean status;
    private Boolean isQuickView;
    private MultipartFile imageFile;
    private String image;
} 