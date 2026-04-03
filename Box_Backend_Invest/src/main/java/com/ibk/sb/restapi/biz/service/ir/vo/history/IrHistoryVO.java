package com.ibk.sb.restapi.biz.service.ir.vo.history;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrHistoryVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrHistoryVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_H_ORDV_L
     * DESC : 기업IR 연혁 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 연혁 순번
    private Integer ordvSqn;

    // 연혁 년월
    private String ordvYm;

    // 연혁 내용
    private String ordvCon;

    /** 로직 처리용 **/
    // 연혁 연도
    @JsonIgnore
    private String groupYear;

}
