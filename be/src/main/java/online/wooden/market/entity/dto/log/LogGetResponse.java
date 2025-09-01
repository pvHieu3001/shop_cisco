package online.wooden.market.entity.dto.log;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogGetResponse {
    private Integer id;
    private Integer userId;
    private Integer productId;
    private String name;
    private String action;
    private String ipAddress;
    private String userAgent;
} 