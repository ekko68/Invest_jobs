package com.ibk.sb.restapi.biz.api.admin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.AdminProposalCompanyService;
import com.ibk.sb.restapi.biz.service.admin.vo.PrplCmVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestPrplcmVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@Api(tags = {"운영자 포탈 - 추천기업 관리 API"})
@RequestMapping(path = {"/api/admin/rcmdEnprMngm/prplCm", "/api/iv/v1/admin/rcmdEnprMngm/prplCm"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AdminProposalCompanyController {

	private final AdminProposalCompanyService service;
	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	/**
     * Category : IBK 제안센터
     * Page : 투자 기업 추천 이력 조회
     * @param pageVO
     * @return
     */
	@ApiOperation(value = "추천받은 기업 리스트")
	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "searchStatus", value = "조회 조건 (상태)", dataType = "String"),
            @ApiImplicitParam(name = "searchContent", value = "조회 조건 (내용)", dataType = "String"),
            @ApiImplicitParam(name = "searchUser", value = "조회 조건", dataType = "String"),
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/list")
	public ResponseData proposalCompanyList(RequestPrplcmVO inVO) throws Exception {
		
		
		PagingVO<PrplCmVO> noticeList = service.proposalCompanyList(inVO);
        
        logger.info(" ProposalCompanyController.noticeList >>> : ", noticeList);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(noticeList)
                .build();
    }
	
	/**
     * Category : IBK 제안센터
     * Page : 추천받은 기업 상세
     * @param 
     * @return
     */
	@ApiOperation(value = "추천받은 기업 상세")
	@GetMapping("/detail")
	public ResponseData proposalCompanyView(@RequestParam(name = "utlinsttId", required = true) String utlinsttId 
										   ,@RequestParam(name = "rcmdEnprBzn", required = true) String rcmdEnprBzn) throws Exception {
		
		logger.info(" utlinsttId, rcmdEnprBzn >>> : {}", utlinsttId, rcmdEnprBzn);
		
		PrplCmVO prplCmVO = service.proposalCompanyView(utlinsttId, rcmdEnprBzn);
        
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(prplCmVO)
                .build();
    }
	
	/**
     * Category : IBK 제안센터
     * Page : 추천받은 기업 상세
     * @param 
     * @return
     */
	@ApiOperation(value = "추천받은 기업 저장")
	@PostMapping("/memo/save")
	public ResponseData proposalCompanySave(@RequestBody RequestBodyAdminVO<PrplCmVO> requestBodyAdminVO) throws Exception {
		
		logger.info(" utlinsttId, rcmdEnprBzn >>> : {}", requestBodyAdminVO.getParams().getUtlinsttId() + ", " + requestBodyAdminVO.getParams().getRcmdEnprBzn());
		
		boolean result = service.proposalCompanySave(requestBodyAdminVO);
        
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
}
