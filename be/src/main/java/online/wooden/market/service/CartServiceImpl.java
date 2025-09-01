package online.wooden.market.service;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.model.Cart;
import online.wooden.market.repository.CartRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;

    @Override
    public Cart getById(Integer id) {
        return cartRepository.findById(id).orElse(null);
    }

    @Override
    public List<Cart> getAll() {
        return cartRepository.findAll();
    }

    @Override
    public Cart save(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    public Cart update(Cart cart, Integer id) {
        Optional<Cart> optionalCart = cartRepository.findById(id);
        if (optionalCart.isPresent()) {
            Cart existing = optionalCart.get();
            existing.setUserId(cart.getUserId());
            existing.setCouponId(cart.getCouponId());
            return cartRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteById(Integer id) {
        cartRepository.deleteById(id);
    }
} 