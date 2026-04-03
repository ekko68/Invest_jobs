package com.ibk.sb.restapi.biz.service.batch;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditStageVO;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import com.ibk.sb.restapi.biz.service.batch.repo.DataTransferRepo;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.*;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.IvtJsonBackup;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.RequestTransferInvmVO;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ResultUpdateTableVO;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw.*;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ts.*;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.result.ResultTransferVO;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.result.TransferMappingVO;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestFieldVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestHopeVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyUtilTechVO;
import com.ibk.sb.restapi.biz.service.company.vo.product.CompanyProductVO;
import com.ibk.sb.restapi.biz.service.ir.vo.base.InvestRelationVO;
import com.ibk.sb.restapi.biz.service.ir.vo.base.IrInvestVO;
import com.ibk.sb.restapi.biz.service.ir.vo.extra.IrProductVO;
import com.ibk.sb.restapi.biz.service.ir.vo.progress.IrProgressVO;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.PlatformFileService;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import com.ibk.sb.restapi.biz.service.vc.vo.portfolio.VcPortfolioVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DataTransferService {

    private final DataTransferRepo dataTransferRepo;

    private final CommonFileService commonFileService;
    private final PlatformFileService platformFileService;
    private final PlatformAccountService platformAccountService;

    private final List<String> IBK_VC_BIZNUM_LIST;

    private final String ASIS_EXNT_RSLT_SUCCESS_MSG = "축하합니다. 심사결과 기업은행으로부터 투자가 승인되었습니다.";
    private final String ASIS_EXNT_RSLT_REFUSE_MSG = "심사결과 투자가 거절되었습니다.";
    private final String ASIS_EXNT_RSLT_HOLD_MSG = "심사결과 투자가 보류되었습니다.";

    private final String ASIS_PGRS_STTS_CD_0001 = "0001";	//등록중
    private final String ASIS_PGRS_STTS_CD_0002 = "0002";	//등록완료
    private final String ASIS_PGRS_STTS_CD_0003 = "0003";	//서류제출완료
    private final String ASIS_PGRS_STTS_CD_0004 = "0004";	//투자요청완료
    private final String ASIS_PGRS_STTS_CD_0005 = "0005";	//심사중
    private final String ASIS_PGRS_STTS_CD_0006 = "0006";	//심사완료
    private final String ASIS_PGRS_STTS_CD_0007 = "0007";	//반려

    // -> 기존 혁신투자박스 301M 테이블 등 관련 테이블 입력 로직이 없으므로 안 쓰임
    private final String ASIS_EXNT_RSLT_CD_0001 = "0001";	//미접수
    private final String ASIS_EXNT_RSLT_CD_0002 = "0002";	//투자승인
    private final String ASIS_EXNT_RSLT_CD_0003 = "0003";	//투자거절
    private final String ASIS_EXNT_RSLT_CD_0004 = "0004";	//투자보류
    private final String ASIS_EXNT_RSLT_CD_0005 = "0005";	//결과미입력

    private final String ASIS_HOPE_INVM_STG_ID_0001 = "0001";   // 시드
    private final String ASIS_HOPE_INVM_STG_ID_0003 = "0003";   // 시리즈 A
    private final String ASIS_HOPE_INVM_STG_ID_0004 = "0004";   // 시리즈 B
    private final String ASIS_HOPE_INVM_STG_ID_0005 = "0005";   // 시리즈 C ~ E

    public DataTransferService (
            DataTransferRepo dataTransferRepo,
            CommonFileService commonFileService,
            PlatformFileService platformFileService,
            PlatformAccountService platformAccountService,
            @Value("${ivt.ibk.vc.biznum}") String ibkVcBiznum
    ) {
        this.dataTransferRepo = dataTransferRepo;
        this.commonFileService = commonFileService;
        this.platformFileService = platformFileService;
        this.platformAccountService = platformAccountService;

        this.IBK_VC_BIZNUM_LIST = StringUtils.hasLength(ibkVcBiznum)
                ?   Collections.unmodifiableList(Arrays.asList(ibkVcBiznum.split(",")))
                :   Collections.unmodifiableList(new ArrayList<>());
    }

    /**
     * 기존 -> 신규 투자박스 데이터 이관
     *
     * # 주의점
     * 1. IR 관련 정보 : 기존은 투자심사요청건을 기준으로 매핑 vs 신규는 기업을 기준으로 매핑되어있음
     * 2. 심사 구분 아이디 : 기존은 기업 아이디 + 관리번호로 되어 있으며,
     *                     관리번호는 22001 (년도 + 시퀀스) 인듯함 | 현재 600건정도로 중복 기업이 없기에 어디까지나 추측임
     *
     * 2. 진행상태 코드 : 기존은 하나의 진행상태에 대해서도 여러 코드로 세분화됨
     *                  신규는 각 프로세스별로 하나씩 공통코드가 부여되어있음
     *
     * ===============================================================================================================
     *
     * # 대상 기존 투자박스 -> 신규 투자박스 테이블 정보
     *
     * 1. TB_BOX_IVT101M : 투자BOX에서 투자를 받기 위해 제출한 정보 (Main 테이블)
     *
     *              ->  TB_BOX_IVT_EXNT_RQST_M (투자심사요청정보)
     *                  , TB_BOX_IVT_ENPR_INFO_D (기업상세정보)
     *                  , TB_BOX_IVT_ENPR_PRDT_L (기업제품목록)
     *                  , TB_BOX_IVT_IR_B_BSIN_M (IR 기본정보)
     *                  , TB_BOX_IVT_FILE_ATCH_M (첨부파일정보)
     *
     * 2. TB_BOX_IVT102M : 투자BOX에서 투자를 받기 위한 사업자의 주주정보
     *
     *              ->  TB_BOX_IVT_IR_S_STCH_L (기업IR 주주 정보)
     *
     * 3. TB_BOX_IVT103M : 투자BOX에서 투자를 받기 위한 사업자의 기존 투자 유치정보
     *
     *              ->  TB_BOX_IVT_IR_B_INVM_D (기업IR 투자유치 정보)
     *
     * 4. TB_BOX_IVT107M : 투자 요청을 한 사업자의 사업장 주소 정보
     *
     *              ->  TB_BOX_IVT_IR_B_BSIN_M (기업IR 기본 정보)
     *
     * 5. TB_BOX_IVT201M : 투자BOX에서 투자를 받기 위해 실시한 서류제출 기본 정보
     *
     *              ->  TB_BOX_IVT_SIMP_DOC_L (기업별 간편서류 등록 정보 목록)
     *
     * 6. TB_BOX_IVT301M : 투자 요청을 한 정보를 심사한 결과 정보
     *
     *              ->  데이터 없음
     *
     * 7. TB_BOX_IVT401H : 코멘트 없음
     *
     *              ->  TB_BOX_IVT_EXNT_RQST_M (투자심사요청정보)
     *              ->  TB_BOX_IVT_EXNT_PGSG_R (투자 심사 진행 단계 목록)
     *
     * ===============================================================================================================
     *
     * # 데이터 이관 플랜
     *
     * 1. 메인박스 스키마의 투자박스 테이블 -> 현재 투자박스 스키마로 덤프 (두 스키마는 물리적으로 분리되어 있음)
     *
     * 2. 아이디부터 정보가공처리가 필요하므로 query로 merge처리하는 것이 아닌,
     *    Java Service로 가공처리가 이뤄진 이후 Repo로 insert 는 방식으로 처리
     *
     * 3. 기준 확인
     *      : TB_BOX_IVT101M / TB_BOX_IVT201M / TB_BOX_IVT401H : 투자심사신청 기준
     *
     *      : TB_BOX_IVT101M (IR 정보 관련) / TB_BOX_IVT102M / TB_BOX_IVT103M / TB_BOX_IVT107M : 기업별 최신 데이터 기준
     *
     * 4. 하나의 서비스 하나의 Transaction으로 처리
     */


    /**
     * 데이터 이관 전체 프로세스 진행 (범위 지정(startRange, endRange) 없음)
     *
     * @return
     * @throws Exception
     */
    public ResultTransferVO beforeDataTransferAllProcess(String settingTranferInvmId) throws Exception {

        // 전체 적용의 경우 범위 지정이 없어야함
        RequestTransferInvmVO request = new RequestTransferInvmVO();
        request.setSettingTranferInvmId(settingTranferInvmId);

        // 투자심사정보 이관
        ResultTransferVO exntDataTransferResult = transferExntData(request);

        // 기업정보 이관
        ResultTransferVO usisDataTransferResult = transferUsisData(request);

        // 스크래핑 키 정보 이관
        ResultTransferVO scrappingKEyTransferResult = transferNiceScrappingKey();

        return ResultTransferVO.builder()
                .registerInvmExntCnt(exntDataTransferResult.getRegisterInvmExntCnt())
                .invmExntStatusCntList(exntDataTransferResult.getInvmExntStatusCntList())
                .invmExntRsltCntList(exntDataTransferResult.getInvmExntRsltCntList())

                .updateEnprInfoUsisCnt(usisDataTransferResult.getUpdateEnprInfoUsisCnt())
                .updateEnprIrUsisCnt(usisDataTransferResult.getUpdateEnprIrUsisCnt())

                .registerNiceScpKeyCnt(scrappingKEyTransferResult.getRegisterNiceScpKeyCnt())
                .transferDate(scrappingKEyTransferResult.getTransferDate())
                .build();
    }


    /**
     * 투자심사 정보 이관
     * @param requestTransferInvmVO
     * @return
     * @throws Exception
     */
    public ResultTransferVO transferExntData (RequestTransferInvmVO requestTransferInvmVO) throws Exception {

        // 투자사 아이디 확인
        if(!StringUtils.hasLength(requestTransferInvmVO.getSettingTranferInvmId())) throw new BizException(StatusCode.COM9998);

        // 해당 투자사 아이디의 사업자번호가 지정된 IBK 투자사 사업자번호인지 확인
        MainCompanyVO investorData =
                platformAccountService.searchMainCompanyById(requestTransferInvmVO.getSettingTranferInvmId());
        if(investorData == null
                || !StringUtils.hasLength(investorData.getBizrno())
                || !IBK_VC_BIZNUM_LIST.contains(investorData.getBizrno())) throw new BizException(StatusCode.COM0005);

        final String invmIbkId = requestTransferInvmVO.getSettingTranferInvmId();
        log.info("Transfer Invest Table Data Start");
        log.info("Transfer Investor IBK ID : {}", invmIbkId);

        // 이관 결과 VO
        ResultTransferVO resultTransferVO = ResultTransferVO.builder()
                .registerInvmExntCnt(0)
                .invmExntStatusCntList(new ArrayList<>())
                .invmExntRsltCntList(new ArrayList<>())
                .build();

        List<String> transferTobeExntIdList = new ArrayList<>();

        /** 1. 투자심사 정보 이관 */

        log.info("Transfer Invest Exnt Data Start ==========================================");
        // 투자심사 전체 리스트 조회 (범위 추가)
        log.info("Transfer Invest Exnt Data List Search");
        List<BeforeIvt101MVO> exntList = dataTransferRepo.selectBeforeExntRqstAllList(
                requestTransferInvmVO.getStartRange(), requestTransferInvmVO.getEndRange()
        );
        if (exntList == null) exntList = new ArrayList<>();

        if(requestTransferInvmVO.getStartRange() != null
                && requestTransferInvmVO.getEndRange() != null
                && exntList.size() == 0) {
            resultTransferVO.setMessage("해당 범위에 더이상 항목이 존재하지 않습니다.");
        }

        for (BeforeIvt101MVO exntItem : exntList) {

            /** 제외 처리 */

            /* 진행 이력정보가 없거나, 신청완료단계(0004) 이전 상태에서 마무리 된 건에 대해 제외처리 */

            if(exntItem.getHistory() == null || exntItem.getHistory().size() <= 0) continue;

            // 이력 순서 정렬
            // ---> 데이터 확인 결과 timestamp casting 할 경우 순서가 꼬이는 현상들을 확인하여 순번정보를 사용하는 것으로 수정
            // ---> 정렬처리는 쿼리문으로 처리함 (h401.INVM_APLC_PSST_SRN ASC / 테스트 코드로 정렬 확인)
            // ---> 기간만료 처리는 기존처럼 가장 마지막 레코드 정보를 기준으로 처리유무 결정


            // 요청 완료 이전건 제외 및 기간만료 처리 확인용으로 사용
            BeforeIvt401HVO lastItem = exntItem.getHistory().get(exntItem.getHistory().size() - 1);

            // 요청 완료 이전건 제외
            if(lastItem.getPgrsSttsCd().equals(ASIS_PGRS_STTS_CD_0001)
                    || lastItem.getPgrsSttsCd().equals(ASIS_PGRS_STTS_CD_0002)
                    || lastItem.getPgrsSttsCd().equals(ASIS_PGRS_STTS_CD_0003)) continue;


            /* 기등록 이관 건 제외처리 */
            TransferMappingVO beforeMappingData = dataTransferRepo.selectTransferMappingData(
                    exntItem.getUsisId(), exntItem.getInvmAplcMngmNo());

            // 해당 AS-IS 아이디 값이 기 등록 매핑 정보에 없거나,
            // 이전 이관 시 투자심사 요청 이전 단계여서 넘어간 경우,
            // 기등록건이 요청 or 심사중이고 이후 상태가 변동된 경우
            // -> 위 3 경우에는 진행 나머지는 continue
            boolean isRegisteredByRequestOrEvaluating = beforeMappingData != null
                    && StringUtils.hasLength(beforeMappingData.getTobeInvmExntRqstId())
                    && ((beforeMappingData.getInvmExntPgsgCd().equals(ComCode.AUDIT_REQUEST.getCode()) && !lastItem.getPgrsSttsCd().equals(ASIS_PGRS_STTS_CD_0004))
                    || (beforeMappingData.getInvmExntPgsgCd().equals(ComCode.AUDIT_EVALUATE.getCode()) && !lastItem.getPgrsSttsCd().equals(ASIS_PGRS_STTS_CD_0005)));

            if(beforeMappingData != null
                    && StringUtils.hasLength(beforeMappingData.getTobeInvmExntRqstId())
                    && !isRegisteredByRequestOrEvaluating) continue;

            // 상태변경에 따른 작업일 경우 기존 등록 데이터를 삭제후 새로 등록한다.
            if(isRegisteredByRequestOrEvaluating) {
                dataTransferRepo.updateInvmExntFileDelYnById(beforeMappingData.getTobeInvmExntRqstId());
                dataTransferRepo.deleteInvmExntDataById(beforeMappingData.getTobeInvmExntRqstId());
                dataTransferRepo.deleteInvmExntPsgsById(beforeMappingData.getTobeInvmExntRqstId());
            }

            /** 투자심사요청 테이블 등록 */

            // 신규 투자심사 아이디 생성 (UUID)
            final String transferExntId = UUID.randomUUID().toString();

            log.info("Mapping Exnt Data : [invmAplcMngmNo = {}], [usisId = {}], [transfer invmExntRqstId = {}]",
                    exntItem.getInvmAplcMngmNo(), exntItem.getUsisId(), transferExntId);

            // 투자심사 이관 등록 레코드 설정
            InvestAuditVO transferAuditData = InvestAuditVO.builder()
                    .invmExntRqstId(transferExntId)
                    .invmCmpId(invmIbkId)
                    .rqstEnprId(exntItem.getUsisId())
                    .rqstMsgCon(exntItem.getEninInrdCon())        // 요청 메시지 : 해당 항목 없음 -> 기업 소개 정보 동일하게 입력
//                    .exntMsgCon(exntItem.getExntOpnnCon())      // 심사 총평
                    .inqAblNdd(15)                                // IR 조회기간은 우선 15으로 처리
                    .build();

            // 심사총평 값 설정
            // 101M의 결과메시지 > 거절메시지 > 401M 메시지 우선순위 기준으로 입력처리
            // 401M 메시지는 하단에서 적용
            if(StringUtil.hasLengthWithTrim(exntItem.getExntOpnnCon())) transferAuditData.setExntMsgCon(exntItem.getExntOpnnCon());
            else if(StringUtil.hasLengthWithTrim(exntItem.getExntRjcnCon())) transferAuditData.setExntMsgCon(exntItem.getExntRjcnCon());

            // extends base id, timestamp 정보 세팅
            transferAuditData.setRgsnUserId(exntItem.getRgsrId());
            transferAuditData.setAmnnUserId(exntItem.getSysLsmdId());

            transferAuditData.setRgsnTs(exntItem.getCastRgsnTs());
            transferAuditData.setAmnnTs(exntItem.getCastSysLsmdTs());

            // IR 파일 저장 및 DB 등록
            if (StringUtil.hasLengthWithTrim(exntItem.getIrrsDatMngmNo())) {
                ComFileInfoVO tsBeforeIrFileInfo = platformFileService.transferIvtDocFile(exntItem.getIrrsDatMngmNo(), exntItem.getInvmRqstEnprNm() + "_IR자료");
                // 해당 파일 번호 조회시 데이터가 없는 경우 null 반환
                if(tsBeforeIrFileInfo != null) {
                    commonFileService.saveFile(tsBeforeIrFileInfo, exntItem.getRgsrId()); // DB 등록
                    transferAuditData.setAnncDatFileId(tsBeforeIrFileInfo.getFileId()); // 발표자료 항목에 추가

                    log.info("Transfer Before IR File : [irrsDatMngmNo = {}], [transfer file id = {}]",
                            exntItem.getIrrsDatMngmNo(), tsBeforeIrFileInfo.getFileId());
                }
            }

            // 기타 자료 저장 및 DB 등록
            if (StringUtil.hasLengthWithTrim(exntItem.getEtcDatMngmNo())) {
                ComFileInfoVO tsBeforeEtcFileInfo = platformFileService.transferIvtDocFile(exntItem.getEtcDatMngmNo(), exntItem.getInvmRqstEnprNm() + "_기타자료");
                // 해당 파일 번호 조회시 데이터가 없는 경우 null 반환
                if(tsBeforeEtcFileInfo != null) {
                    commonFileService.saveFile(tsBeforeEtcFileInfo, exntItem.getRgsrId()); // DB 등록
                    transferAuditData.setAddtDocFileId(tsBeforeEtcFileInfo.getFileId()); // 추가서류 항목에 추가

                    log.info("Transfer Before ETC File : [etcDatMngmNo = {}], [transfer file id = {}]",
                            exntItem.getIrrsDatMngmNo(), tsBeforeEtcFileInfo.getFileId());
                }
            }

            // 2023 추가요청건에 대한 필드 추가
            transferAuditData.setEmn(exntItem.getEmn());
            transferAuditData.setEmm(exntItem.getEmm());
            transferAuditData.setTcbTchnGrd(exntItem.getTcbTchnGrd());

            transferAuditData.setIncfCd1(exntItem.getIncfCd1());
            transferAuditData.setIncfCd2(exntItem.getIncfCd2());
            transferAuditData.setIncfCd3(exntItem.getIncfCd3());

            // 투자심사요청 등록 -> 이력정보에서 추가해야할 정보가 있으므로 하단에서 등록처리로 변경
//            dataTransferRepo.insertTransferExntData(transferAuditData);

            /** 투자심사요청 이력 */

            log.info("[invmAplcMngmNo = {}, usisId = {}] History Record Count : {}",
                    exntItem.getInvmAplcMngmNo(), exntItem.getUsisId(), exntItem.getHistory() == null ? 0 : exntItem.getHistory().size());

            // 완료정보 업데이트 처리용
            BeforeIvt401HVO completeHistoryItem = null;

            for (BeforeIvt401HVO historyItem : exntItem.getHistory()) {
                boolean isBeforeRequestStatus = false;

                /*
                기존 401H 테이블 상태코드
                0001 : 기업정보를 등록 중입니다.
                0002 : 기업정보등록이 완료되었습니다.
                0003 : 간편서류제출이 완료되었습니다. (제출일자: yyyy-MM-dd)
                0004 : 투자요청을 완료하였습니다. 접수번호: C0000840-21001 희망투자금액: 1,000,000,000원
                0005 : 기업은행에서 심사 중입니다.
                0006 : 축하합니다. 심사결과 기업은행으로부터 투자가 승인되었습니다.
                       or 심사결과 투자가 거절되었습니다.

                23.08.09 반려 확인, 실제 운영 데이터에서는 확인되지 않음
                0007 : 반려 추가  -> 실제 운영 데이터에서 확인되지 않음 (2020년 개발데이터 존재)
                                -> 심사결과 + 거절의 경우 따로 프로세스가 있으므로 우선 기간만료처리

                1. TO-BE 투자박스의 경우 기업이 요청 제출과 동시에 요청 상태 진입 : 0004만 요청상태로 판별 0001~0003
                2. 0006 코드에 두가지 상태가 공존 : TO-BE의 경우 심사완료로 귀결됨
                3. Timestamp가 아닌 Date : Date에 코드에 따라 시간을 붙인다.
                 */

                // InvestAuditStageVO 데이터 매핑
                InvestAuditStageVO stageVO = InvestAuditStageVO.builder()
                        .invmExntRqstId(transferExntId)
                        .rgsnUserId(historyItem.getRgsrId())
                        .build();

                // timestamp는 생성자 파라미터는 밀리세컨드임
                switch (historyItem.getPgrsSttsCd()) {
                    case ASIS_PGRS_STTS_CD_0005:
                        stageVO.setInvmExntPgsgCd(ComCode.AUDIT_EVALUATE.getCode());
                        break;
                    case ASIS_PGRS_STTS_CD_0006:
                        stageVO.setInvmExntPgsgCd(ComCode.AUDIT_COMPLETE.getCode());
                        completeHistoryItem = historyItem;
                        break;
                    case ASIS_PGRS_STTS_CD_0007:
                        stageVO.setInvmExntPgsgCd(ComCode.AUDIT_EXPIRED.getCode());
                        break;
                    case ASIS_PGRS_STTS_CD_0004:
                        // 투자심사 요청 완료인 경우 -> 해당 메시지 비고에 추가 (접수번호, 희망투자금액)
                        // 텍스트 타입 : 투자요청을 완료하였습니다. 접수번호: C0235942-23001 희망투자금액: 10,000,000,000원
                        int idx = -1;
                        if(StringUtils.hasLength(historyItem.getPgrsCon())) idx = historyItem.getPgrsCon().indexOf(".");
                        if(idx > -1 && historyItem.getPgrsCon().length() > idx + 3) transferAuditData.setExntRsltRmrk(historyItem.getPgrsCon().substring(idx + 2));
                        stageVO.setInvmExntPgsgCd(ComCode.AUDIT_REQUEST.getCode());
                        break;
                    default:
                        isBeforeRequestStatus = true;
                        break;
                }

                // 0001 ~ 0003 은 skip처리
                if(isBeforeRequestStatus) continue;

                // 등록일 설정
                stageVO.setRgsnTs(historyItem.getCastRgsnTs());

                // 투자심사요청 이력 등록 -> Merge문으로 하여 0001 ~ 0004 건의 경우 insert가 아닌 update 처리로
                // 0005의 경우도 단계가 중복되는 경우가 생겨 마지막 심사중 처리를 기준으로 삼기위해 UPDATE로 처리한다.
                // 위 switch문에서 default로 빠져 코드가 없는 경우는 merge 제외
                if (StringUtils.hasLength(stageVO.getInvmExntPgsgCd())) {
                    dataTransferRepo.mergeTransferExntHistoryData(stageVO);
                }
            } // process history for문 end

            /*기간만료 처리*/
            // 만약 단계가 0005(심사중), 0006(심사완료)가 아니고 60일이 초과된 경우 -> 기간만료 처리
            // 혹은 만약 단계가 0005이고 180일을 초과한 경우 기간만료 처리
            if((!(lastItem.getPgrsSttsCd().equals(ASIS_PGRS_STTS_CD_0005) || lastItem.getPgrsSttsCd().equals(ASIS_PGRS_STTS_CD_0006))
                    && lastItem.getRgsnTs().toLocalDate().isBefore(LocalDate.now().minusDays(60)))
                    || (lastItem.getPgrsSttsCd().equals(ASIS_PGRS_STTS_CD_0005)
                    && lastItem.getRgsnTs().toLocalDate().isBefore(LocalDate.now().minusDays(180)))
            )
            {
                log.info("Set Exnt Expired : [Exnt Last Code : {}] [Exnt Last Update Date : {}]",
                        lastItem.getPgrsSttsCd(), lastItem.getRgsnTs());
                dataTransferRepo.mergeTransferExntHistoryData(InvestAuditStageVO.builder()
                        .invmExntRqstId(transferExntId)
                        .rgsnUserId(lastItem.getRgsrId())
                        .invmExntPgsgCd(ComCode.AUDIT_EXPIRED.getCode())
                        .rgsnTs(new java.sql.Timestamp(System.currentTimeMillis())) // 우선 이관일 기준으로 만료처리시킴
                        .build());
            }

            // 심사완료 (0006) 이력정보가 있는 경우에만 새로 추가된 심사결과 정보 보충
            if(completeHistoryItem != null) {
                // 301M 테이블 정보에 대해서는 데이터도 현재(2023.08.09) 없고 관련 서비스 로직도 확인이 안됨
                // 관련 조회 처리 등은 필요할 경우 추가할 것
//                BeforeIvt301MVO rslt301Data = dataTransferRepo.selectBeforeExntRsltData(
//                        exntItem.getInvmAplcMngmNo(), exntItem.getUsisId());
//                transferAuditData.setInvmPrfrScdlAmt(rslt301Data.getAplcAmt());

                // AS-IS의 경우
                // 결과 처리에 대한 상태가 TOBE와 달리 101M과 401H에 분할 및 혼재되어 있음
                // -> 401H 0006 + 결과 메시지를 기준으로 분할하여 TOBE의 승인, 거절, 보류로 합을 맞춤
                switch (completeHistoryItem.getPgrsCon()) {
                    case ASIS_EXNT_RSLT_SUCCESS_MSG:
                        transferAuditData.setExntRsltCd(ComCode.AUDIT_RESULT_ACCEPT.getCode());

                        // 포트폴리오 정보 추가 (비공개)
                        // todo : 실제 심사결과 정보가 들어가는 301M 정보가 없으므로 경우에 따라 주석 혹은 삭제 예정
                        VcPortfolioVO portfolioVO = new VcPortfolioVO();

                        portfolioVO.setRgsnUserId(completeHistoryItem.getRgsrId());
                        portfolioVO.setAmnnUserId(completeHistoryItem.getRgsrId());
                        portfolioVO.setRgsnTs(completeHistoryItem.getCastRgsnTs());
                        portfolioVO.setAmnnTs(completeHistoryItem.getCastRgsnTs());

                        /** 포트폴리오 투자사 아이디는 api 호출시 입력받은 기업은행 아이디 */
                        portfolioVO.setUtlinsttId(invmIbkId);
                        portfolioVO.setPrtfId(UUID.randomUUID().toString());
                        portfolioVO.setInvmEnprNm(exntItem.getInvmRqstEnprNm());

                        // 집행날짜 -> 투자심사일자로 우선 처리? todo 확인사항
                        portfolioVO.setInvmPrfrDt(
                                completeHistoryItem.getRgsnTs().toLocalDate()
                                        .format(DateTimeFormatter.ofPattern("yyyyMMdd")));

                        // 로고 정보 등록
                        if (StringUtil.hasLengthWithTrim(exntItem.getUsisLogoFileId())) {
                            List<ComFileInfoVO> fileInfoList = platformFileService.transferIvtImgFile(exntItem.getUsisLogoFileId());
                            // 해당 파일 번호 조회시 데이터가 없는 경우 null 반환
                            if(fileInfoList != null && fileInfoList.size() > 0) {
                                commonFileService.saveFile(fileInfoList.get(0), completeHistoryItem.getRgsrId()); // DB 등록
                                portfolioVO.setInvmEnprLgtyImgId(fileInfoList.get(0).getFileId()); // 로고 이미지 추가

                                log.info("Transfer Logo File : [transfer file id = {}]", fileInfoList.get(0).getFileId());
                            }
                        }

                        /* 비즈니스(투자) 분야 */
                        if(StringUtil.hasLengthWithTrim(exntItem.getBizFildCon())) {
                            // 기타 정보 (기타%~)는 '기타'로 통일 시킨 뒤 코드 리스트 조회
                            List<String> fieldCdList = dataTransferRepo.selectInvestFieldCdListByFieldNm(
                                    Arrays.stream(exntItem.getBizFildCon().split("\\^")).map(x -> {
                                        if (x.indexOf("기타%") != -1) return "기타";
                                        else return x;
                                    }).limit(5).collect(Collectors.toList()));
                            // 코드리스트가 존재할 경우 등록 처리
                            // 현재 포트폴리오는 한개만 넣을 수 있으므로 가장 맨 앞 정보를 넣는다.
                            if(fieldCdList != null && fieldCdList.size() > 0) portfolioVO.setInvmFildCd(fieldCdList.get(0));
                        }

                        /* 활용기술 */
                        if(StringUtil.hasLengthWithTrim(exntItem.getUtlzTchnCon())) {
                            // 기타 정보(기타%~) '기타'로 통일 (활용기술은 '기타 솔루션'이 별도로 존재하므로 주의)
                            List<String> techCdList = dataTransferRepo.selectUtilTechCdListByTechNm(
                                    Arrays.stream(exntItem.getUtlzTchnCon().split("\\^")).map(x -> {
                                        if(x.indexOf("기타%") != -1) return "기타";
                                        else return x;
                                    }).limit(5).collect(Collectors.toList())
                            );
                            // 코드 리스트가 존재할 경우 등록 처리
                            // 현재 포트폴리오는 한개만 넣을 수 있으므로 가장 맨 앞 정보를 넣는다.
                            if(techCdList != null && techCdList.size() > 0) portfolioVO.setUtlzTchnCd(techCdList.get(0));
                        }

                        /* 투자단계 */
                        if(StringUtil.hasLengthWithTrim(exntItem.getHopeInvmStgId())) {
                            switch (exntItem.getHopeInvmStgId()) {
                                case ASIS_HOPE_INVM_STG_ID_0001:
                                    portfolioVO.setInvmStgCd(ComCode.IVT_HOPE_STG_SEED.getCode());
                                    break;
                                case ASIS_HOPE_INVM_STG_ID_0003:
                                    portfolioVO.setInvmStgCd(ComCode.IVT_HOPE_STG_SERIES_A.getCode());
                                    break;
                                case ASIS_HOPE_INVM_STG_ID_0004:
                                    portfolioVO.setInvmStgCd(ComCode.IVT_HOPE_STG_SERIES_B.getCode());
                                    break;
                                case ASIS_HOPE_INVM_STG_ID_0005:
                                    portfolioVO.setInvmStgCd(ComCode.IVT_HOPE_STG_SERIES_C.getCode());
                                    break;
                                default:
                                    portfolioVO.setInvmStgCd(" ");
                                    break;
                            }
                        } else {
                            portfolioVO.setInvmStgCd(" ");
                        }

                        // 포트폴리오 등록
                        dataTransferRepo.insertTransferVcPortfolio(portfolioVO);

                        break;

                    case ASIS_EXNT_RSLT_REFUSE_MSG:
                        transferAuditData.setExntRsltCd(ComCode.AUDIT_RESULT_REFUSE.getCode());
                        break;
                    case ASIS_EXNT_RSLT_HOLD_MSG:
                        transferAuditData.setExntRsltCd(ComCode.AUDIT_RESULT_HOLD.getCode());
                        break;
                    default: // 예외 상황에 대해서는 서비스 재검토가 필요하므로 exception 처리후 프로세스 중단
                        log.error("ASIS Exnt Result Code, Message Check --->");
                        log.error("(INVM_APLC_MNGM_NO : {}, USIS_ID : {})", exntItem.getInvmAplcMngmNo(), exntItem.getUsisId());
                        log.error("ASIS RESULT MESSGAE : {}", completeHistoryItem.getPgrsCon());
                        throw new BizException(StatusCode.COM0000);
                }

                transferAuditData.setExntRsprId(completeHistoryItem.getRgsrId());
                if(StringUtil.hasLengthWithTrim(transferAuditData.getExntMsgCon())) transferAuditData.setExntMsgCon(completeHistoryItem.getPgrsCon());

                // 심사자 코드 등의 데이터는 현재 비어 있으므로 우선 보류
//                transferAuditData.setInvmcrofRepnm();

                // 투자심사 등록 위치 수정
//                dataTransferRepo.updateTransferExntRsltData(transferAuditData);
            }

            // 투자심사 요청정보 등록
            dataTransferRepo.insertTransferExntData(transferAuditData);

            /* 투자심사 정보 이관 결과 */

            // 등록된 투자심사 아이디 리스트 추가
            transferTobeExntIdList.add(transferExntId);

            // 이관 매핑정보 병합
            dataTransferRepo.mergeTransferMapping(
                    TransferMappingVO.builder()
                            .asiInvmaplcMnno(exntItem.getInvmAplcMngmNo())
                            .asiUtlinsttId(exntItem.getUsisId())
                            .tobeInvmExntRqstId(transferExntId)
                            // 이전 이관에서 요청 단계 이전, 기업정보만 입력된 경우에 맵핑 테이블에 이력이 남은 경우
                            // 이번 이관에서 요청 단계 이후로 상태가 변화한 경우 하단 기업 갱신에 다시 사용할 수 있게 하기 위함
                            .enprInfoTrctBaseYn(IvtCode.YnTypeEnum.N.name())
                            .build()
            );

        } // exnt for문 end

        // 투자심사 목록 이관 결과 설정
        resultTransferVO.setRegisterInvmExntCnt(transferTobeExntIdList.size());
        if(transferTobeExntIdList.size() > 0) {
            resultTransferVO.setInvmExntStatusCntList(
                    dataTransferRepo.selectTransferExntPgsgStatsticList(transferTobeExntIdList));
            resultTransferVO.setInvmExntRsltCntList(
                    dataTransferRepo.selectTransferExntRsltStatsticList(transferTobeExntIdList));
        }


        if(requestTransferInvmVO.getStartRange() != null && requestTransferInvmVO.getEndRange() != null) {
            log.info("============== Transfer Invest Exnt Data End (Range start : {}, end : {}",
                    requestTransferInvmVO.getStartRange(), requestTransferInvmVO.getEndRange());
        } else {
            log.info("========================================== Transfer Invest Exnt Data End");
        }

        resultTransferVO.setTransferDate(LocalDateTime.now(ZoneId.of("Asia/Seoul")).format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm:ss")));
        return resultTransferVO;
    }


    /**
     * 기업정보, IR 정보 이관
     * @param requestTransferInvmVO
     * @return
     * @throws Exception
     */
    public ResultTransferVO transferUsisData (RequestTransferInvmVO requestTransferInvmVO) throws Exception {

        // 이관 결과 VO
        ResultTransferVO resultTransferVO = ResultTransferVO.builder()
                .updateEnprInfoUsisCnt(0)
                .updateEnprIrUsisCnt(0)
                .build();

        /** 2. 투자심사 기업정보, IR 정보 이관
         *  -> 전체적으로 등록 뿐 아니라 갱신이 될 수 있음
         *  -> 갱신하는 경우 신규 투자박스에 이미 데이터가 등록된 필드에 대해서는 업데이트 처리를 제외 : 기업 상세, IR 기본정보, 분야, 기술, 투자희망정보
         * */

        log.info("Transfer Usis, IR Data Start ==========================================");

        log.info("Transfer Exnt Recent Usis Data List Search");
        List<BeforeIvt101MVO> exntRcntUsisList = dataTransferRepo.selectBeforeUsisRcntExntList(
                requestTransferInvmVO.getStartRange(), requestTransferInvmVO.getEndRange()
        );
        if (exntRcntUsisList == null) exntRcntUsisList = new ArrayList<>();

        if(requestTransferInvmVO.getStartRange() != null
                && requestTransferInvmVO.getEndRange() != null
                && exntRcntUsisList.size() == 0) {
            resultTransferVO.setMessage("해당 범위에 더이상 항목이 존재하지 않습니다.");
        }

        for (BeforeIvt101MVO exntRcntUsisData : exntRcntUsisList) {

            // 해당 기업ID, AS-IS 심사번호로 이관 및 갱신이 된 이력이 있는 경우 continue
            // 만약 갱신이 된 적이 있지만 그 이후로 상태변화 (투자심사요청 이전 -> 요청)으로 변경 된 경우
            // 위에서 다시 갱신처리 할 수 있도록 기준 정보를 N으로 처리함
            TransferMappingVO beforeTransferMappingData = dataTransferRepo.selectTransferMappingData(
                    exntRcntUsisData.getUsisId(), exntRcntUsisData.getInvmAplcMngmNo());

            if(beforeTransferMappingData != null &&
                    beforeTransferMappingData.getEnprInfoTrctBaseYn().equals(IvtCode.YnTypeEnum.Y.name())) continue;

            log.info("Search Data Target : [invmAplcMngmNo = {}], [usisId = {}]", exntRcntUsisData.getInvmAplcMngmNo(), exntRcntUsisData.getUsisId());

            /** 기업 상세정보 -> 있는 부분만 덮어 씌움 */

            log.info("Usis Detail Data Transfer");

            // 기존 정보 조회
            CompanyBasicVO companyDetail = dataTransferRepo.selectExistCompDetailData(exntRcntUsisData.getUsisId());
            if (companyDetail == null) companyDetail = new CompanyBasicVO();
//            companyDetail.setUtlinsttId(exntRcntUsisData.getUsisId());

            // 기업 상세 정보 매핑
            if (exntRcntUsisData.getEmpCnt() != null) companyDetail.setEmpCnt(exntRcntUsisData.getEmpCnt());  // 직원수
            if (StringUtil.hasLengthWithTrim(exntRcntUsisData.getEninInrdCon())) companyDetail.setEnprInrdCon(exntRcntUsisData.getEninInrdCon());     // 기업 소개 내용
            if (exntRcntUsisData.getAllStckIssAmt() != null)  companyDetail.setLstnYn(exntRcntUsisData.getAllStckIssAmt() != 0 ? IvtCode.YnTypeEnum.Y.name() : IvtCode.YnTypeEnum.N.name());          // 상장여부 -> 주식 발행 금액이 0이 아니면 상장으로 처리

            // Secure Coding Access Key 점검사항 조치
            // ->   수정대상 key 설정을 다시 setter로 잡아줘도 조치대상에 들어가므로
            //      repo에서 조회된 항목에서 필요한 부분들을 새로운 인스턴스로 생성해서 처리
            // 기업 상세 정보 병합
            dataTransferRepo.mergeTransferUsisData(CompanyBasicVO.builder()
                    .utlinsttId(exntRcntUsisData.getUsisId())
                    .empCnt(companyDetail.getEmpCnt())
                    .lstnYn(companyDetail.getLstnYn())
                    .enprInrdCon(companyDetail.getEnprInrdCon())
                    .rgsnUserId(exntRcntUsisData.getRgsrId())
                    .rgsnTs(exntRcntUsisData.getCastRgsnTs())
                    .amnnUserId(exntRcntUsisData.getSysLsmdId())
                    .amnnTs(exntRcntUsisData.getCastSysLsmdTs())
                    .build());

            /** 기업 분야정보 : 기존 데이터 삭제 후 덮어씌운다. */

            /* 비즈니스(투자) 분야 */

            // 기존 데이터 삭제
            dataTransferRepo.deleteTransferUsisBizFieldByUsisId(exntRcntUsisData.getUsisId());

            if(StringUtil.hasLengthWithTrim(exntRcntUsisData.getBizFildCon())) {

                // 비즈니스 분야 컬럼 split
                String[] transferFieldNmList = exntRcntUsisData.getBizFildCon().split("\\^");

                // 기타 정보 (기타%~)는 '기타'로 통일 시킨 뒤 코드 리스트 조회 (5개까지 자름)
                List<String> fieldCdList = dataTransferRepo.selectInvestFieldCdListByFieldNm(
                        Arrays.stream(transferFieldNmList).map(x -> {
                            if (x.indexOf("기타%") != -1) return "기타";
                            else return x;
                        }).limit(5).collect(Collectors.toList()));

                // 코드리스트가 존재할 경우 등록 처리
                if(fieldCdList != null && fieldCdList.size() > 0) {
                    int insertCnt = 0;
                    for(String code : fieldCdList) insertCnt = insertCnt + dataTransferRepo.insertTransferUsisBizField(CompanyInvestFieldVO.builder()
                            .utlinsttId(exntRcntUsisData.getUsisId())
                            .invmFildCd(code)
                            .rgsnUserId(exntRcntUsisData.getRgsrId())
                            .rgsnTs(exntRcntUsisData.getCastRgsnTs())
                            .build());
                    log.info("Usis Business(invest) Field Data Transfer : {}", insertCnt);
                }
            }

            /* 활용기술 */

            // 기존 데이터 삭제
            dataTransferRepo.deleteTransferUsisTechByUsisId(exntRcntUsisData.getUsisId());
            if(StringUtil.hasLengthWithTrim(exntRcntUsisData.getUtlzTchnCon())) {

                // 활용기술 컬럼 split
                String[] transferTechNmList = exntRcntUsisData.getUtlzTchnCon().split("\\^");

                // 기타 정보(기타%~) '기타'로 통일 (활용기술은 '기타 솔루션'이 별도로 존재하므로 주의)
                List<String> techCdList = dataTransferRepo.selectUtilTechCdListByTechNm(
                        Arrays.stream(transferTechNmList).map(x -> {
                            if(x.indexOf("기타%") != -1) return "기타";
                            else return x;
                        }).limit(5).collect(Collectors.toList())
                );

                // 코드 리스트가 존재할 경우 등록 처리
                if(techCdList != null && techCdList.size() > 0) {
                    int insertCnt = 0;
                    for(String code : techCdList) insertCnt = insertCnt + dataTransferRepo.insertTransferUsisTech(CompanyUtilTechVO.builder()
                            .utlinsttId(exntRcntUsisData.getUsisId())
                            .utlzTchnCd(code)
                            .rgsnUserId(exntRcntUsisData.getRgsrId())
                            .rgsnTs(exntRcntUsisData.getCastRgsnTs())
                            .build());
                    log.info("Usis Util Tech Data Transfer : {}", insertCnt);
                }
            }

            /** 기업 투자희망정보 -> 있는 부분만 덮어 씌움 */

            // 신규 투자박스 기존 기업 투자희망정보 조회
            CompanyInvestHopeVO existCompanyHopeData = dataTransferRepo.selectExistCompIvtHopeData(exntRcntUsisData.getUsisId());

            // 기존 데이터가 없는 경우 기업 아이디, 등록, 갱신 아이디 일시 설정
            if(existCompanyHopeData == null) existCompanyHopeData = new CompanyInvestHopeVO();
//            existCompanyHopeData.setUtlinsttId(exntRcntUsisData.getUsisId());

            // 각 갱신항목 설정

            /* 투자희망단계 */
            // 투자희망단계 코드 정보    -> 신규 투자
            // 0001 : 엔젤/시드        -> seed
            // 0003 : 시리즈A          -> series-A
            // 0004 : 시리즈B          -> series-B
            // 0005 : 시리즈C~E        -> series-C (신규는 series-D까지 따로 있지만 우선 C로 설정)
//            if(!StringUtils.hasLength(existCompanyHopeData.getInvmStgCd())
//                    && StringUtil.hasLengthWithTrim(exntRcntUsisData.getHopeInvmStgId())) {
            if(StringUtil.hasLengthWithTrim(exntRcntUsisData.getHopeInvmStgId())) {

                log.info("Usis Invest Hope Step Transfer");

                switch (exntRcntUsisData.getHopeInvmStgId()) {
                    case ASIS_HOPE_INVM_STG_ID_0001:
                        existCompanyHopeData.setInvmStgCd(ComCode.IVT_HOPE_STG_SEED.getCode());
                        break;
                    case ASIS_HOPE_INVM_STG_ID_0003:
                        existCompanyHopeData.setInvmStgCd(ComCode.IVT_HOPE_STG_SERIES_A.getCode());
                        break;
                    case ASIS_HOPE_INVM_STG_ID_0004:
                        existCompanyHopeData.setInvmStgCd(ComCode.IVT_HOPE_STG_SERIES_B.getCode());
                        break;
                    case ASIS_HOPE_INVM_STG_ID_0005:
                        existCompanyHopeData.setInvmStgCd(ComCode.IVT_HOPE_STG_SERIES_C.getCode());
                        break;
                }
            }

            /* 투자희망금액 */
//            if(!StringUtils.hasLength(existCompanyHopeData.getInvmAmtCd())
//                && exntRcntUsisData.getHopeInvmEnmtAmt() != null) {
            if(exntRcntUsisData.getHopeInvmEnmtAmt() != null) {

                log.info("Usis Invest Hope Amount Transfer");

                final long halfBillion = 500000000;

                if(exntRcntUsisData.getHopeInvmEnmtAmt() < halfBillion) {
                    existCompanyHopeData.setInvmAmtCd(ComCode.IVT_HOPE_AMT_UNDER_HALFBILL.getCode());
                } else if(exntRcntUsisData.getHopeInvmEnmtAmt() < (2 * halfBillion)) {
                    existCompanyHopeData.setInvmAmtCd(ComCode.IVT_HOPE_AMT_UNDER_1BILL.getCode());
                } else if(exntRcntUsisData.getHopeInvmEnmtAmt() < (6 * halfBillion)) {
                    existCompanyHopeData.setInvmAmtCd(ComCode.IVT_HOPE_AMT_UNDER_3BILL.getCode());
                } else if(exntRcntUsisData.getHopeInvmEnmtAmt() < (10 * halfBillion)) {
                    existCompanyHopeData.setInvmAmtCd(ComCode.IVT_HOPE_AMT_UNDER_5BILL.getCode());
                } else if(exntRcntUsisData.getHopeInvmEnmtAmt() < (20 * halfBillion)) {
                    existCompanyHopeData.setInvmAmtCd(ComCode.IVT_HOPE_AMT_UNDER_10BILL.getCode());
                } else {
                    existCompanyHopeData.setInvmAmtCd(ComCode.IVT_HOPE_AMT_UP_10BILL.getCode());
                }

                if(existCompanyHopeData.getInvmAmt() == null) existCompanyHopeData.setInvmAmt(exntRcntUsisData.getHopeInvmEnmtAmt());
            }

            // Secure Coding Access Key 점검사항 조치
            // ->   수정대상 key 설정을 다시 setter로 잡아줘도 조치대상에 들어가므로
            //      repo에서 조회된 항목에서 필요한 부분들을 새로운 인스턴스로 생성해서 처리
            // 이관 데이터 병합
            dataTransferRepo.mergeTransferUsisIvtHopeData(CompanyInvestHopeVO.builder()
                    .utlinsttId(exntRcntUsisData.getUsisId())
                    .invmStgCd(existCompanyHopeData.getInvmStgCd())
                    .invmAmtCd(existCompanyHopeData.getInvmAmtCd())
                    .invmAmt(existCompanyHopeData.getInvmAmt())
                    .rgsnUserId(exntRcntUsisData.getRgsrId())
                    .rgsnTs(exntRcntUsisData.getCastRgsnTs())
                    .amnnUserId(exntRcntUsisData.getSysLsmdId())
                    .amnnTs(exntRcntUsisData.getCastSysLsmdTs())
                    .build());

            /** 기업 제품 정보 및 제품정보 IR
             *
             * 기존 : 제품과 이미지가 1 : N
             * 신규 투자박스 기업 제품목록은 1:1이므로 우선 이미지 목록만큼 동일 제품명으로 등록 처리
             * IR 쪽도 추가할 것인지 고려 후 처리 -> 우선 데이터가 없는 경우 등록시키는것으로 처리함
             * */

            // IR 진행도 인스턴스 초기화 (수치 업데이트 대상 -> 주주, 제품)
            TransferIrProgressVO irProgressVO = new TransferIrProgressVO();
            irProgressVO.setUtlinsttId(exntRcntUsisData.getUsisId());
            irProgressVO.setUserId(exntRcntUsisData.getRgsrId());

            // IR 정보 갱신여부 확인
            // m101의 SYS_LSMD_TS 기준으로 이후 IR 정보가 업데이트 된 경우에는 갱신하지 않음
            IrProgressVO lastUpdatedProgress = dataTransferRepo.selectUsisIrLastUpdateProgress(exntRcntUsisData.getUsisId());
            boolean isUpdateIr = (
                    lastUpdatedProgress == null
                            || lastUpdatedProgress.getLastModifiedTimestamp().before(exntRcntUsisData.getCastSysLsmdTs()));

            /*
            기존은 하나의 주요 제품, 서비스 건에 대해 복수의 이미지 vs 신규는 복수의 제품,서비스 별 단일 이미지
            -> 동일 서비스, 제품정보로 하여 이미지마다 각각 목록 저장
            */

            // 기업 제품 목록 정보 매핑 및 등록
            // 제품 유무 확인
            if(StringUtil.hasLengthWithTrim(exntRcntUsisData.getMnfrBsnsNm())) {

                /* 기업 제품 목록 */
                log.info("Usis Product/Service Transfer To Usis Product List");
                CompanyProductVO transferProdData = new CompanyProductVO();

                // 기업, 사용자, 일시 정보 설정
                transferProdData.setUtlinsttId(exntRcntUsisData.getUsisId());
                transferProdData.setRgsnUserId(exntRcntUsisData.getRgsrId());
                transferProdData.setAmnnUserId(exntRcntUsisData.getSysLsmdId());
                transferProdData.setRgsnTs(exntRcntUsisData.getCastRgsnTs());
                transferProdData.setAmnnTs(exntRcntUsisData.getCastSysLsmdTs());

                transferProdData.setPrdtNm(exntRcntUsisData.getMnfrBsnsNm()); // 제품명
                transferProdData.setPrdtDesc(exntRcntUsisData.getMnfrBsnsInrdCon()); // 제품설명

                // 기업 제품 이미지 파일 저장 DB 등록
                List<ComFileInfoVO> transferProductFileList = null; // 아이디 당 복수의 이미지 파일이 들어가 수 있음
                if(StringUtil.hasLengthWithTrim(exntRcntUsisData.getImgNo())) transferProductFileList = platformFileService.transferIvtImgFile(exntRcntUsisData.getImgNo());

                // 파일 이미지 리스트가 있는 경우
                if(transferProductFileList != null && transferProductFileList.size() > 0) {
                    // DB 등록
                    for(ComFileInfoVO item : transferProductFileList) {
                        // 첨부파일 DB 등록
                        commonFileService.saveFile(item, exntRcntUsisData.getRgsrId());

                        // 제품정보 DB 등록
                        transferProdData.setPrdtId(UUID.randomUUID().toString());
                        transferProdData.setPrdtImgFileId(item.getFileId());
                        dataTransferRepo.insertTransferUsisProdData(transferProdData);
                        log.info("[Product ID : {}] [Image File ID : {}]", transferProdData.getPrdtId(), transferProdData.getFileId());
                    }
                }
                // 파일 이미지 리스트가 없지만 제품정보가 있는 경우
                else {
                    transferProdData.setPrdtId(UUID.randomUUID().toString());
                    dataTransferRepo.insertTransferUsisProdData(transferProdData);
                    log.info("[Product ID : {}]", transferProdData.getPrdtId());
                }

                /* 기업 IR 제품 정보 */

                // isUpdateIr을 기준으로 기존 데이터 삭제 후 재입력처리
                if(isUpdateIr) {
                    dataTransferRepo.deleteTransferUsisIrProdDataByUsisId(exntRcntUsisData.getUsisId());

                    log.info("Usis Product/Service Transfer To Usis IR Product");

                    dataTransferRepo.insertTransferUsisIrProdData(IrProductVO.builder()
                            .utlinsttId(exntRcntUsisData.getUsisId())
                            .prdtDesc(exntRcntUsisData.getMnfrBsnsNm())
                            .prdtChrc(exntRcntUsisData.getMnfrBsnsInrdCon())
                            .rgsnUserId(exntRcntUsisData.getRgsrId())
                            .amnnUserId(exntRcntUsisData.getSysLsmdId())
                            .rgsnTs(exntRcntUsisData.getCastRgsnTs())
                            .amnnTs(exntRcntUsisData.getCastSysLsmdTs())
                            .build());

                    // 진행도 정보 업데이트
                    if(StringUtil.hasLengthWithTrim(exntRcntUsisData.getMnfrBsnsNm())) irProgressVO.setPrdtTabRt(irProgressVO.getPrdtTabRt() + 5);
                    if(StringUtil.hasLengthWithTrim(exntRcntUsisData.getMnfrBsnsInrdCon())) irProgressVO.setPrdtTabRt(irProgressVO.getPrdtTabRt() + 5);
                }
            }

            // 기업정보 업데이트 cnt++
            resultTransferVO.setUpdateEnprInfoUsisCnt(resultTransferVO.getUpdateEnprInfoUsisCnt() + 1);

            /** IR 정보 업데이트 -> isUpdateIr (최근 tobe 투자박스 ir 갱신이 갱신 데이터 수정일보다 먼저 이뤄졌는지)를 기준으로 함 */

            if(isUpdateIr) {

                /** IR 기본정보 */

                log.info("Usis IR Basic Transfer");

                // 신규 투자박스 기존 IR 기본 정보 조회
//                InvestRelationVO existIrBasicData = dataTransferRepo.selectExistCompIrBasicData(exntRcntUsisData.getUsisId());

                /* as-is에서 확인이 되지 않는 항목*/
                // 기업구분 코드
                // 설립일자
                // 대표자명
                // 업종명
                // 법인등록번호
                // 연락처
                // 자본금 금액
                // 결산기
                // 기업가치금액
                // 투자금 사용용도
                // 투자회수 계획 내용

                // as-is 투자박스 액면가 금액 (하단 주주 정보에서도 사용)
                // 주주 정보의 경우 기존 데이터가 없고 여기서 갱신이 이뤄진 경우에만 추가처리
                boolean transferStckFlg = false;
                long asisPvprAmt = 0;
                if(exntRcntUsisData.getAllHoldStckCnt() != null && exntRcntUsisData.getAllStckIssAmt() != null) {

                    transferStckFlg = true;
                    // 액면가 금액의 경우 이관데이터의 전체주식보유수와 전체주식 발행금액
                    asisPvprAmt = (exntRcntUsisData.getAllHoldStckCnt() != 0)
                            ? exntRcntUsisData.getAllStckIssAmt() / exntRcntUsisData.getAllHoldStckCnt()
                            : exntRcntUsisData.getAllStckIssAmt();
                }

                // Secure Coding Access Key 점검사항 조치
                // ->   수정대상 key 설정을 다시 setter로 잡아줘도 조치대상에 들어가므로
                //      repo에서 조회된 항목에서 필요한 부분들을 새로운 인스턴스로 생성해서 처리
                // 스크래핑 데이터 IR 갱신
                // 기업 IR 기본정보 병합
                dataTransferRepo.mergeTransferUsisIrBasicData(InvestRelationVO.builder()
                        .utlinsttId(exntRcntUsisData.getUsisId())
                        .bnnm(exntRcntUsisData.getInvmRqstEnprNm())                             // 사업자명
                        .bzn(exntRcntUsisData.getInvmRqstBzn())                                 // 사업자등록번호
                        .empCnt(exntRcntUsisData.getEmpCnt())                                   // 직원수
                        .hmpgUrlAdr(exntRcntUsisData.getHmpgAdr())                              // 홈페이지 주소
                        .adr(exntRcntUsisData.getBsunAdr() + exntRcntUsisData.getBsunDtlAdr())  // 주소
                        .zpcd(exntRcntUsisData.getBsunZpcd())                                   // 우편번호


                        .pvprAmt(asisPvprAmt)                                                   // 액면가 금액은 위에서 처리함
                        .ttisStcnt(exntRcntUsisData.getAllHoldStckCnt())                        // 총발행 주식수 - 전체주식보유수을 우선 매핑함

                        .rgsnUserId(exntRcntUsisData.getRgsrId())
                        .rgsnTs(exntRcntUsisData.getCastRgsnTs())
                        .amnnUserId(exntRcntUsisData.getSysLsmdId())
                        .amnnTs(exntRcntUsisData.getCastSysLsmdTs())
                        .build());

                /** 기업 IR 주주정보 */

                // 신규 투자박스 현재 IR 주주정보 조회
//                List<IrStockHolderVO> existStkHldrList = dataTransferRepo.selectExistCompIrStckList(exntRcntUsisData.getUsisId());
                // 기존 주주정보 삭제
                dataTransferRepo.deleteTransferUsisIrStkHldrData(exntRcntUsisData.getUsisId());

                // 주식발행수 액면가 정보가 설정된 경우 데이터 이관
                if(transferStckFlg) {

                    // 이관 데이터 기준 최신 투자심사 주주정보 리스트 조회
                    List<BeforeIvt102MVO> transferStkHldrList = dataTransferRepo.selectBeforeUsisRcntStkHldrList(exntRcntUsisData.getInvmAplcMngmNo(), exntRcntUsisData.getUsisId());

                    // 리스트 데이터 이관
                    // 이관 데이터의 경우 우선주 보통주 구분이 없으므로 보통주로 모두 처리함
                    // 시퀀스는 mybatis에서 처리
                    if(transferStkHldrList != null && transferStkHldrList.size() > 0) {
                        int insertCnt = 0;
                        for(BeforeIvt102MVO item : transferStkHldrList) {
                            insertCnt = insertCnt + dataTransferRepo.insertTransferUsisIrStkHldrData(IrStockHolderVO.builder()
                                    .utlinsttId(item.getUsisId())
                                    .stchNm(item.getStchNm())
                                    .cmscHoldCnt(item.getHlstCnt())
                                    .cmscPvpr(asisPvprAmt)
                                    .cmscAmt(item.getHlstCnt() != null ? asisPvprAmt * item.getHlstCnt() : 0)
                                    .rgsnUserId(item.getRgsrId())
                                    .rgsnTs(item.getCastRgsnTs())
                                    .build());
                        }
                        log.info("Usis IR StockHolder Transfer : {}", insertCnt);
                    }

                    // 진행도 정보 업데이트
                    irProgressVO.setStkHldrTabRt(5);
                }

                /** 기업 IR 투자유치 정보 */

                // 신규 투자박스 현재 IR 투자유치정보 조회
//                List<IrInvestVO> existIvtList = dataTransferRepo.selectExistCompIrIvtList(exntRcntUsisData.getUsisId());
                // 기존 데이터 삭제
                dataTransferRepo.deleteTransferUsisIrIvtSetData(exntRcntUsisData.getUsisId());

                // 이관 데이터 기준 최신 투자심사 기존 투자유치정보 조회
                List<BeforeIvt103MVO> transferIvtList = dataTransferRepo.selectBeforeUsisRcntIvtSetList(exntRcntUsisData.getInvmAplcMngmNo(), exntRcntUsisData.getUsisId());
                // 리스트 데이터 이관
                // 시퀀스는 mybatis에서 처리
                if(transferIvtList != null && transferIvtList.size() > 0) {
                    int insertCnt = 0;
                    for(BeforeIvt103MVO item : transferIvtList) {
                        insertCnt = insertCnt + dataTransferRepo.insertTransferUsisIrIvtSetData(IrInvestVO.builder()
                                .utlinsttId(item.getUsisId())
                                .invmEnmtYm(StringUtil.hasLengthWithTrim(item.getInvmYmd()) ? item.getInvmYmd().substring(0, 6) : "")
                                .invmEnmtEtnm(item.getInvmInttNm())
                                .invmEnmtAmt(item.getInvmAmt())
                                .rgsnUserId(item.getRgsrId())
                                .rgsnTs(item.getCastRgsnTs())
                                .build());
                    }
                    log.info("Usis IR Invest Transfer : {}", insertCnt);
                }

                /** IR 진행도 업데이트 */
                log.info("Usis IR Progress Update");
                dataTransferRepo.mergeTransferIrProgressData(irProgressVO);

                // IR 정보 업데이트 ++
                resultTransferVO.setUpdateEnprIrUsisCnt(resultTransferVO.getUpdateEnprIrUsisCnt() + 1);
            }

            // 이관 매핑정보 병합
            dataTransferRepo.mergeTransferMapping(
                    TransferMappingVO.builder()
                            .asiInvmaplcMnno(exntRcntUsisData.getInvmAplcMngmNo())
                            .asiUtlinsttId(exntRcntUsisData.getUsisId())
                            .tobeInvmExntRqstId(
                                    beforeTransferMappingData != null
                                            ? beforeTransferMappingData.getTobeInvmExntRqstId() : null
                            )
                            .enprInfoTrctBaseYn(IvtCode.YnTypeEnum.Y.name())
                            .build()
            );
        }

        if(requestTransferInvmVO.getStartRange() != null && requestTransferInvmVO.getEndRange() != null) {
            log.info("============== Transfer Usis, IR Data End (Range start : {}, end : {}",
                    requestTransferInvmVO.getStartRange(), requestTransferInvmVO.getEndRange());
        } else {
            log.info("========================================== Transfer Usis, IR Data End");
        }

        resultTransferVO.setTransferDate(LocalDateTime.now(ZoneId.of("Asia/Seoul")).format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm:ss")));
        return resultTransferVO;
    }

    /**
     * 스크래핑 키 이관
     * @return
     * @throws Exception
     */
    public ResultTransferVO transferNiceScrappingKey () throws Exception {

        // 이관 결과 VO
        ResultTransferVO resultTransferVO = ResultTransferVO.builder()
                .registerInvmExntCnt(0)
                .invmExntStatusCntList(new ArrayList<>())
                .invmExntRsltCntList(new ArrayList<>())
                .build();

        log.info("Transfer Nice Scrap Key Data Start ==========================================");

        /** 간편서류제출 이력 병합
         * */
        int niceKeyMergeCnt = dataTransferRepo.insertTransferNiceDocKeyData();
        resultTransferVO.setRegisterNiceScpKeyCnt(niceKeyMergeCnt);

        log.info("Nice Scrap Key Merge Total : {}", niceKeyMergeCnt);

        log.info("========================================== Transfer Nice Scrap Key Data End");

        resultTransferVO.setTransferDate(LocalDateTime.now(ZoneId.of("Asia/Seoul")).format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm:ss")));
        return resultTransferVO;
    }


    /**
     * AS-IS 투자박스 테이블 데이터 이동
     * @param transData
     * @return
     */
    public List<ResultUpdateTableVO> saveBaseIvtBoxBaseTableByJsonFile(TsIvtBackupVO transData) throws Exception {

        // controller에서 base64 json을 decoding + parsing 해서 전달
//        log.info("file content type : {}", file.getContentType());
//
//        // Read File
//        TsIvtBackupVO backupData = new ObjectMapper()
//                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
//                .readValue(new InputStreamReader(file.getInputStream()), TsIvtBackupVO.class);

        List<ResultUpdateTableVO> result = new ArrayList<>();

        /* Overwrite By Backup */
        result.add(
                setIvtJsonBackupData(
                        transData.getIvt101MList(),
                        "TB_BOX_IVT101M",
                        dataTransferRepo::deleteIvt101MAll,
                        dataTransferRepo::insertIvt101MTsData)
        );

        result.add(
                setIvtJsonBackupData(
                        transData.getIvt102MList(),
                        "TB_BOX_IVT102M",
                        dataTransferRepo::deleteIvt102MAll,
                        dataTransferRepo::insertIvt102MTsData)
        );

        result.add(
                setIvtJsonBackupData(
                        transData.getIvt103MList(),
                        "TB_BOX_IVT103M",
                        dataTransferRepo::deleteIvt103MAll,
                        dataTransferRepo::insertIvt103MTsData)
        );

        result.add(
                setIvtJsonBackupData(
                        transData.getIvt107MList(),
                        "TB_BOX_IVT107M",
                        dataTransferRepo::deleteIvt107MAll,
                        dataTransferRepo::insertIvt107MTsData)
        );

        result.add(
                setIvtJsonBackupData(
                        transData.getIvt201MList(),
                        "TB_BOX_IVT201M",
                        dataTransferRepo::deleteIvt201MAll,
                        dataTransferRepo::insertIvt201MTsData)
        );

        result.add(
                setIvtJsonBackupData(
                        transData.getIvt301MList(),
                        "TB_BOX_IVT301M",
                        dataTransferRepo::deleteIvt301MAll,
                        dataTransferRepo::insertIvt301MTsData)
        );

        result.add(
                setIvtJsonBackupData(
                        transData.getIvt401HList(),
                        "TB_BOX_IVT401H",
                        dataTransferRepo::deleteIvt401HAll,
                        dataTransferRepo::insertIvt401HTsData)
        );

        return result;
    }

    /**
     * TO-BE 투자박스 테이블 Backup 데이터 복구
     * @param backupData
     * @throws Exception
     */
    public List<ResultUpdateTableVO> recoverTargetIvtTableByBackupJsonFile(NwIvtBackupVO backupData, IvtCode.YnTypeEnum filePhysicalDelYn) throws Exception {

        // controller에서 base64 json을 decoding + parsing 해서 전달
//        log.info("file content type : {}", file.getContentType());
//
//        // Read File
//        NwIvtBackupVO backupData = new ObjectMapper()
//                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
//                .readValue(new InputStreamReader(file.getInputStream()), NwIvtBackupVO.class);

        List<ResultUpdateTableVO> result = new ArrayList<>();

        /* Overwrite By Backup */

        // 투자심사 요청 테이블 (fileId 있음)
        result.add(
            setIvtJsonBackupDataWithDeleteFile(
                    backupData.getExntRqstMList(),
                    "TB_BOX_IVT_EXNT_RQST_M (투자심사요청)",
                    filePhysicalDelYn,
                    dataTransferRepo::selectExntRqstAtchFileList,
                    (backupDataList) -> {
                        List<String> fileIdList = new ArrayList<>();
                        if(backupDataList != null) backupDataList
                                .forEach(item -> {
                                    if(StringUtils.hasLength(item.getAnncDatFileId())) fileIdList.add(item.getAnncDatFileId());
                                    if(StringUtils.hasLength(item.getAddtDocFileId())) fileIdList.add(item.getAddtDocFileId());
                                });
                        return fileIdList;
                    },
                    dataTransferRepo::deleteExntRqstMAll,
                    dataTransferRepo::insertExntRqstMBackup
            )
        );

        // 투자사 포트폴리오 (fileId 있음)
        result.add(
                setIvtJsonBackupDataWithDeleteFile(
                        backupData.getVcPrtfLList(),
                        "TB_BOX_IVT_VC_PRTF_L (투자사 포트폴리오)",
                        filePhysicalDelYn,
                        dataTransferRepo::selectVcPrtfAtchFileList,
                        (backupDataList) -> {
                            List<String> fileIdList = new ArrayList<>();
                            if(backupDataList != null) backupDataList
                                    .forEach(item -> {
                                        if(StringUtils.hasLength(item.getInvmEnprLgtyImgId())) fileIdList.add(item.getInvmEnprLgtyImgId());
                                    });
                            return fileIdList;
                        },
                        dataTransferRepo::deleteVcPrtfLAll,
                        dataTransferRepo::insertVcPrtfLBackup
                )
        );

        // 기업 제품목록 (fileId 있음)
        result.add(
                setIvtJsonBackupDataWithDeleteFile(
                        backupData.getEnprPrdtLList(),
                        "TB_BOX_IVT_ENPR_PRDT_L (기업제품목록)",
                        filePhysicalDelYn,
                        dataTransferRepo::selectEnprPrdtAtchFileList,
                        (backupDataList) -> {
                            List<String> fileIdList = new ArrayList<>();
                            if(backupDataList != null) backupDataList
                                    .forEach(item -> {
                                        if(StringUtils.hasLength(item.getPrdtImgFileId())) fileIdList.add(item.getPrdtImgFileId());
                                    });
                            return fileIdList;
                        },
                        dataTransferRepo::deleteEnprPrdtLAll,
                        dataTransferRepo::insertEnprPrdtLBackup
                )
        );

        // File ID Data가 없는경우

        // 이관 매핑 정보에서 삭제된 이관 투자심사 항목들 삭제처리
        // 투자심사 매핑이 되지 않은 항목도 삭제
        result.add(
                setIvtJsonBackupData(
                        new ArrayList<>(),
                        "TB_BOX_IVT_EXNT_TRCT_R (투자심사 이관 매핑 정보)",
                        () -> {
                            int delCnt = 0;
                            delCnt = delCnt + dataTransferRepo.deleteExntTransferMapping();
                            delCnt = delCnt + dataTransferRepo.deleteExntTransferUnMapping();

                            return delCnt;
                        },
                        null
                )
        );

        // 투자심사 진행 단계
        result.add(
                setIvtJsonBackupData(
                        backupData.getExntPgsgRList(),
                        "TB_BOX_IVT_EXNT_PGSG_R (투자심사 진행 단계)",
                        dataTransferRepo::deleteExntPgsgRAll,
                        dataTransferRepo::insertExntPgsgRBackup)
        );

        // 간편서류 이력
        result.add(
                setIvtJsonBackupData(
                        backupData.getSimpDocLList(),
                        "TB_BOX_IVT_SIMP_DOC_L (간편서류 이력)",
                        dataTransferRepo::deleteSimpDocLAll,
                        dataTransferRepo::insertSimpDocLBackup)
        );

        // 기업 상세정보
        result.add(
                setIvtJsonBackupData(
                        backupData.getEnprInfoDList(),
                        "TB_BOX_IVT_ENPR_INFO_D (기업 상세정보)",
                        dataTransferRepo::deleteEnprInfoDAll,
                        dataTransferRepo::insertEnprInfoDBackup)
        );

        // 기업 비즈니스 분야
        result.add(
                setIvtJsonBackupData(
                        backupData.getEnprIvflRList(),
                        "TB_BOX_IVT_ENPR_IVFL_R (기업 비즈니스 분야)",
                        dataTransferRepo::deleteEnprIvflRAll,
                        dataTransferRepo::insertEnprIvflRBackup)
        );

        // 기업 활용기술 분야
        result.add(
                setIvtJsonBackupData(
                        backupData.getEnprTchnRList(),
                        "TB_BOX_IVT_ENPR_TCHN_R (기업 활용기술 분야)",
                        dataTransferRepo::deleteEnprTchnRAll,
                        dataTransferRepo::insertEnprTchnRBackup)
        );

        // 기업 투자희망 정보
        result.add(
                setIvtJsonBackupData(
                        backupData.getInvmHopeDList(),
                        "TB_BOX_IVT_INVM_HOPE_D (기업 투자희망 정보)",
                        dataTransferRepo::deleteInvmHopeDAll,
                        dataTransferRepo::insertInvmHopeDBackup)
        );

        // 기업 IR 기본
        result.add(
                setIvtJsonBackupData(
                        backupData.getIrBBsinMList(),
                        "TB_BOX_IVT_IR_B_BSIN_M (기업 IR 기본)",
                        dataTransferRepo::deleteIrBBsinMAll,
                        dataTransferRepo::insertIrBBsinMBackup)
        );

        // 기업 IR 투자유치
        result.add(
                setIvtJsonBackupData(
                        backupData.getIrBInvmDList(),
                        "TB_BOX_IVT_IR_B_INVM_D (기업 IR 투자유치)",
                        dataTransferRepo::deleteIrBInvmDAll,
                        dataTransferRepo::insertIrBInvmDBackup)
        );

        // 기업 IR 제품
        result.add(
                setIvtJsonBackupData(
                        backupData.getIrPPrdtDList(),
                        "TB_BOX_IVT_IR_P_PRDT_D (기업 IR 제품)",
                        dataTransferRepo::deleteIrPPrdtDAll,
                        dataTransferRepo::insertIrPPrdtDBackup)
        );

        // 기업 IR 주주
        result.add(
                setIvtJsonBackupData(
                        backupData.getIrSStchLList(),
                        "TB_BOX_IVT_IR_S_STCH_L (기업 IR 주주)",
                        dataTransferRepo::deleteIrSStchLAll,
                        dataTransferRepo::insertIrSStchLBackup)
        );

        // 기업 IR 진행도
        result.add(
                setIvtJsonBackupData(
                        backupData.getIrPgrsRtDList(),
                        "TB_BOX_IVT_IR_PGRS_RT_D (기업 IR 진행도)",
                        dataTransferRepo::deleteIrPgrsRtDAll,
                        dataTransferRepo::insertIrPgrsRtDBackup)
        );

        return result;
    }

    /**
     * Json Data 테이블 입력 처리 (테이블에 첨부파일이 매핑되어있는 경우)
     * @param backupDataList
     * @param targetNm
     * @param doSelectBeforeFileIds
     * @param doSelectBackupFileIds
     * @param doDelete
     * @param doInsert
     * @param <T>
     * @return
     * @throws Exception
     */
    private <T extends IvtJsonBackup> ResultUpdateTableVO setIvtJsonBackupDataWithDeleteFile(List<T> backupDataList,
                                                                                             String targetNm,
                                                                                             IvtCode.YnTypeEnum isPhysicalFileDel,
                                                                                             Supplier<List<String>> doSelectBeforeFileIds,
                                                                                             Function<List<T>, List<String>> doSelectBackupFileIds,
                                                                                             Supplier<Integer> doDelete,
                                                                                             Function<T, Integer> doInsert) throws Exception {

        // set result object
        ResultUpdateTableVO result = new ResultUpdateTableVO(targetNm);

        // null 체크만 처리함, 입력 데이터가 []이면 레코드만 지우기 위함
        if(backupDataList != null) {
            log.info("{} overwrite by backup start ============================>>", result.getTargetTableNm());

            AdminUserVO adminUserVO = new AdminUserVO(" ");

            // 현재 투자박스 파일 리스트 조회
            List<String> beforeFileIdList = doSelectBeforeFileIds != null ? doSelectBeforeFileIds.get() : new ArrayList<>();
            // 백업 데이터 목록 파일 리스트 조회
            List<String> backupFileIdList = doSelectBackupFileIds != null ? doSelectBackupFileIds.apply(backupDataList) : new ArrayList<>();

            // 현재 투자박스 데이터 삭제
            int delCnt = 0;
            if(doDelete != null) delCnt = doDelete.get();

            // backup data 등록 및 파일 아이디 제외
//            int insertCnt = filterRemoveFilesAndDoInsert.apply(backupDataList, deleteFileIdList);
            int insertCnt = 0;
            if(doInsert != null) for(T item : backupDataList) insertCnt = insertCnt + doInsert.apply(item);

            // -> 논리복구, 논리삭제 파일 아이디 분류 및 처리
            List<String> deleteFileIdList = beforeFileIdList.stream()
                    .filter(fileId -> !backupFileIdList.contains(fileId)).collect(Collectors.toList());

            List<String> recoverFileIdList = backupFileIdList.stream()
                    .filter(fileId -> !beforeFileIdList.contains(fileId)).collect(Collectors.toList());

            int deleteFileCnt = 0;
            int recoverFileCnt = 0;

            String deleteFileType = isPhysicalFileDel == IvtCode.YnTypeEnum.Y ? "Physical" : "Logical";

            if(isPhysicalFileDel == IvtCode.YnTypeEnum.Y) for(String fileId : deleteFileIdList) deleteFileCnt = deleteFileCnt + commonFileService.deleteFilePhysical(fileId, IvtCode.YnTypeEnum.N);
            else for(String fileId : deleteFileIdList) deleteFileCnt = deleteFileCnt + commonFileService.deleteFile(fileId, adminUserVO.getAdminUserId());

            for(String fileId : recoverFileIdList) recoverFileCnt = recoverFileCnt + dataTransferRepo.recoverFileInfoDelYnInOnlyTable(fileId, adminUserVO.getAdminUserId());

            log.info("Delete {} : {}", result.getTargetTableNm(), delCnt);
            log.info("Insert {} : {}", result.getTargetTableNm(), insertCnt);
            log.info("{} Delete {} Not Matched Before File ID List Size : {}", deleteFileType, result.getTargetTableNm(), deleteFileCnt);
            log.info("Logical Recover {} Not Matched Backup File ID List Size : {}",  result.getTargetTableNm(), recoverFileCnt);

            result.setInsertRecordCnt(insertCnt);
            result.setDeleteRecordCnt(delCnt);
            result.setDeleteType(deleteFileType);
            result.setDeleteNotMatchedBeforeFileListCnt(deleteFileCnt);
            result.setLogicalRecoverNotMatchedBackupFileListCnt(recoverFileCnt);
            result.setMessage("Overwrite by input list." + (backupDataList.size() > 0 ? "" : " (empty list)"));
        } else {
            result.setMessage("There is no item(null). Skip overwrite process.");
        }

        return result;
    }

    /**
     * Json Data 테이블 입력 처리
     * @param backupDataList
     * @param targetNm
     * @param doDelete
     * @param doInsert
     * @throws Exception
     */
    private <T extends IvtJsonBackup> ResultUpdateTableVO setIvtJsonBackupData(List<T> backupDataList,
                                                                               String targetNm,
                                                                               Supplier<Integer> doDelete,
                                                                               Function<T, Integer> doInsert) throws Exception {
        // set result object
        ResultUpdateTableVO result = new ResultUpdateTableVO(targetNm);

        // null 체크만 처리함, 입력 데이터가 []이면 레코드만 지우기 위함
        if(backupDataList != null) {
            log.info("{} overwrite by backup start ============================>>", result.getTargetTableNm());

            int delCnt = 0;
            if(doDelete != null) delCnt = doDelete.get();
            int insertCnt = 0;
            if(doInsert != null) for(T item : backupDataList) insertCnt = insertCnt + doInsert.apply(item);

            log.info("Delete {} Table : {}", result.getTargetTableNm(), delCnt);
            log.info("Insert {} Table : {}", result.getTargetTableNm(), insertCnt);

            result.setInsertRecordCnt(insertCnt);
            result.setDeleteRecordCnt(delCnt);
            result.setMessage("Overwrite by input list" + (backupDataList.size() > 0 ? "" : " (empty list)"));
        }

        else {
            log.info("There is no item(null). Skip overwrite process ({})", result.getTargetTableNm());
            result.setMessage("There is no item(null). Skip overwrite process.");
        }

        return result;
    }


    /*
     * 내장 함수형 인터페이스를 사용하여 람다식을 처리하는 것으로 수정했으나 (Supplier, Function)
     * dev eye deploy시 수정되지 않은 .java 파일의 리빌드가 발생하지 않아 spring bean 형성 과정에서 incompatible class change error가 발생하는 듯함.
     * -> 우선 해당 인터페이스 복구
     */
    @FunctionalInterface
    interface DeleteBackupRepoFunc { public abstract Integer deleteTable(); }
    @FunctionalInterface
    interface InsertBackupRepoFunc<T extends IvtJsonBackup>{ public abstract  Integer insertBackup(T item); }
}
