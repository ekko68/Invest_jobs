package com.ibk.sb.restapi.biz.service.platform;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.ibk.sb.restapi.app.common.constant.ComGroupCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.app.common.vo.PassCheckData;
import com.ibk.sb.restapi.biz.service.platform.constant.PlatformStatusEnum;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenCommonFeign;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.common.IbkBranchVO;
import com.ibk.sb.restapi.biz.service.platform.vo.common.IbkBrncEmpResVO;
import com.ibk.sb.restapi.biz.service.platform.vo.common.IbkCodeVO;
import com.ibk.sb.restapi.biz.service.platform.vo.common.TcbResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxPageResponseVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

//@RequiredArgsConstructor
@Slf4j
@Service
public class PlatformAdditionalAuditService {

    private final BoxOpenCommonFeign boxOpenCommonFeign;
    private final PlatformAccountService platformAccountService;
    private final List<String> IBK_VC_BIZNUM_LIST;

    public PlatformAdditionalAuditService(
            BoxOpenCommonFeign boxOpenCommonFeign,
            PlatformAccountService platformAccountService,
            @Value("${ivt.ibk.vc.biznum}") String ibkVcBiznum
    ) {
        this.boxOpenCommonFeign = boxOpenCommonFeign;
        this.platformAccountService = platformAccountService;

        this.IBK_VC_BIZNUM_LIST = StringUtils.hasLength(ibkVcBiznum)
                ?   Collections.unmodifiableList(Arrays.asList(ibkVcBiznum.split(",")))
                :   Collections.unmodifiableList(new ArrayList<>());
    }

    public enum TcbGrade {
        // 기술보유 인정
        T1, T2, T3,
        // 산업기술분류코드 확인 필요
        T4,
        // 기술보유 인정불가
        T5, T6, T7, T8;
    }

    public List<String> getIbkVcBiznumList() {
        // 해당 리스트는 생성자 주입시 읽기전용 리스트로 생성함
        return this.IBK_VC_BIZNUM_LIST;
    }

    /**
     * 투자심사 대상 기업 TCB 기술등급 조회
     * @param rqstEnprId
     * @return
     * @throws Exception
     */
    public TcbResultVO searchRqstEnprTcbInfo (final String rqstEnprId, final String bizNum) throws Exception {

        if (!StringUtils.hasLength(rqstEnprId)) throw new BizException(StatusCode.COM0005);

        String rqstBizNum = "";

        //  투자대상 이용기관 사업자번호 조회
        if(!StringUtils.hasLength(bizNum)) {
            MainCompanyVO companyVO = platformAccountService.searchMainCompanyById(rqstEnprId);
            if (!(companyVO != null && StringUtils.hasLength(companyVO.getBizrno()))) throw new BizException(StatusCode.COM0005);

            rqstBizNum = companyVO.getBizrno();
        } else {
            rqstBizNum = bizNum;
        }

        //  TCB 기술등급 조회
        Map<String, String> tcbRqstBody = new HashMap<>();
        tcbRqstBody.put("bzn", rqstBizNum);
        TcbResultVO tcbRes = boxOpenCommonFeign.getIbkCtrlRcipByTcb(tcbRqstBody);

        if (tcbRes == null) throw new BizException(StatusCode.COM0001);

        return tcbRes;
    }

