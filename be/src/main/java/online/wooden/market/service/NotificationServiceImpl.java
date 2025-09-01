package online.wooden.market.service;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.model.Notification;
import online.wooden.market.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;

    @Override
    public Notification getById(String id) {
        return notificationRepository.findById(id).orElse(null);
    }

    @Override
    public List<Notification> getAll() {
        return notificationRepository.findAll();
    }

    @Override
    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public Notification update(Notification notification, String id) {
        Optional<Notification> optional = notificationRepository.findById(id);
        if (optional.isPresent()) {
            Notification existing = optional.get();
            existing.setTitle(notification.getTitle());
            existing.setContent(notification.getContent());
            existing.setUserId(notification.getUserId());
            existing.setType(notification.getType());
            existing.setIsRead(notification.getIsRead());
            existing.setIsDeleted(notification.getIsDeleted());
            return notificationRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteById(String id) {
        notificationRepository.deleteById(id);
    }
} 