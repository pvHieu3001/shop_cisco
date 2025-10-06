package online.wooden.market.repository;

import online.wooden.market.entity.model.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogRepository extends JpaRepository<Log, Integer> {
}