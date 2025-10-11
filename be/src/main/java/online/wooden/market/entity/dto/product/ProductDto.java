package online.wooden.market.entity.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import online.wooden.market.entity.dto.category.CategoryDto;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductDto {
    private Integer id;
    private String imageUrl;
    private String name;
    private String description;
    private String productBenefits;
    private String sourceUrl;
    private String slug;
    private Integer price;
    private String status;
    private Boolean isDisplayHot;
    private Double rating;
    private Integer totalRating;
    protected LocalDateTime createdAt;
    protected LocalDateTime updatedAt;

    protected CategoryDto category;
    protected String userCreate;
    protected String userUpdate;
}
