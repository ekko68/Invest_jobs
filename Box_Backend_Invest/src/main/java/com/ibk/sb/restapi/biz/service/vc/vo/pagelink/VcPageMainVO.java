package com.ibk.sb.restapi.biz.service.vc.vo.pagelink;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcPageMainVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcPageMainVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_VC_PAGE_M
     * DESC : 투자사전용 페이지 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자사명 (JOIN)
    private String bplcNm;

    // 투자사 전용 페이지 ID
    private String invmCmpExusPageId;

    // 로고이미지 파일 ID
    private String lgtyImgFileId;
    private String lgtyImgFileNm;
    private String lgtyImgUrl;

    // 홈페이지 URL
    private String hmpgUrl;

    // 자세히보기 페이지 URL
    private String dtlLkngUrlAdr;

    // 대표이미지 파일 ID
    private String rprsImgFileId;
    private String rprsImgFileNm;
    private String rprsImgUrl;

    // 페이지 제목
    private String pageTtl;

    // 페이지 내용
    private String pageCon;

    // 소개이미지 파일 ID
    private String inrdImgFileId;
    private String inrdImgFileNm;
    private String inrdImgUrl;

    // 소개 제목
    private String inrdTtl;

    // 소개 내용
    private String inrdCon;

    // 펀드금액
    private Long fundAmt;
    // 펀드금액 (금액단위추가 : 억)
    private String fundAmtStr;

    // 총 투자기업 수
    private Integer ttalIvenCnt;

    // 기업가치금액
    private Long etvlAmt;
    // 기업가칙므액 (금액단위추가)
    private String etvlAmtStr;

    // 투자회수 기업수
    private Integer invmRtrvEnprCnt;

    // 고객센터 전화번호
    private String cscnTpn;

    // 고객센터 이메일 주소
    private String cscnEmlAdr;

    // 고객센터 홈페이지 URL
    private String cscnHmpgUrl;

    // 고객센터 저작권 내용
    private String cscnCpyrCon;

    // 투자신청 가능여부
    private String invmAplcAbyn;

}
