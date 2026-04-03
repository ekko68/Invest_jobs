package com.ibk.sb.restapi.biz.service.common;

import com.ibk.sb.restapi.app.common.constant.ComGroupCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.biz.service.admin.AdminVncmLoanService;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminVncmLoanRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminAgisVO;
import com.ibk.sb.restapi.biz.service.common.repo.CommonCodeRepo;
import com.ibk.sb.restapi.biz.service.common.repo.VisitorRepo;
import com.ibk.sb.restapi.biz.service.common.vo.*;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.constant.PlatformStatusEnum;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenAlarmFeign;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.ReceiveEmailVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.ReceiveSmsVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestEmailVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestSmsVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxListResponseVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommonService {

    private final CommonCodeRepo commonCodeRepo;

    private final VisitorRepo visitorRepo;

    private final FileUtil fileUtil;
    
    private final CompanyService companyService;
    
    private final PlatformAccountService platformAccountService;
    
    private final AdminVncmLoanRepo adminVncmLoanRepo;
    
    private final BoxOpenAlarmFeign alarmFeign;
    
    Logger logger = LoggerFactory.getLogger(this.getClass());
    
    /**
     * 방문자 접속 카운팅
     * @throws Exception
     */
    public void saveConnectHistory() throws Exception {
        VisitorCountVO visitorCountVO = new VisitorCountVO();
        visitorCountVO.setAmnnUserId("admin");
        visitorRepo.mergeInvestBoxVisitorCount(visitorCountVO);
    }

    /**
     * 투자분야 코드 목록 조회
     * @return
     */
    public List<InvestFieldVO> searchInvestFieldList() throws Exception {

        List<InvestFieldVO> investFieldList = commonCodeRepo.selectInvestFieldList();
        return investFieldList == null ? new ArrayList<>() : investFieldList;
    }

    public List<InvestFieldVO> searchInvestFieldWithImageList() throws Exception {
        List<InvestFieldVO> investFieldList = commonCodeRepo.selectInvestFieldWithImageList();
        return fileUtil.setImageUrlList(investFieldList);
    }

    /**
     * 활용기술 코드 목록 조회
     * @return
     */
    public List<UtilTechVO> searchTechList() throws Exception {
        List<UtilTechVO> techList = commonCodeRepo.selectUtilTechList();
        return techList == null ? new ArrayList<>() : techList;
    }


    /**
     * 공통코드 목록 조회
     * @param groupCode
     * @return
     * @throws Exception
     */
    public List<ComCodeVO> searchComCodeList(ComGroupCode groupCode) throws Exception {

        List<ComCodeVO> codeList = commonCodeRepo.selectComCode(groupCode.getCode());
        return codeList == null ? new ArrayList<>() : codeList;
    }
    
    /**
     * 협약기관에 등록 되지않은 VC체크
     * @param 
     * @return
     * @throws Exception
     */
    public HashMap<String, Object> searchVcUserCheck() throws Exception {
    	HashMap<String, Object> map = new HashMap<String, Object>();
        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // 사업자번호 조회
    	CompanyBasicVO companyBasicVO = new CompanyBasicVO();
    	companyBasicVO.setUtlinsttId(user.getUserGroupId());
        companyBasicVO = companyService.setCompanyBasicPlatformInfo(companyBasicVO);
        
        AdminAgisVO adminAgisVO = adminVncmLoanRepo.searchAgisBzn(companyBasicVO.getBizrno());
        
        map.put("adminAgisVO", adminAgisVO);
        
        return map;
    }
    
    /**
     * 혁신투자부 담당자에게 알림발송
     * @param params
     * @param gubun
     * @return
     * @throws Exception
     */
    public void sendEmailSms(HashMap<String, Object> params, String gubun) throws Exception {
    	// 요청 취소 시 혁신투자부에 이메일 및 sms로 알림
		RequestSmsVO smsVo = new RequestSmsVO();
		StringBuffer smsSb = new StringBuffer();
		List<String> smsList= new ArrayList<>();

		smsVo.setSmtsKcd("M"); // S: SMS , M : MMS
		smsVo.setSmsBswrDcd("AH007"); // SMS업무구분코드 자세한 코드는 VO참고
		smsVo.setSmsDsmsNo("027297633"); // 발신 번호
		
		// 화면별 실행로직에 따라 메세지 내용 작성
		String smsTtl = "[ IBK 투자BOX 알림 ]";
		smsVo.setMmsTtlNm(smsTtl); // MMS 제목
		smsSb.append("투자BOX 플랫폼에서 알려드립니다.\r\n");
		
		if(gubun.equals("audit")) { // 직접투자
			smsSb.append(params.get("rqstBplcNm") + "으로부터 " + params.get("invmCmpBplcNm") + "에 신규 투자 심사요청이 등록되었습니다.\r\n");
			smsSb.append("감사합니다.");
			
		}else { // 간접투자
			if(gubun.equals("proposalCancel")) {
				smsSb.append(params.get("prnNm") + "으로부터 " + params.get("rcmdEnprNm") + "에 제출된 투자기업 추천요청이 취소되었습니다.\r\n");
				smsSb.append("감사합니다.");
				
			}else if(gubun.equals("proposal")) {
				smsSb.append(params.get("prnNm") + "으로부터 " + params.get("rcmdEnprNm") + "에 신규 투자기업 추천요청이 등록되었습니다.\r\n");
				smsSb.append("감사합니다.");
				
			}else if(gubun.equals("fund")) {
				smsSb.append(params.get("prnNm") + "으로부터 신규펀드 제안\r\n");
				smsSb.append("펀드 명 : "+params.get("fundNm")+" 을(를) 제출완료 되었습니다.\r\n");
				smsSb.append("감사합니다.");

			}else if(gubun.equals("fundCancel")) {
				smsSb.append(params.get("prnNm") + "으로부터 제출 완료된\r\n");
				smsSb.append("펀드 명 : "+params.get("fundNm")+" 을(를) 제안 취소하였습니다.\r\n");
				smsSb.append("감사합니다.");
				
			}
		}
		// 혁신투자부 직원 연락처
		smsList.add(0, "01034437098"); //혁신투자부 김동선 과장님
		smsList.add(1, "01090466909"); //혁신투자부 김다연 대리님
		smsVo.setMmsDsmsCon(smsSb.toString()); // MMS 내용
		for(int i=0 ; i<smsList.size() ; i++) {
			smsVo.setSmrvNo(smsList.get(i));
			alarmFeign.sendPlatformSms(smsVo);
		}
		
		RequestEmailVO emailVo = new RequestEmailVO();
		List<String> emailList= new ArrayList<>();
		List<String> emailCsmList= new ArrayList<>();

		// 화면별 실행로직에 따라 메세지 내용 작성
		StringBuffer emailSb = new StringBuffer();
		emailSb.append("투자BOX 플랫폼에서 알려드립니다.\r\n");
		emailVo.setIbkboxEnmbId((String) params.get("userId")); // IBKBOX기업회원ID
		emailVo.setDsmsEad("webmaster@ibk.co.kr"); // 발신 이메일
		
		if(gubun.equals("audit")) { // 직접투자
			emailVo.setCsm((String) params.get("userNm")); // 담당자 이름
			emailVo.setEmlTtlNm("신규 투자심사 요청이 등록되었습니다."); // 이메일 제목
			emailSb.append(params.get("rqstBplcNm") + "으로부터 " + params.get("invmCmpBplcNm") + "에 신규 투자 심사요청이 등록되었습니다.\r\n");
			emailSb.append("감사합니다.");
			
		}else { // 간접투자
			if(gubun.equals("proposalCancel")) {
				emailVo.setEmlTtlNm("[ IBK 투자BOX 알림 ] 제출완료 된 투자기업 추천요청을 취소하였습니다."); 	// 이메일 제목
				// 이메일 내용
				emailSb.append(params.get("prnNm") + "으로부터 " + params.get("rcmdEnprNm") + "에 제출된 투자기업  추천요청이 취소되었습니다.\r\n");
				emailSb.append("감사합니다.");
			}else if(gubun.equals("proposal")) {
				emailVo.setCsm((String) params.get("chrgAudofir")); // 담당자 이름
				emailVo.setEmlTtlNm("[ IBK 투자BOX 알림 ] 신규 투자기업 추천요청을 제출하였습니다."); // 이메일 제목
				// 이메일 내용
				emailSb.append(params.get("prnNm") + "으로부터 " + params.get("rcmdEnprNm") + "에 신규 투자기업  추천요청이 등록되었습니다.\r\n");
				emailSb.append("감사합니다.");
			}else if(gubun.equals("fund")) {
				emailVo.setCsm((String) params.get("rprNm")); // 담당자 이름
				emailVo.setEmlTtlNm("[ IBK 투자BOX 알림 ] 신규 펀드제안을 제출하였습니다."); // 이메일 제목
				// 이메일 내용
				emailSb.append(params.get("prnNm") + "으로부터 신규펀드 제안\r\n");
				emailSb.append("펀드 명 : "+params.get("fundNm")+" 을(를) 제출하였습니다.\r\n");
				emailSb.append("감사합니다.");
			}else if(gubun.equals("fundCancel")) {
				emailVo.setCsm((String) params.get("userNm")); // 담당자 이름
				emailVo.setEmlTtlNm("[ IBK 투자BOX 알림 ] 제출완료 된 펀드제안을 취소하였습니다."); // 이메일 제목
				// 이메일 내용
				emailSb.append(params.get("prnNm") + "으로부터 제출 완료한\r\n");
				emailSb.append("펀드 명 : "+params.get("fundNm")+" 을(를) 취소하였습니다.\r\n");
				emailSb.append("감사합니다.");
			}
			
		}
		// 혁신투자부 직원 이메일
		emailList.add(0, "ibk25538@ibk.co.kr");   //혁신투자부 김동선 과장님
		emailList.add(1, "yeon9046@ibk.co.kr");   //혁신투자부 김다연 대리님
		
		emailCsmList.add(0, "김동선 과장");
		emailCsmList.add(1, "김다연 대리");
		
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encByte = encoder.encode( emailSb.toString().getBytes() );
        String encEmlConStr = new String(encByte);
        emailVo.setEmlThtxCon1(encEmlConStr);	
        
        // IBK Email 발송 요청 일련번호 생성
		for(int i=0 ; i<emailList.size() ; i++) {
			String nowStr = new SimpleDateFormat("yyMMddHHmmsss").format(new Date());
			String emlSndgRqstSrn = nowStr.concat( RandomStringUtils.randomNumeric(5) );
			emailVo.setEmlSndgRqstSrn(emlSndgRqstSrn);
			emailVo.setRcvEad(emailList.get(i));
			emailVo.setCsm(emailCsmList.get(i)); 
			
			System.out.println("emailVo = " + emailVo.toString());
			alarmFeign.sendPlatformEmail(emailVo);
		}
    }

}
