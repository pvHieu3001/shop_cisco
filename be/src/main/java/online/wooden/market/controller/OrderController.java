package online.wooden.market.controller;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.order.OrderRequestDto;
import online.wooden.market.entity.dto.order.OrderResponseDto;
import online.wooden.market.entity.model.Order;
import online.wooden.market.service.OrderService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/order")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final ModelMapper modelMapper;

    private OrderResponseDto toDto(Order order) {
        return modelMapper.map(order, OrderResponseDto.class);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getAll() {
        List<OrderResponseDto> dtos = orderService.getAll().stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getById(@PathVariable Integer id) {
        Order order = orderService.getById(id);
        if (order == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), "Not found"));
        return ResponseEntity.ok(ApiResponse.success(toDto(order)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponseDto>> create(@RequestBody OrderRequestDto dto) {
        Order order = modelMapper.map(dto, Order.class);
        Order saved = orderService.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", toDto(saved)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDto>> update(@RequestBody OrderRequestDto dto, @PathVariable Integer id) {
        Order order = modelMapper.map(dto, Order.class);
        Order updated = orderService.update(order, id);
        if (updated == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(),"Not found"));
        return ResponseEntity.ok(ApiResponse.success("Updated", toDto(updated)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        orderService.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success("Deleted", null));
    }
} 