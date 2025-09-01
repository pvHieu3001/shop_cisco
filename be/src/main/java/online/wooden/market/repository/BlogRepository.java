package online.wooden.market.repository;

import online.wooden.market.entity.model.Blog;
import online.wooden.market.entity.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {
    Blog findBySlugAndStatus(String slug, Boolean status);
    List<Blog> findByTypeAndStatus(String type, Boolean status);
    @Query("SELECT c FROM Blog c " +
            "WHERE (:status IS NULL OR c.status = :status) " +
            "AND (:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:isDisplayHot IS NULL OR c.isDisplayHot = :isDisplayHot)")
    List<Blog> filterBlog(@Param("status") Boolean status,
                              @Param("search") String search,
                              @Param("isDisplayHot") Boolean isDisplayHot);

    @Query("SELECT c FROM Blog c " +
            "WHERE c.status = true " +
            "AND c.type = :type " +
            "AND c.isDisplayHot = true " +
            "ORDER BY createdAt DESC " +
            "LIMIT 4")
    List<Blog> getRecommendBlog(@Param("type") String type);
}