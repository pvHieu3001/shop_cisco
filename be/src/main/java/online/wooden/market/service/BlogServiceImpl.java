package online.wooden.market.service;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.model.Blog;
import online.wooden.market.entity.model.Category;
import online.wooden.market.exception.CJNotFoundException;
import online.wooden.market.repository.BlogRepository;
import online.wooden.market.utils.CustomCodeException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;

    @Override
    @Transactional(readOnly = true)
    public Blog getById(Integer id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new CJNotFoundException(CustomCodeException.CODE_400, "Danh mục không tồn tại"));
    }

    @Override
    @Transactional(readOnly = true)
    public Blog getBySlug(String slug) {
        return blogRepository.findBySlugAndStatus(slug, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Blog> getAll() {
        return blogRepository.findAll();
    }

    @Override
    @Transactional
    public Blog save(Blog blog) {
        return blogRepository.save(blog);
    }

    @Override
    @Transactional
    public Blog update(Blog blog, Integer id) {
        Blog blogDB = getById(id);
        blogDB.setContent(blog.getContent());
        blogDB.setTitle(blog.getTitle());
        blogDB.setDescription(blog.getDescription());
        blogDB.setType(blog.getType());
        blogDB.setSlug(blog.getSlug());
        blogDB.setStatus(blog.getStatus());
        blogDB.setIsDisplayHot(blog.getIsDisplayHot());
        blogDB.setImage(blog.getImage());
        return blogRepository.save(blogDB);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        Blog categoryDb = getById(id);
        blogRepository.delete(categoryDb);
    }

    @Override
    public List<Blog> getByType(String type) {
        return blogRepository.findByTypeAndStatus(type, true);
    }

    @Override
    public List<Blog> filterProduct(Boolean status, String search, Boolean isDisplayHot) {
        return blogRepository.filterBlog(status, search, isDisplayHot);
    }

    @Override
    public List<Blog> getRecommendBlog(String type) {
        return blogRepository.getRecommendBlog(type);
    }

}