    /**
     * 투자심사 대상 기업 TCB 기술등급 유효성 확인 (투자사가 IBK 투자그룹에 한정)
     *
     * @param invmCmpId
     * @param rqstEnprId
     * @return
     * @throws Exception
     */
    public PassCheckData<TcbResultVO> checkEnprTcbLimit(final String invmCmpId, final String rqstEnprId, final String invmBizNum, final String enprBizNum) throws Exception {

        if (!(StringUtils.hasLength(invmCmpId) && StringUtils.hasLength(rqstEnprId))) {
            throw new BizException(StatusCode.COM0005);
        }

        PassCheckData<TcbResultVO> result = new PassCheckData<>(false, null);

        //  투자사 사업자번호 조회
        String rqstBizNum = "";

        if(!StringUtils.hasLength(invmBizNum)) {
            MainCompanyVO investorData = platformAccountService.searchMainCompanyById(invmCmpId);
            if (!(investorData != null && StringUtils.hasLength(investorData.getBizrno()))) throw new BizException(StatusCode.COM0005);

            rqstBizNum = investorData.getBizrno();
        } else {
            rqstBizNum = invmBizNum;
        }

        // IBK 투자사가 아닌 경우 TCB 검사를 하지 않고 Pass
        if (!IBK_VC_BIZNUM_LIST.contains(rqstBizNum)) result.setPass(true);

        //  투자사 사업자번호가 IBK 투자사 사업자번호와 동일할 경우
        //  TCB 조회 및 조건 확인 처리
        else {
            //  TCB 기술등급 조회
            TcbResultVO tcbRes = searchRqstEnprTcbInfo(rqstEnprId, enprBizNum);
            result.setData(tcbRes);

            /*
                조회 등급 통과조건
                T1 ~ T3 : 기술보유 인정
                T4 : 해당 사업자번호 기업의 산업기술분류코드가 3가지 중 하나 이상 일치할 경우
                T5 ~ T8 : 인정불가
             */

            // 기존 소스코드상 equals가 아닌 indexOf 판단하는 것을 참고로 함
            if (StringUtils.hasLength(tcbRes.getTcbTchnGrd())) {

                // T1 ~ T3 : 기술보유 인정
                if (tcbRes.getTcbTchnGrd().indexOf(TcbGrade.T1.name()) > -1
                        || tcbRes.getTcbTchnGrd().indexOf(TcbGrade.T2.name()) > -1
                        || tcbRes.getTcbTchnGrd().indexOf(TcbGrade.T3.name()) > -1) result.setPass(true);


                    // T4 : 해당 사업자번호 기업의 산업기술분류코드가 3가지 중 하나 이상 일치할 경우
                else if (tcbRes.getTcbTchnGrd().indexOf(TcbGrade.T4.name()) > -1) {
                    // IBK 공통코드 조회 (산업분류기술코드)
                    Map<String, String> codeRqstBody = new HashMap<>();
                    codeRqstBody.put("groupCodeId", ComGroupCode.IBK_GRP_CD_INDUSTRY.getCode());
                    codeRqstBody.put("pageYn", IvtCode.YnTypeEnum.N.name());

                    BoxPageResponseVO<IbkCodeVO> ibkCodeRes = boxOpenCommonFeign.getIbkComCodeList(codeRqstBody);
                    if (ibkCodeRes == null) throw new BizException(StatusCode.COM0001);
                    if (ibkCodeRes.getRSLT_LIST() == null) {
                        if (StringUtils.hasLength(ibkCodeRes.getSTATUS())) {
                            log.error("Box Platform Api Error Code : {}", ibkCodeRes.getSTATUS());
                        }
                        throw new BizException(StatusCode.COM0001);
                    }

                    // 산업분류코드 확인
                    if (!StringUtils.hasLength(tcbRes.getIncfCd1())) tcbRes.setIncfCd1("");
                    if (!StringUtils.hasLength(tcbRes.getIncfCd2())) tcbRes.setIncfCd2("");
                    if (!StringUtils.hasLength(tcbRes.getIncfCd3())) tcbRes.setIncfCd3("");

                    for (IbkCodeVO ibkCodeVO : ibkCodeRes.getRSLT_LIST()) {
                        // 활성상태가 아니거나 코드값이 없는경우 continue
                        if (!(StringUtils.hasLength(ibkCodeVO.getUseAt())
                                && ibkCodeVO.getUseAt().equals(IvtCode.YnTypeEnum.Y.name())
                                && StringUtils.hasLength(ibkCodeVO.getCmmnCodeId())
                        )) continue;

                        if (ibkCodeVO.getCmmnCodeId().equals(tcbRes.getIncfCd1())
                                || ibkCodeVO.getCmmnCodeId().equals(tcbRes.getIncfCd2())
                                || ibkCodeVO.getCmmnCodeId().equals(tcbRes.getIncfCd3())
                        ) {
                            result.setPass(true);
                            break;
                        }
                    }
                }
            }
        }

        return result;
    }

