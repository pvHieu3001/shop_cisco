package online.wooden.market.repository;

import online.wooden.market.entity.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    boolean existsByName(String name);
    boolean existsBySlug(String slug);
    Category findBySlug(String slug);

    @Modifying
    @Transactional
    @Query(value = """
        UPDATE categories c
        SET number_product = (
            SELECT COUNT(*) FROM products co WHERE co.category_id = c.id and co.status = 'active'
        )
        WHERE c.id IN (:ids)
        """, nativeQuery = true)
    void updateNumberProductByIds(@Param("ids") Set<Integer> ids);

    @Query(value = """
        SELECT * FROM categories WHERE is_quick_view = true AND status = true;
        """, nativeQuery = true)
    List<Category> findByIsQuickViewTrueAndStatusTrue();
}