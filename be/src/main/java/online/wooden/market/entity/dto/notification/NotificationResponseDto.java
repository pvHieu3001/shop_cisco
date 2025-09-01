package online.wooden.market.entity.dto.notification;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDto {
    private Integer id;
    private String title;
    private String content;
    private Integer userId;
    private String type;
    private Boolean isRead;
    private Boolean isDeleted;
} 