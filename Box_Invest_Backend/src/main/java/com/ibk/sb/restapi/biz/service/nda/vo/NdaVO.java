package com.ibk.sb.restapi.biz.service.nda.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Alias("NdaVO")
@JsonIgnoreProperties({
        "usyn", "delYn", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "amnnUserNm", "imgFileId", "imgUrl"
})
public class NdaVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_NDA_CNTT_L
     * DESC : NDA 체결 목록 정보
     */

    // NDA 체결 ID
    private String ndaCnttId;

    // 발신 기관
    private String dsmsInttId;
    private String dsmsInttNm;

    // 수신 기관
    private String rcvInttId;
    private String rcvInttNm;

    // 진행 상태 코드
    private String pgrsSttsCd;
    private String pgrsSttsNm;

    // NDA 요청 제목
    private String ndaRqstTtl;

    // NDA 요청 내용
    private String ndaRqstCon;

    // NDA 유효 년수
    private Integer ndaValdNyy;

    // NDA 특별 조항 내용
    private String ndaSpclArtcCon;

    // 발신 기관 주소
    private String dsmsInttAdr;

    // 수신 기관 주소
    private String rcvInttAdr;

    // NDA PDF 파일 ID
    private String ndaPtdfFileId;

    // 발신 기관 서명 파일
    private String dsmsInttSignFile;

    // 수신 기관 서명 파일
    private String rcvInttSignFile;

    // 발신 기관 서명인 명
    private String dsmsInttSignprsnNm;

    // 수신 기관 서명인 명
    private String rcvInttSignprsnNm;


    /**
     * 프론트 Eform 팝업을 위한 투자요청기업, 투자기관 매핑
     * (수신기관 서명, 체결 완료 form에서 사용)
     */
    // 요청기업
    private String enprNm;
    private String enprSign;
    private String enprSignprsnNm;
    private String enprAdr;
    // 투자기관
    private String invmNm;
    private String invmSign;
    private String invmSignprsnNm;
    private String invmAdr;

    public FormInttVO getDsmsSetFormInttData() {
        return FormInttVO.builder()
                .inttNm(this.dsmsInttNm)
                .inttAdr(this.dsmsInttAdr)
                .signData(this.dsmsInttSignFile)
                .signprsnNm(this.dsmsInttSignprsnNm)
                .build();
    }
    public FormInttVO getRcvSetFormInttData() {
        return FormInttVO.builder()
                .inttNm(this.rcvInttNm)
                .inttAdr(this.rcvInttAdr)
                .signData(this.rcvInttSignFile)
                .signprsnNm(this.rcvInttSignprsnNm)
                .build();
    }
}
