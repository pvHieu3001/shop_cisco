# Online Wooden API

## Tổng quan

Đây là project backend cho hệ thống sản phẩm online, xây dựng bằng Spring Boot.

## Tài liệu API (Swagger/OpenAPI)

Project đã tích hợp sẵn Swagger UI để tự động sinh tài liệu API từ code.

### Truy cập tài liệu API

1. **Khởi động ứng dụng Spring Boot**
2. Mở trình duyệt và truy cập:
   - [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   - hoặc [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

### Chức năng của Swagger UI

- Xem mô tả chi tiết các endpoint (method, path, request/response, mã lỗi...)
- Thử gọi API trực tiếp trên giao diện web (Try it out)
- Xem mô tả các model (DTO, entity)
- Hỗ trợ nhập JWT token để test các API bảo mật

### Cấu hình bảo mật

- Các endpoint `/swagger-ui/**`, `/v3/api-docs/**` mặc định được mở public (có thể cấu hình lại trong SecurityConfig nếu muốn giới hạn quyền truy cập).

### Tùy chỉnh tài liệu

- Có thể thêm mô tả chi tiết cho từng API bằng các annotation như `@Operation`, `@Parameter`, `@Schema` trong code controller/DTO.
- Thông tin tổng quan (title, contact, version, server, security...) được cấu hình trong file [`OpenApiConfig.java`](src/main/java/online/wooden/market/config/OpenApiConfig.java).

### Tham khảo thêm

- [Springdoc OpenAPI Documentation](https://springdoc.org/)
- [Swagger UI Usage](https://swagger.io/tools/swagger-ui/)

---

## Các endpoint chính

- Quản lý user, product, category, cart, coupon, order, payment, notification, log...
- Tất cả đều có tài liệu chi tiết trên Swagger UI.

---

## Liên hệ

- Người phát triển: Giancarlo
- Email: giancarlo@contact.com
