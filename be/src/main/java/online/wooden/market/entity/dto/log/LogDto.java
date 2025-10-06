package online.wooden.market.entity.dto.log;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogDto {
    private String pageId;
    private String name;
    private String action;
    private String ipAddress;
    private String userAgent;
    private String referer;
    private String device;
    private String url;
    private String method;
} 