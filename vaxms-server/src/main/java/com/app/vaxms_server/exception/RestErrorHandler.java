package com.app.vaxms_server.exception;

import com.app.vaxms_server.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class RestErrorHandler {
    private static final Logger log = LoggerFactory.getLogger(RestErrorHandler.class);

    @ExceptionHandler(MessageException.class)
    @ResponseStatus(HttpStatus.EXPECTATION_FAILED)
    @ResponseBody
    public Object processValidationError(MessageException ex) {
        String result = ex.getDefaultMessage();
        System.out.println("###########" + result);
        return ex;
    }
//
//    @ExceptionHandler(MessageException.class)
//    public ResponseEntity<ErrorResponse> handleMessageException(MessageException ex) {
//        log.error("MessageException: {}", ex.getMessage());
//        return ResponseEntity.status(determineHttpStatus(ex.getErrorCode()))
//                .body(new ErrorResponse(ex.getMessage(), ex.getErrorCode()));
//    }
//
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
//        String message = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
//        log.error("Validation error: {}", message);
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                .body(new ErrorResponse(message,1001));
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
//        log.error("Unexpectd error: ", ex);
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(new ErrorResponse("An unexpected error occured", 1002));
//    }
//
//    private HttpStatus determineHttpStatus(int errorCode) {
//        return switch (errorCode) {
//            case 1001 -> HttpStatus.BAD_REQUEST;
//            case 1002 -> HttpStatus.NOT_FOUND;
//            default -> HttpStatus.INTERNAL_SERVER_ERROR;
//        };
//    }
}
