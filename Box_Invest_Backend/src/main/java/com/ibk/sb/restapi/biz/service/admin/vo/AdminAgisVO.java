package com.ibk.sb.restapi.biz.service.admin.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.admin.vo.PrplCmVO.PrplCmVOBuilder;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Alias("AdminAgisVO")
@JsonIgnoreProperties({
    "delYn", "imgFileId", "imgUrl", "totalCnt", "rnum", "rvsRnum"
})
public class AdminAgisVO extends BaseTableVO {

	private String uuId;
	private int agremVnentrSeq; //시퀀스번호
    private String invmEnprNm; //투자기관명
    private String bzn;	//사업자번호
    private String adr;	//주소
    private String agremYn;	//협약여부
    private String agremCnclsde;	//협약체결일
    private String agremExprtnde;	//협약 만기일
    private String contactRsprOneNm;	//연락담당자1 이름
    private String contactRsprOneCnplTpn;	//연락담당자1 전화번호
    private String contactRsprOneEad;	//연락담당자 이메일
    private String contactRsprTwoNm;	//연락담당자2 이름
    private String contactRsprTwoCnplTpn;	//연락담당자2 전화번호
    private String contactRsprTwoEad;	//연락담당자2 이메일
    private String adminUser;
    private List<ComFileInfoVO> agrmntAtchmnfl2;
    private String agrmntAtchmnfl;	//협약서
    private int agremY;	//협약 Y
    private int agremN;	//협약 N
    
//    private List<BoxIvtFileVO> agrmntAtchmnflList;
}
