package online.wooden.market.entity.dto.blog;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import online.wooden.market.entity.dto.user.UserDto;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogDto {
    private Integer id;
    private String title;
    private String description;
    private String content;
    private String image;
    private String slug;
    private Boolean status;
    private String type;
    private Boolean isDisplayHot;
    private UserDto updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 