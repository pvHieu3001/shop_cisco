package online.wooden.market.controller;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.coupon.CouponRequestDto;
import online.wooden.market.entity.dto.coupon.CouponResponseDto;
import online.wooden.market.entity.model.Coupon;
import online.wooden.market.service.CouponService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/coupon")
@AllArgsConstructor
public class CouponController {
    private final CouponService couponService;
    private final ModelMapper modelMapper;

    private CouponResponseDto toDto(Coupon coupon) {
        return modelMapper.map(coupon, CouponResponseDto.class);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CouponResponseDto>>> getAll() {
        List<CouponResponseDto> dtos = couponService.getAll().stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponResponseDto>> getById(@PathVariable Integer id) {
        Coupon coupon = couponService.getById(id);
        if (coupon == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), "Not found"));
        return ResponseEntity.ok(ApiResponse.success(toDto(coupon)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CouponResponseDto>> create(@RequestBody CouponRequestDto dto) {
        Coupon coupon = modelMapper.map(dto, Coupon.class);
        Coupon saved = couponService.save(coupon);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", toDto(saved)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponResponseDto>> update(@RequestBody CouponRequestDto dto, @PathVariable Integer id) {
        Coupon coupon = modelMapper.map(dto, Coupon.class);
        Coupon updated = couponService.update(coupon, id);
        if (updated == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(),"Not found"));
        return ResponseEntity.ok(ApiResponse.success("Updated", toDto(updated)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        couponService.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success("Deleted", null));
    }
} 