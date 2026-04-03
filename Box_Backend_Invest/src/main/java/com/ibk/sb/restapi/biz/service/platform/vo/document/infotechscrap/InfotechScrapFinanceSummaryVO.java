package com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.util.StringUtils;

import java.util.List;

@Getter
@Setter
public class InfotechScrapFinanceSummaryVO {

    /**
     * 인포텍 스크래핑 표준재무제표 데이터 중
     * 투자박스 IR 매핑에 해당하는 부분
     *
     * 그 외의 항목은 스펙문서 참조
     */

    // 오류 유무
    private String errYn;
    // 오류 메시지
    private String errMsg;
    
    // 사업장등록정보
    private CerpBscInfrDVO cerpBscInfrDVO;
    // 사업장등록정보
    private BmanBscInfrInqrDVO bmanBscInfrInqrDVO;
    
    private String searchYear;
    
    /**
     * 법인사업자 표준대차대조표
     * 01, 02 나눈 기준은 샘플 데이터상 자본과 부채 기준인듯 하지만
     * 스펙문서상 명확한 기준 설명이 없으므로 확인해야할 표준대차대조표 코드 조회는 양쪽 모두에 해야할듯함
     *
     * INFOTECH 스펙문서는 voList: { rows: [] }로 되어있으나
     * IBK API 문서상은 voList: [] 로 잡혀있음
     * TODO : 추후 데이터 조회 후 수정
     */
    private InfotechScrapRowsVO<FnstBrkdDVO> fnstBrkdDVOList01;
    private InfotechScrapRowsVO<FnstBrkdDVO> fnstBrkdDVOList02;
//    private List<FnstBrkdDVO> fnstBrkdDVOList01;
//    private List<FnstBrkdDVO> fnstBrkdDVOList02;

    /**
     * 법인사업자 표준손익계산서
     * 01, 02 나눈 기준은 샘플데이터 상 표준대차대조표보다 애매함
     * 스펙문서상 명확한 기준 설명이 없으므로 확인해야할 표준손익계산서 코드 조회는 양쪽 모두에 해야할듯함
     *
     * INFOTECH 스펙문서는 voList: { rows: [] }로 되어있으나
     * IBK API 문서상은 voList: [] 로 잡혀있음
     * TODO : 추후 데이터 조회 후 수정
     */
    private InfotechScrapRowsVO<FnstBrkdDVO> fnstBrkdDVOPndlList01;
    private InfotechScrapRowsVO<FnstBrkdDVO> fnstBrkdDVOPndlList02;
//    private List<FnstBrkdDVO> fnstBrkdDVOPndlList01;
//    private List<FnstBrkdDVO> fnstBrkdDVOPndlList02;

    /**
     * 개인사업자 표준대차대조표, 표준손익계산서 항목은
     * IBK API에서 제외됨
     */

//    public class AgitxFnstTrtRightDVOList {
//
//    }
//
//    public class AgitxFnstTrtLeftDVOList {
//
//    }
//
//    public class AgitxFnstTrtRightDVOList2 {
//
//    }
//
//    public class AgitxFnstTrtLeftDVOList1 {
//
//    }
}
