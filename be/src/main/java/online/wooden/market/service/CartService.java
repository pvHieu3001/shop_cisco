package online.wooden.market.service;

import online.wooden.market.entity.model.Cart;
import java.util.List;

public interface CartService {
    Cart getById(Integer id);
    List<Cart> getAll();
    Cart save(Cart cart);
    Cart update(Cart cart, Integer id);
    void deleteById(Integer id);
} 