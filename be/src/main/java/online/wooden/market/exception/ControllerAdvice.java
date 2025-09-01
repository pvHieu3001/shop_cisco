package online.wooden.market.exception;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import online.wooden.market.entity.dto.ApiResponse;
import online.wooden.market.entity.dto.ErrorDto;

@Slf4j
@RestControllerAdvice
public class ControllerAdvice {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.warn("Validation failed: {}", ex.getMessage());
        
        List<ErrorDto> errors = ex.getBindingResult().getAllErrors().stream()
                .map((error) -> {
                    String fieldName = ((FieldError) error).getField();
                    String errorMessage = error.getDefaultMessage();
                    log.warn("Field '{}' validation failed: {}", fieldName, errorMessage);
                    
                    return ErrorDto.builder()
                            .code("400")
                            .field(fieldName)
                            .message(errorMessage)
                            .build();
                })
                .sorted(Comparator.comparing(ErrorDto::getField))
                .collect(Collectors.toList());
        
        ValidationErrorResponse response = new ValidationErrorResponse(400, "Validation failed", errors);
        log.warn("Returning validation error response: {}", response);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> runtimeExceptionHandler(RuntimeException exception) {
        log.error("Runtime exception occurred: {}", exception.getMessage(), exception);
        ApiResponse<Object> error = ApiResponse.error(500, exception.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(value = CJNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> notFoundExceptionHandler(CJNotFoundException exception) {
        log.warn("Resource not found: {}", exception.getMessage());
        ApiResponse<Object> error = ApiResponse.error(404, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse<Object>> generalExceptionHandler(Exception exception) {
        log.error("Unexpected exception occurred: {}", exception.getMessage(), exception);
        ApiResponse<Object> error = ApiResponse.error(500, "An unexpected error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    // Inner class cho lỗi validate chuẩn hóa
    public static class ValidationErrorResponse {
        private int code;
        private String message;
        private List<ErrorDto> errors;

        public ValidationErrorResponse(int code, String message, List<ErrorDto> errors) {
            this.code = code;
            this.message = message;
            this.errors = errors;
        }
        
        public int getCode() { return code; }
        public String getMessage() { return message; }
        public List<ErrorDto> getErrors() { return errors; }
        
        @Override
        public String toString() {
            return "ValidationErrorResponse{" +
                    "code=" + code +
                    ", message='" + message + '\'' +
                    ", errors=" + errors +
                    '}';
        }
    }
}
