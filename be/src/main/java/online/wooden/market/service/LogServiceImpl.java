package online.wooden.market.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import online.wooden.market.entity.dto.log.LogDto;
import online.wooden.market.entity.model.Log;
import online.wooden.market.repository.LogRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class LogServiceImpl implements LogService {
    private final LogRepository logRepository;
    private final ModelMapper modelMapper;

    @Override
    public Log getById(Integer id) {
        return logRepository.findById(id).orElse(null);
    }

    @Override
    public List<Log> getAll() {
        return logRepository.findAll();
    }

    @Override
    public void save(String env, HttpServletRequest request, Integer userId, Integer productId, String name, String action) {
        if(!env.equals("dev")){
            String ipAddress = request.getHeader("X-Forwarded-For");
            if (ipAddress == null || ipAddress.isEmpty()) {
                ipAddress = request.getRemoteAddr();
            }
            String userAgent = request.getHeader("User-Agent");
            LogDto dto = new LogDto(userId, productId, name, action, ipAddress, userAgent);
            Log log = modelMapper.map(dto, Log.class);
            logRepository.save(log);
        }
    }

    @Override
    public Log update(Log log, Integer id) {
        Optional<Log> optionalLog = logRepository.findById(id);
        if (optionalLog.isPresent()) {
            Log existing = optionalLog.get();
            existing.setUserId(log.getUserId());
            existing.setName(log.getName());
            existing.setAction(log.getAction());
            existing.setIpAddress(log.getIpAddress());
            existing.setUserAgent(log.getUserAgent());
            // Nếu có trường productId thì set luôn
            try {
                java.lang.reflect.Method setProductId = existing.getClass().getMethod("setProductId", Integer.class);
                setProductId.invoke(existing, log.getClass().getMethod("getProductId").invoke(log));
            } catch (Exception ignore) {}
            return logRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteById(Integer id) {
        logRepository.deleteById(id);
    }

    @Override
    public List<Log> getByProductId(Integer productId) {
        return logRepository.findByProductId(productId);
    }
} 