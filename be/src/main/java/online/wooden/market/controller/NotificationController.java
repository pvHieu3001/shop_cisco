package online.wooden.market.controller;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.notification.NotificationRequestDto;
import online.wooden.market.entity.dto.notification.NotificationResponseDto;
import online.wooden.market.entity.model.Notification;
import online.wooden.market.service.NotificationService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/notification")
@AllArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;

    private NotificationResponseDto toDto(Notification notification) {
        return modelMapper.map(notification, NotificationResponseDto.class);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponseDto>>> getAll() {
        List<NotificationResponseDto> dtos = notificationService.getAll().stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NotificationResponseDto>> getById(@PathVariable String id) {
        Notification notification = notificationService.getById(id);
        if (notification == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), "Not found"));
        return ResponseEntity.ok(ApiResponse.success(toDto(notification)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponseDto>> create(@RequestBody NotificationRequestDto dto) {
        Notification notification = modelMapper.map(dto, Notification.class);
        Notification saved = notificationService.save(notification);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", toDto(saved)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NotificationResponseDto>> update(@RequestBody NotificationRequestDto dto, @PathVariable String id) {
        Notification notification = modelMapper.map(dto, Notification.class);
        Notification updated = notificationService.update(notification, id);
        if (updated == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(),"Not found"));
        return ResponseEntity.ok(ApiResponse.success("Updated", toDto(updated)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        notificationService.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success("Deleted", null));
    }
} 