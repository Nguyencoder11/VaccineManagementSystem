package com.app.vaxms_server.exception;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageException extends RuntimeException {
    private int errorCode;

    private String defaultMessage;

    public MessageException(Throwable throwable) {
        super(throwable);
    }

    public MessageException(String msg, Throwable throwable) {
        super(msg, throwable);
    }

    public MessageException(String msg){
        this.defaultMessage = msg;
//        super(msg);
    }

    public MessageException(String message, int errorCode){
        this.errorCode = errorCode;
        this.defaultMessage = message;
    }

    public MessageException(int errorCode, String massage){
        this.errorCode = errorCode;
        this.defaultMessage = massage;
    }

    public void setErrorCode(int errorCode){
        this.errorCode = errorCode;
    }

    public int getErrorCode(){
        return errorCode;
    }

    public void setDefaultMessage(String defaultMessage){
        this.defaultMessage = defaultMessage;
    }

    public String getDefaultMessage(){
        return defaultMessage;
    }

    @Override
    public void setStackTrace(StackTraceElement[] stackTrace) {
        System.out.println("");
    }

    @JsonIgnore
    @Override
    public StackTraceElement[] getStackTrace() {
        return super.getStackTrace();
    }

    @Override
    public String toString() {
        return this.errorCode + " : " + this.defaultMessage;
    }
}
