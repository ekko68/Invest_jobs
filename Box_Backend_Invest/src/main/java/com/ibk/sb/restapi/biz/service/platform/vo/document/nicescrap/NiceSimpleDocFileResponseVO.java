package com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class NiceSimpleDocFileResponseVO {

    private Items items;

    @Getter
    @Setter
    @NoArgsConstructor // @NoArgsConstructor + static for create instance of inner class
    public static class Items {

        private String count;
        private List<Item> item;

        @Getter
        @Setter
        @NoArgsConstructor
        public static class Item {
            // PDF 파일 Base64 인코딩 Binary 파일
            @JsonProperty("pdf_b64_enc_bin")
            String pdfB64EncBin;
        }
    }
}
