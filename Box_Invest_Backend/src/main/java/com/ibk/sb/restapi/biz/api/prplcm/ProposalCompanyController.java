package com.ibk.sb.restapi.biz.api.prplcm;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.vo.PrplCmVO;
import com.ibk.sb.restapi.biz.service.prplcm.ProposalCompanyService;
import com.ibk.sb.restapi.biz.service.prplcm.vo.RequestPropsalCompanyPageVo;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@Api(tags = { "투자 기업 추천 이력 조회 API" })
@RequestMapping(path = { "/api/prplcm", "/api/iv/v1/prplcm" }, produces = { MediaType.APPLICATION_JSON_VALUE })
@RequiredArgsConstructor
public class ProposalCompanyController {

	private final ProposalCompanyService proposalCompanyService;
	Logger logger = LoggerFactory.getLogger(this.getClass());

	/**
	 * Category : IBK 제안센터 Page : 투자 기업 추천 이력 조회
	 * 
	 * @param inVO
	 * @return
	 */
	@ApiOperation(value = "투자 기업 추천 이력 조회")
	@GetMapping("/list")
	public ResponseData searchProposalCompanyList(RequestPropsalCompanyPageVo inVO) throws Exception {

		PagingVO<PrplCmVO> noticeList = proposalCompanyService.searchProposalCompanyList(inVO);

		logger.info(" ProposalCompanyController.noticeList >>> {} : ", noticeList);

		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.data(noticeList).build();
	}

	/**
	 * Category : IBK 제안센터 Page : 투자 기업 추천 이력 조회
	 *
	 * @param inVO
	 * @return
	 */
	@ApiOperation(value = "나의 투자 기업 추천 이력 조회")
	@GetMapping("/myList")
	public ResponseData searchProposalCompanyMyList(RequestPropsalCompanyPageVo inVO) throws Exception {

		PagingVO<PrplCmVO> noticeList = proposalCompanyService.searchProposalCompanyMyList(inVO);

		logger.info(" ProposalCompanyController.noticeList >>> {} : ", noticeList);

		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.data(noticeList).build();
	}

	/**
	 * Category : IBK 제안센터 Page : 투자 기업 추천 이력 상세 조회
	 * 
	 * @param rcmdId
	 * @return
	 */
	@ApiOperation(value = "투자 기업 추천 이력 상세 조회")
	@GetMapping("/detail/{bizNum}")
	public ResponseData searchProposalCompanyDetail(@PathVariable("bizNum") String rcmdId) throws Exception {

		PrplCmVO PrplCmVO = proposalCompanyService.searchProposalCompany(rcmdId);

		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.data(PrplCmVO).build();
	}

	/**
	 * Category : IBK 제안센터 Page : 투자 기업 추천 이력 추천 취소
	 * 
	 * @param prplCmVO
	 * @return
	 */
	@ApiOperation(value = "투자 기업 추천 이력 추천 취소")
	@PostMapping("/cancel")
	public ResponseData cancelPrplCm(@RequestBody PrplCmVO prplCmVO) throws Exception {

		proposalCompanyService.cancelPrplCm(prplCmVO);

		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.build();
	}

	/**
	 * Category : IBK 제안센터 Page : 투자 기업 추천 등록
	 * 
	 * @param prplCmVO
	 * @return
	 */
	@ApiOperation(value = "투자 기업 추천 등록")
	@PostMapping(path = { "/save" }, consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
	public ResponseData savePrplCm(@RequestPart(value = "file", required = false) List<MultipartFile> file,
			@RequestPart(value = "json") PrplCmVO prplCmVO) throws Exception {
		//벤처대출추천 후 해당 API 호출 2024-01-31 추가 함 (수정 시 주의)
		HashMap<String, Object> result = proposalCompanyService.saveProposalCompany(file, prplCmVO);

		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.data(result)
				.build();
	}

	/**
	 * VC추천딜 투자기업 추천 등록
	 *
	 * @param prplCmVO
	 * @return
	 */
	@ApiOperation(value = "VC추천딜 투자기업 추천 등록")
	@PostMapping("/rgsnEnprRcmd")
	public ResponseData rgsnEnprRcmd(@RequestBody PrplCmVO prplCmVO) throws Exception {

		proposalCompanyService.vcRcmdDataReq(prplCmVO, "rgsn");

		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.build();
	}

	/**
	 * VC추천딜 투자기업 추천 취소
	 *
	 * @param prplCmVO
	 * @return
	 */
	@ApiOperation(value = "VC추천딜 투자기업 추천 취소")
	@PostMapping("/cnclEnprRcmd")
	public ResponseData cnclEnprRcmd(@RequestBody PrplCmVO prplCmVO) throws Exception {

		proposalCompanyService.vcRcmdDataReq(prplCmVO, "cncl");

		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.build();
	}
}
