package online.wooden.market.controller;

import lombok.AllArgsConstructor;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.cart.CartRequestDto;
import online.wooden.market.entity.dto.cart.CartResponseDto;
import online.wooden.market.entity.model.Cart;
import online.wooden.market.service.CartService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/cart")
@AllArgsConstructor
public class CartController {
    private final CartService cartService;
    private final ModelMapper modelMapper;

    private CartResponseDto toDto(Cart cart) {
        return modelMapper.map(cart, CartResponseDto.class);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartResponseDto>>> getAll() {
        List<CartResponseDto> dtos = cartService.getAll().stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CartResponseDto>> getById(@PathVariable Integer id) {
        Cart cart = cartService.getById(id);
        if (cart == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(),"Not found"));
        return ResponseEntity.ok(ApiResponse.success(toDto(cart)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CartResponseDto>> create(@RequestBody CartRequestDto dto) {
        Cart cart = modelMapper.map(dto, Cart.class);
        Cart saved = cartService.save(cart);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Created", toDto(saved)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CartResponseDto>> update(@RequestBody CartRequestDto dto, @PathVariable Integer id) {
        Cart cart = modelMapper.map(dto, Cart.class);
        Cart updated = cartService.update(cart, id);
        if (updated == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(HttpStatus.NOT_FOUND.value(),"Not found"));
        return ResponseEntity.ok(ApiResponse.success("Updated", toDto(updated)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        cartService.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success("Deleted", null));
    }
} 