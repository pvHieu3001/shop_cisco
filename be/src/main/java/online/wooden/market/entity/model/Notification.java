package online.wooden.market.entity.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Data
@Entity
@Table(name = "notifications")
@NoArgsConstructor
public class Notification {
    @Id
    @Column(unique = true, nullable = false)
    private Integer id;
    private Integer userId;
    private String title;
    @NotNull
    protected String content;
    @NotNull
    private String type;
    private Boolean isRead;
    private Boolean isDeleted;
}
