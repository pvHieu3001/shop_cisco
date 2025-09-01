package online.wooden.market.entity.dto.category;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Integer id;
    private Integer parentId;
    private String name;
    private String content;
    private String description;
    private String slug;
    private Boolean status;
    private Boolean isQuickView;
    private String image;
    private Integer numberProduct;
} 