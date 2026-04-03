package com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
public class NiceMnbSimpleDocVO {

    @JsonIgnore
    private String docSbmsStYmd;			// 서류제출시작년월일
    @JsonIgnore
    private String docSbmsEdYmd;			// 서류제출종료년월일
    @JsonIgnore
    private String pageCnt;					// 페이지 카운트
    @JsonIgnore
    private String startIdx;				// 시작 페이지 카운트
    @JsonIgnore
    private String endIdx;					// 종료 페이지 카운트

    private String scpgRqstNo;				//스크래핑 ID(은행키)
    private String utlinsttId;				// 이용기관ID
    private String appChnnelSeCode;			//채널구분코드
    private String papersPresentnDt;		//서류제출년월일
    private String papersPresentnEngnCode;	//서류제출기관코드
    private String papersPresentnGoodsNo;	// 서류제출 상품번호

    private String frstRegistId;			//등록ID
    private String frstRegistDt;			//등록일시
    private String lastChangeId;			//수정ID
    private String lastChangeDt;			//수정일시

    private String papersPresentnDetailNo; 	// 서류제출 상세번호
    private String papersCode;				// 서류코드
    private String papersNm;				// 서류명
    private String papersBeginDe;			// 서류시작년월
    private String papersEndDe;				// 서류종료년월
    private String papersPresentnSttusCode;	// 서류제출상태코드
    private String papersPresentnSttusCn;	// 서류제출상태내용
    private String papersAtchFlpthNm;		// 서류첨부파일경로명
    private String atchmnflId;				// 첨부파일ID
    private String userId;					// 사용자 ID

    private String fileMngmNo;	//파일관리번호


    // stream 정렬을 위한 추가
    public LocalDateTime getPapersPresentnDtLocalDateTime() {
        return LocalDateTime.parse(this.papersPresentnDt, DateTimeFormatter.ofPattern("yyyyMMddHHmm")); // 24시간형식임
    }
}
