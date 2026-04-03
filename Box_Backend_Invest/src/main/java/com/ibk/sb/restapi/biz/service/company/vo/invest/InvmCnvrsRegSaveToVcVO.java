package com.ibk.sb.restapi.biz.service.company.vo.invest;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.biz.service.admin.vo.PrplCmVO;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoVO;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;
import com.ibk.sb.restapi.biz.service.vc.vo.invest.VcInvestAmountVO;
import com.ibk.sb.restapi.biz.service.vc.vo.invest.VcInvestRegionVO;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("InvmCnvrsRegSaveToVcVO")
public class InvmCnvrsRegSaveToVcVO {

    @Builder.Default
    private String  utlinsttId= " ";      // 	이용기관코드
    @Builder.Default
    private String  cmpnNm= " ";          // 	회사명
    @Builder.Default
    private String  bzn= " ";             // 	사업자등록번호

    @Builder.Default
    private String cnrnBizFildCon= " ";      // 관심비즈니스분야
    @Builder.Default
    private String utlzTchn= " ";            // 활용기술유무
    @Builder.Default
    private String prmrInvmTpbs= " ";        // 주요투자업종
    @Builder.Default
    private String prmpInvmStg= " ";         // 주요투자단계
    @Builder.Default
    private String rpdirInfo = " ";          //대표이사정보   추후 삭제
    @Builder.Default
    private String ivcpHmrsInfo = " ";       //투자사인력정보    추후 삭제
    @Builder.Default
    private String mngmHmrsInfo = " ";       //관리인력정보   추후 삭제
    @Builder.Default
    private String prnNm = " ";              //운용사명
    @Builder.Default
    private String rprNm = " ";            //대표이사명
    @Builder.Default
    private String  adres= " ";           // 	화사소재지
    @Builder.Default
    private String  incrYmd= " ";         // 	설립년월일
    @Builder.Default
    private String  fundOprTs= " ";       //     펀드운용시작일
    @Builder.Default
    private Long  cptsTtsm= 0L;            // 	자본총계
    @Builder.Default
    private Long  payCapl= 0L;             // 	납입자본금
    @Builder.Default
    private String  dscplYn= " ";        // 	징계여부
    @Builder.Default
    private String  msrnFsyr= " ";        // 	최근 회계연도 tobe에서 삭제
    @Builder.Default
    private Long  astTtsmAmt= 0L;          //     자산총계
    @Builder.Default
    private Long  lbltCpstAmt= 0L;         //     부채총계
    @Builder.Default
    private Long  cptsTtsmAmt= 0L;         //     자본총계
    @Builder.Default
    private Long  bsnErn= 0L;              //     영업수익
    @Builder.Default
    private Long  bsnCt= 0L;               //     영업비용
    @Builder.Default
    private Long  ctnpAmt= 0L;             //     당기순이익
    @Builder.Default
    private Long  astTtsmAmt_1Y= 0L;       // 	자산총계1Y
    @Builder.Default
    private Long  astTtsmAmt_2Y= 0L;       // 	자산총계2Y
    @Builder.Default
    private Long  lbltCpstAmt_1Y= 0L;      // 	부채총계1Y
    @Builder.Default
    private Long  lbltCpstAmt_2Y= 0L;      // 	부채총계2Y
    @Builder.Default
    private Long  cptsTtsmAmt_1Y= 0L;      // 	자본총계1Y
    @Builder.Default
    private Long  cptsTtsmAmt_2Y= 0L;      // 	자본총계2Y
    @Builder.Default
    private Long  bsnErn_1Y= 0L;           // 	영업수익1Y
    @Builder.Default
    private Long  bsnErn_2Y= 0L;           // 	영업수익2Y
    @Builder.Default
    private Long  bsnCt_1Y= 0L;            // 	영업비용1Y
    @Builder.Default
    private Long  bsnCt_2Y= 0L;            // 	영업비용2Y
    @Builder.Default
    private Long  ctnpAmt_1Y= 0L;          // 	당기순이익1Y
    @Builder.Default
    private Long  ctnpAmt_2Y= 0L;          // 	당기순이익2Y
    @Builder.Default
    private String  invmCnvsStts= "1";   //     투자사전환상태
    @Builder.Default
    private String agrnVncnYn="N";           //     협약벤처기관여부
    @Builder.Default
    private String fileId = " ";

    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp amnnTs;               // 수정날짜
    @Builder.Default
    private String amnnUserId= " ";           // 수정자
    @Builder.Default
    private String rgsnUserId= " ";           // 등록자

    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
    private Timestamp rgsnTs;

    private List<InvestFieldListVO>  investFieldList;       //     비즈니스분야정보
    private List<UtilTechListVO>  utlzTchnList;             //     활용기술정보
    private List<RegionListVO>  prmrInvmTpbsList;           //     주요투자업종
    private List<InvestStepListVO>  prmpInvmStgList;        //     주요투자단계

    private List<CnvrsHnfInfoVO> rpdirInfoList;         //대표이사정보
    private List<CnvrsHnfInfoVO> ivcpHmrsInfoList;      //투자사인력정보
    private List<CnvrsHnfInfoVO> mngmHmrsInfoList;      //관리인력정보

    private List<IrStockHolderVO> stchInfo;             //주주정보 목록
    private List<String> etcList;
    private CompanyBasicVO companyBasicVO;              // 기업 기본 정보
    private List<FundPrdtInfoVO> fundList;              // 펀드 제안 정보
    private List<VcInvestRegionVO> investRegionList;    // 관심투자지역
    private VcInvestAmountVO investAmount;              // 주요투자금액단계
    private List<PrplCmVO> proposalCompanyList;         // 투자기업추천 정보
    private List<OrrpInfoVO> orrpInfoList;              // 운용보고서 정보
    private List<FncnInfoVO> fncnInfoList;              // 출자정보
//    private // 운용보고서 등록 정보

    private AdminUserVO adminUser;
//    @JsonFormat(pattern = "yyyyMMddHHmmss", timezone = "Asia/Seoul")
//    private Timestamp rgsnTs;

}
