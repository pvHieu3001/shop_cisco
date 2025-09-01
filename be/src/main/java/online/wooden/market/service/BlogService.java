package online.wooden.market.service;

import online.wooden.market.entity.model.Blog;
import online.wooden.market.entity.model.Category;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

public interface BlogService {
    Blog getById(Integer id);
    Blog getBySlug(String slug);
    List<Blog> getAll();
    Blog save(Blog blog);
    Blog update(Blog blog, Integer id);
    void deleteById(Integer id);
    List<Blog> getByType(String type);
    List<Blog> filterProduct(Boolean status, String search, Boolean isDisplayHot);
    List<Blog> getRecommendBlog(String type);
}