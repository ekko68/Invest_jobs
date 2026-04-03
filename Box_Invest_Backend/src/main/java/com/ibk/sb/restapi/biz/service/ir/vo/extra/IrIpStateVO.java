package com.ibk.sb.restapi.biz.service.ir.vo.extra;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrIpStateVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrIpStateVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_P_TCHN_L
     * DESC : 기업IR 보유 기술 목록 (지적재산권 정보)
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 보유 기술 순번
    private Integer holdTchnSqn;

    // 상태 코드
    private String sttsCd;

    // 지적재산권 내용
    private String pnotPrrgCon;

    // 지적재산권 등록일
    private String pnotPrrgRgda;

    // 출원번호
    private String alfrNo;

    /** JOIN **/
    private String sttsNm;

}
