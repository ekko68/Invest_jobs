package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("EnprPrdtL")
@NoArgsConstructor
public class EnprPrdtL extends NwIvtBaseVO {
    /** 기업 제품 목록 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("PRDT_ID")
    private String prdtId;
    @JsonProperty("PRDT_NM")
    private String prdtNm;
    @JsonProperty("PRDT_PTRN")
    private String prdtPtrn;
    @JsonProperty("PRDT_IMG_FILE_ID")
    private String prdtImgFileId;
    @JsonProperty("PRDT_DESC")
    private String prdtDesc;
    @JsonProperty("PRDT_CHRC")
    private String prdtChrc;
    @JsonProperty("DEL_YN")
    private String delYn;
}
