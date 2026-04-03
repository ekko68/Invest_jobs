package com.ibk.sb.restapi.app.common.vo;

import lombok.*;

import java.util.HashMap;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ResponseData<T> {
    private String code, message, token;
    private T data;

    // code setter overloading
    public void setCode(String code) {
        this.code = code;
    } // Business code

    public void setCode(Integer code) {
        this.code = code.toString();
    } // HttpStatus code

    /** Builder Pattern Set **/
    // 오버로딩으로 롬복 Builder가 아닌 커스텀 빌더 패턴 세팅을 함

    private ResponseData(Builder<T> builder) {
        this.message = builder.message;
        this.token = builder.token;
        this.code = builder.code;
        this.data = builder.data;
    }

    public static Builder builder() {
        return new Builder();
    }

    @NoArgsConstructor
    public static class Builder<T> {
        private String message, token, code;
        private T data;

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        /** 단일 리스트에 대한 오버로딩 처리 (우선순위 적용) **/
        public Builder data(List data) {

            HashMap<String, List> result = new HashMap<>();
            result.put("list", data);

            this.data = (T) result;

            return this;
        }

        public Builder data(T data) {
            this.data = data;
            return this;
        }

        // Builder 변수 code에 대한 오버로딩
        public Builder code(String code) {
            this.code = code;
            return this;
        }

        public Builder code(Integer code) {
            this.code = code.toString();
            return this;
        }

        public ResponseData build() {
            return new ResponseData(this);
        }
    }
}