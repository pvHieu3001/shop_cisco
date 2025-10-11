package online.wooden.market.service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import online.wooden.market.entity.dto.category.CategoryDto;
import online.wooden.market.entity.dto.product.ProductDto;
import online.wooden.market.entity.dto.product.QuickViewProductGetResponse;
import online.wooden.market.entity.model.Category;
import online.wooden.market.entity.model.Product;
import online.wooden.market.repository.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import online.wooden.market.exception.CJNotFoundException;
import online.wooden.market.repository.ProductRepository;
import online.wooden.market.utils.CustomCodeException;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    private ProductDto toDto(Product product) {
        return modelMapper.map(product, ProductDto.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getRecommendProduct() {
        return productRepository.getRecommendProduct();

    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAll() {
        return productRepository.findAllByOrderByIdDesc();
    }

    @Override
    @Transactional
    public Product save(Product product) {
        Assert.notNull(product, "Product cannot be null");
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product update(Product product, Integer id, Integer catId) {

        Assert.notNull(id, "id cannot be null");
        Assert.notNull(product, "Product cannot be null");

        Product productDb = productRepository.findById(id)
                .orElseThrow(() -> new CJNotFoundException(CustomCodeException.CODE_400, "Product not found"));

        Category category = categoryRepository.findById(catId)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
        productDb.setName(product.getName());
        productDb.setDescription(product.getDescription());
        productDb.setProductBenefits(product.getProductBenefits());
        productDb.setPrice(product.getPrice());
        productDb.setSlug(product.getSlug());
        productDb.setRating(product.getRating());
        productDb.setStatus(product.getStatus());
        productDb.setCategory(category);
        productDb.setSourceUrl(product.getSourceUrl());
        productDb.setImageUrl(product.getImageUrl() != null && !product.getImageUrl().isEmpty() ? product.getImageUrl() : productDb.getImageUrl());
        productDb.setIsDisplayHot(product.getIsDisplayHot());
        Product newProduct = productRepository.save(productDb);


        categoryRepository.updateNumberProductByIds(
                Stream.of(product.getCategory() !=null ? product.getCategory().getId() : null, catId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet()));

        return newProduct;
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        Assert.notNull(id, "id cannot be null");
        Product ProductDb = productRepository.findById(id)
                .orElseThrow(() -> new CJNotFoundException(CustomCodeException.CODE_400, "Product not found"));
        productRepository.delete(ProductDb);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Product> finadAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Product getById(Integer id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public Product getBySlug(String slug) {
        return productRepository.findBySlug(slug).orElse(null);
    }

    @Override
    public List<Product> filterProduct(String status, String search, Boolean isDisplayHot) {
        return productRepository.filterProduct(status, search, isDisplayHot);
    }

    @Override
    public List<QuickViewProductGetResponse> getQuickViewProduct() {
        List<QuickViewProductGetResponse> quickViewProductDtoList = new ArrayList<>();
        List<Category> categoryList =  categoryRepository.findByIsQuickViewTrueAndStatusTrue();
        categoryList.forEach((item)->{
            QuickViewProductGetResponse quickViewProductDto = new QuickViewProductGetResponse();
            quickViewProductDto.setCategory(modelMapper.map(item, CategoryDto.class));
            List<Product> productList =  productRepository.findByCategoryIdOrderByIdDesc(item.getId());
            quickViewProductDto.setListProduct(productList.stream().map(this::toDto).toList());
            quickViewProductDtoList.add(quickViewProductDto);
        });
        return quickViewProductDtoList;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getByCategoryId(Integer categoryId) {
        Assert.notNull(categoryId, "categoryId cannot be null");
        return productRepository.findByCategoryIdOrderByIdDesc(categoryId);
    }
}
