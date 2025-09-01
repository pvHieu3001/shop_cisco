package online.wooden.market.service;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.model.Category;
import online.wooden.market.exception.CJNotFoundException;
import online.wooden.market.repository.CategoryRepository;
import online.wooden.market.utils.CustomCodeException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public Category getById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CJNotFoundException(CustomCodeException.CODE_400, "Danh mục không tồn tại"));
    }

    @Override
    @Transactional(readOnly = true)
    public Category getBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    @Transactional
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Category update(Category category, Integer id) {
        Category categoryDb = getById(id);
        categoryDb.setName(category.getName());
        categoryDb.setSlug(category.getSlug());
        categoryDb.setParentId(category.getParentId());
        categoryDb.setStatus(category.getStatus());
        categoryDb.setIsQuickView(category.getIsQuickView());
        categoryDb.setImage(category.getImage());
        categoryDb.setContent(category.getContent());
        categoryDb.setDescription(category.getDescription());
        return categoryRepository.save(categoryDb);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        Category categoryDb = getById(id);
        categoryRepository.delete(categoryDb);
    }

    @Transactional
    @Override
    public void refreshProductCount(Set<Integer> ids) {
        categoryRepository.updateNumberProductByIds(ids);
    }
} 