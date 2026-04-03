package com.ibk.sb.restapi.biz.api.admin;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.AdminFundService;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminFundPrdInfoPageVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminFundPrdtInfoVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;

@Api(tags = {"운영자 포탈 - 펀드관리"})
@RestController
@RequestMapping(path = {"/api/admin/fund", "/api/iv/v1/admin/fund"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AdminFundController {
	
	private final AdminFundService adminFundService;
	
	/** ================================ Get Method Mapping ================================ **/
	/**
     * (운영자) 제안받은 펀드 목록 조회
     * @param AdminFundPrdtInfoPageVO
     * @return
     */
	@ApiOperation(value = "(운영자) 제안받은 펀드 목록 조회")
    @GetMapping("/list")
    public ResponseData adminFundList(AdminFundPrdInfoPageVO adminFundPrdInfoPageVO) throws Exception{
    	
		PagingVO<AdminFundPrdtInfoVO> fundList = adminFundService.searchAdminFundList(adminFundPrdInfoPageVO);
		
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fundList)
                .build();
    }

	/**
	 * (운영자) 제안받은 펀드 상세 조회
	 * @param fundId
	 * @return
	 */
	@ApiOperation(value = "(운영자) 제안받은 펀드 상세 조회")
	@GetMapping("/detail/{id}")
	public ResponseData adminFundDetail(@PathVariable("id") String fundId) throws Exception{
		
		List fundList = adminFundService.searchAdminFundDetail(fundId);
		
		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.data(fundList)
				.build();
	}
    /** ================================ Post Method Mapping ================================ **/
	
	/**
	 * (운영자) 제안받은 펀드 상세 답변등록
	 * @param fundId
	 * @return
	 */
	@ApiOperation(value = "(운영자) 제안받은 펀드 상세 답변등록")
    @PostMapping("/save/{id}")
    public ResponseData updateFundReply(@RequestBody AdminFundPrdtInfoVO adminFundPrdtInfoVO) throws Exception {
		adminFundService.updateFundReplyCon(adminFundPrdtInfoVO);
    	
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
	
    @ApiOperation(value = "운영자 포탈 - 제안받은 펀드 엑셀 다운로드")
    @PostMapping("/list/excel")
    public ResponseData fundListExcelDownload(@RequestBody AdminFundPrdInfoPageVO adminFundPrdInfoPageVO, HttpServletResponse response) throws Exception {
    	adminFundService.excelDownloadFund(adminFundPrdInfoPageVO, response);
    	
        return null;
    }
}
