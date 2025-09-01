package online.wooden.market.repository;

import java.util.List;
import java.util.Optional;

import online.wooden.market.entity.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Integer>{
    Optional<Product> findByName(final String name);

    List<Product> findAllByOrderByIdDesc();
    
    List<Product> findByCategoryIdOrderByIdDesc(Integer categoryId);

    Optional<Product> findBySlug(String slug);

    @Query("SELECT c FROM Product c " +
            "WHERE (:status IS NULL OR c.status = :status) " +
            "AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:isDisplayHot IS NULL OR c.isDisplayHot = :isDisplayHot)")
    List<Product> filterProduct(@Param("status") String status,
                              @Param("search") String search,
                              @Param("isDisplayHot") Boolean isDisplayHot);

    @Query("SELECT c FROM Product c WHERE c.isDisplayHot = true")
    List<Product> getRecommendProduct();
}