    /**
     * IBK 영업점 조회
     *
     * @param searchStr
     * @return
     * @throws Exception
     */
    public List<IbkBranchVO> searchIbkBranchList(String searchStr) throws Exception {

        if (!StringUtils.hasLength(searchStr)) return new ArrayList<>();

        // 파라미터 구성 (기존 소스 파라미터 기준에 맞춤) :
        // -> 숫자정보로만 이뤄지면 부점코드 파라미터로 그외의 경우 이름으로
        // -> 만약 부점코드에 문자열로 숫자값 이외가 들어가면 에러 발생
        Map<String, String> rqstBody = new HashMap<>();
        if (StringUtil.isOnlyNumber(searchStr)) rqstBody.put("brcd", searchStr);
        else rqstBody.put("krnBrm", searchStr);

        //
        HashMap<String, Object> response = boxOpenCommonFeign.getIbkBrncInfo(rqstBody);
        if (response == null) throw new BizException(StatusCode.COM0001);
        if (response.get("STATUS") == null || !response.get("STATUS").toString().equals(PlatformStatusEnum.OK.getStatus())) {
            // 메시지는 안 오고 STATUS만 온다.
//            log.error("Box Platform Api Error Message : {}", response.get("MESSAGE").toString());
            log.error("Box Platform Api Error Status : {}", response.get("STATUS").toString());
            throw new BizException(StatusCode.COM0001);
        }

        ObjectMapper mapper = new ObjectMapper();
        // 변환되는 타입에 없는 항목의 경우 무시하도록 처리
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // DATA의 값이 오류가 발생할 경우 Object, 정상일 경우 Array로 타입이 변환되서 처리됨
        return (response.get("DATA") != null && response.get("DATA") instanceof List)
                ? mapper.convertValue(response.get("DATA"), TypeFactory.defaultInstance().constructCollectionType(ArrayList.class, IbkBranchVO.class))
                : new ArrayList<>();
    }

    /**
     * IBK 영업점 > 직원 조회
     *
     * @param brcd
     * @param empNm
     * @return
     * @throws Exception
     */
    public List<IbkBrncEmpResVO.EmpInfoVO> searchBrncEmpList(String brcd, String empNm) throws Exception {
        // 부점코드가 있는 경우만 검색 가능
        // isOnlyNumber에 StringUtils.hasLength 검사 포함됨
        if (!StringUtil.isOnlyNumber(brcd)) throw new BizException(StatusCode.COM0005);

        // 직원목록 조회 (파라미터 설정은 기존 소스에 맞춤)
        Map<String, String> rqstBody = new HashMap<>();

        rqstBody.put("inqDcd", "");
        rqstBody.put("rtrmYn", IvtCode.YnTypeEnum.N.name());
        rqstBody.put("brcd", brcd);
        rqstBody.put("emn", "");
        rqstBody.put("emm", StringUtils.hasLength(empNm) ? empNm : "");
        rqstBody.put("jbclCd", "");
        rqstBody.put("rsptDcd", "");
        rqstBody.put("beteamCd", "");
        rqstBody.put("empNextkeyEmn", "");
        rqstBody.put("empNextkeyJbclCd", "");
        rqstBody.put("empNextkeyRsptDcd", "");

        IbkBrncEmpResVO response = boxOpenCommonFeign.getIbkBrncEmpInfo(rqstBody);
        if (response == null) throw new BizException(StatusCode.COM0001);
        if (response.getEmp() == null && StringUtils.hasLength(response.getMsgCd())) {
            log.error("Box Platform Api Error Code : {}", response.getMsgCd());
            log.error("Box Platform Api Error Message : {}", response.getMnmsgCntn());
            throw new BizException(StatusCode.MNB0003);
        }

        // 기존 소스와 테스트 결과를 확인하면 파라미터의 직원명을 입력하더라도 해당 영업점의 전체 직원 조회가 됨
        // -> empNm값이 있는 경우 반복문 처리로 재조회가 필요
        List<IbkBrncEmpResVO.EmpInfoVO> result = new ArrayList<>();

        if (StringUtils.hasLength(empNm)) {
            for (IbkBrncEmpResVO.EmpInfoVO emp : response.getEmp()) {
                if (StringUtils.hasLength(emp.getEmm()) && (emp.getEmm().indexOf(empNm) > -1)) {
                    result.add(emp);
                }
            }
        } else {
            result = response.getEmp();
        }
        return result;
    }
}
