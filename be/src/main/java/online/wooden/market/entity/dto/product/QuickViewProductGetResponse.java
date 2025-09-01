package online.wooden.market.entity.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import online.wooden.market.entity.dto.category.CategoryDto;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class QuickViewProductGetResponse {
    private List<ProductDto> listProduct;
    private CategoryDto category;
}
