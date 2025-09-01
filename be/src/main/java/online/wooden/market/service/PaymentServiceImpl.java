package online.wooden.market.service;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.model.Payment;
import online.wooden.market.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;

    @Override
    public Payment getById(Integer id) {
        return paymentRepository.findById(id).orElse(null);
    }

    @Override
    public List<Payment> getAll() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public Payment update(Payment payment, Integer id) {
        Optional<Payment> optional = paymentRepository.findById(id);
        if (optional.isPresent()) {
            Payment existing = optional.get();
            existing.setOrderId(payment.getOrderId());
            existing.setAmount(payment.getAmount());
            existing.setPaymentMethod(payment.getPaymentMethod());
            existing.setTransactionId(payment.getTransactionId());
            existing.setPaymentStatus(payment.getPaymentStatus());
            return paymentRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteById(Integer id) {
        paymentRepository.deleteById(id);
    }
} 