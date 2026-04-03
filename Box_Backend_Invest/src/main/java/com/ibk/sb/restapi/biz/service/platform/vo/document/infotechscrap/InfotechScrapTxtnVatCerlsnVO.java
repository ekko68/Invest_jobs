package com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class InfotechScrapTxtnVatCerlsnVO {
	/**
     * 인포텍 스크래핑 부가가치세 과세 표준증명
     *
     * 그 외의 항목은 스펙문서 참조
     */
	
    // 오류 유무
    private String errYn;
    // 오류 메시지
    private String errMsg;
    
	private String cerCvaIsnNo = StringUtils.EMPTY;// 발급번호
	private String cvarFnm = StringUtils.EMPTY;// 성명
	private String cvarResno = StringUtils.EMPTY;// 주민등록번호
	private String cvarTnm = StringUtils.EMPTY;// 상호
	private String cvarBsno = StringUtils.EMPTY;// 사업자등록번호
	private String cvarBcNm = StringUtils.EMPTY;// 업태
	private String cvarItmNm = StringUtils.EMPTY;// 종목
	
	private List<GnrlTxtnVatCerIsnDVO> gnrlTxtnVatCerIsnDVOList;

}
