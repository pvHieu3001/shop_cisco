package online.wooden.market.service;

import online.wooden.market.entity.dto.product.QuickViewProductGetResponse;
import online.wooden.market.entity.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
	List<Product> getRecommendProduct();
	List<Product> getAll();
	Product save(final Product product);
	Product update(final Product product, final Integer id, final Integer catId);
	void deleteById(final Integer id);
	Page<Product> finadAll(Pageable pageable);
	Product getById(Integer id);
	List<Product> getByCategoryId(Integer categoryId);
	Product getBySlug(String slug);
	List<Product> filterProduct(String status, String search, Boolean isDisplayHot);
  	List<QuickViewProductGetResponse> getQuickViewProduct();
}
