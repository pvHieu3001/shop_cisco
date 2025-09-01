package online.wooden.market.entity.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * HAQ Answer
 */

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "blogs")
@NoArgsConstructor
public class Blog extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false, length = 255)
    private String title;
    private String description;
    @Column(columnDefinition = "TEXT")
    private String content;
    private String image;
    private String slug;
    private Boolean status;
    private String type;
    private Boolean isDisplayHot;
}
