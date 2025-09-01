package online.wooden.market.service;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.model.Order;
import online.wooden.market.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;

    @Override
    public Order getById(Integer id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @Override
    public Order save(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order update(Order order, Integer id) {
        Optional<Order> optional = orderRepository.findById(id);
        if (optional.isPresent()) {
            Order existing = optional.get();
            existing.setSubTotal(order.getSubTotal());
            existing.setDiscountAmount(order.getDiscountAmount());
            existing.setTotalAmount(order.getTotalAmount());
            existing.setCouponId(order.getCouponId());
            existing.setStatus(order.getStatus());
            return orderRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteById(Integer id) {
        orderRepository.deleteById(id);
    }
} 