package online.wooden.market.controller;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.payment.PaymentRequestDto;
import online.wooden.market.entity.dto.payment.PaymentResponseDto;
import online.wooden.market.entity.model.Payment;
import online.wooden.market.service.PaymentService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/payment")
@AllArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    private final ModelMapper modelMapper;

    private PaymentResponseDto toDto(Payment payment) {
        return modelMapper.map(payment, PaymentResponseDto.class);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentResponseDto>>> getAll() {
        List<PaymentResponseDto> dtos = paymentService.getAll().stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> getById(@PathVariable Integer id) {
        Payment payment = paymentService.getById(id);
        if (payment == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), "Not found"));
        return ResponseEntity.ok(ApiResponse.success(toDto(payment)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponseDto>> create(@RequestBody PaymentRequestDto dto) {
        Payment payment = modelMapper.map(dto, Payment.class);
        Payment saved = paymentService.save(payment);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", toDto(saved)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> update(@RequestBody PaymentRequestDto dto, @PathVariable Integer id) {
        Payment payment = modelMapper.map(dto, Payment.class);
        Payment updated = paymentService.update(payment, id);
        if (updated == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(),"Not found"));
        return ResponseEntity.ok(ApiResponse.success("Updated", toDto(updated)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        paymentService.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success("Deleted", null));
    }
} 