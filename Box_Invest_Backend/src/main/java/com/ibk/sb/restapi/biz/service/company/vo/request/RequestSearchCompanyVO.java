package com.ibk.sb.restapi.biz.service.company.vo.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Alias("RequestSearchCompanyVO")
public class RequestSearchCompanyVO extends PageVO {

    @JsonIgnore
    private final String SORT_DEFAULT = IvtCode.SortTypeEnum.DEFAULT.getType();
    @JsonIgnore
    private final String SORT_RANDOM = IvtCode.SortTypeEnum.RANDOM.getType();
    @JsonIgnore
    private final String SORT_PREFERENCE = IvtCode.SortTypeEnum.PREFERENCE.getType();


    // 로그인 기업 아이디 (LIKE 유무 확인용)
    private String loginUsisId;

    // 검색 기업명
    private String bplcNm;

    // 투자분야
    private String invmFildCd;

    // 기업구분
    private String enprDsncClsfCd;

    // 사업장 소재지
    private String bsunDwarCd;

    // 매출액 (최근매출액)
    private Long msrnAmslAmtSt;
    private Long msrnAmslAmtFn;

    // 설립일
    private String fondDeSt;
    private String fondDeFn;

    // 근로자수
    private Integer empCntSt;
    private Integer empCntFn;

    // 투자희망기업 유무
    private String invmHopeYn;

    // 추천기업 유무
    private String rcmdEnprStupYn;

    /** 신규 요구사항 추가 및 페이지 섹션 분리에 따른 검색조건 추가 */
    // 해외투자희망기업 유무
    private String osivHopeyn;

    // 인기기업 (기업 선호 매핑 1이상 유무) 유무
    private String isPreferYn;

    // 정렬 관련 기능 추가 (랜덤 정렬, 인기순)
    // 기본 정렬 -> 등록 일시, 설립일
    private String sortType = IvtCode.SortTypeEnum.DEFAULT.getType();

    public RequestSearchCompanyVO(PageVO pageVO) {
        super(pageVO.getPage(), pageVO.getRecord(), pageVO.getPageSize());
    }
}
