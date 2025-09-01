package online.wooden.market.controller;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.log.LogGetResponse;
import online.wooden.market.entity.model.Log;
import online.wooden.market.service.LogService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/log")
@AllArgsConstructor
public class LogController {
    private final LogService logService;
    private final ModelMapper modelMapper;

    private LogGetResponse toDto(Log log) {
        return modelMapper.map(log, LogGetResponse.class);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LogGetResponse>>> getAll() {
        List<LogGetResponse> dtos = logService.getAll().stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LogGetResponse>> getById(@PathVariable Integer id) {
        Log log = logService.getById(id);
        if (log == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(),"Not found"));
        return ResponseEntity.ok(ApiResponse.success(toDto(log)));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<LogGetResponse>>> getByProductId(@PathVariable Integer productId) {
        List<LogGetResponse> dtos = logService.getByProductId(productId).stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }
} 