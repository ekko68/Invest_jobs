package com.ibk.sb.restapi.biz.service.admin;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.util.DateUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFileUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormVO;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminStatisticsRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminStatisticsSearchVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminStatisticsVO;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.vo.VisitorCountVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminStatisticsService {

    private final AdminStatisticsRepo repo;
    private final CommonFileService fileService;

    /**
     * 운영자 포탈 - 통계 (기간별 방문자 목록 조회)
     * 엑셀 필드명 어노테이션 처리를 위해 투자박스와 지네릭 타입 다르게 함
     * @return
     */
    public PagingVO<VisitorCountVO> searchVisitorStatList(AdminStatisticsSearchVO params) throws Exception {
        // 날짜 포맷 세팅
        params.setSearchFromDate(DateUtil.checkFormat(params.getSearchFromDate()));
        params.setSearchToDate(DateUtil.checkFormat(params.getSearchToDate()));
        // 리스트 조회 및 페이징 처리
        return new PagingVO<>(params, repo.selectVisitorStatList(params));
    }

    /**
     * 운영자 포탈 - 통계 (기간별 방문자 합계 조회)
     * @return
     */
    public int searchVisitorStatTotal(AdminStatisticsSearchVO params) throws Exception {
        // 날짜 포맷 세팅
        params.setSearchFromDate(DateUtil.checkFormat(params.getSearchFromDate()));
        params.setSearchToDate(DateUtil.checkFormat(params.getSearchToDate()));
        // 리스트 조회 및 페이징 처리
        Integer result = repo.selectVisitorStatTotal(params);
        return result == null ? 0 : result;
    }

    /**
     * 운영자 포탈 - 통계 (기간별 방문자 목록 엑셀 다운로드)
     * @return
     */
    public void visitorStatListExcelDownload(AdminStatisticsSearchVO params, HttpServletResponse response) throws Exception {
        // 페이징 처리 제외 설정
        params.setPage(null);
        params.setRecord(null);

        // 날짜 포맷 세팅
        params.setSearchFromDate(DateUtil.checkFormat(params.getSearchFromDate()));
        params.setSearchToDate(DateUtil.checkFormat(params.getSearchToDate()));

        // 타이틀 세팅
        String title = "투자박스_기간별_방문자목록_(" + params.getSearchFromDate() + "_" + params.getSearchToDate() + ")";

        // 데이터 조회
        List<VisitorCountVO> searchList = repo.selectVisitorStatList(params);
        Integer searchTotal = repo.selectVisitorStatTotal(params);
        searchTotal = searchTotal == null ? 0 : searchTotal;

        // Excel Form VO 설정
        ExcelFormVO excelFormVO = new ExcelFormVO(VisitorCountVO.class, searchList, title);

        excelFormVO.setHeaderTitle(title);
        excelFormVO.setLastTotalRowNm("합계");
        excelFormVO.setLastTotalRowData(searchTotal);

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }

    /**
     * 운영자 포탈 - 통계 (진행 상태별 통계 목록 조회)
     * @return
     */
    public PagingVO<AdminStatisticsVO> searchIvExamStatList(ComCode status, AdminStatisticsSearchVO params) throws Exception {
        params.setInvmExntPgsgCd(status.getCode());
        return new PagingVO<>(params, repo.selectIvExamStatList(params));
    }

    /**
     * 운영자 포탈 - 통계 (진행 상태별 통계 합계 조회)
     * @param status
     * @param params
     * @return
     */
    public int searchIvExamStatTotal(ComCode status, AdminStatisticsSearchVO params) throws Exception {
        params.setInvmExntPgsgCd(status.getCode());
        return repo.selectIvExamStatTotal(params);
    }

    /**
     * 운영자 포탈 - 통계 (투자심사 진행상태별 엑셀 다운로드)
     * @param status
     * @param params
     * @throws Exception
     */
    public void ivExamStatExcelDownload(ComCode status, AdminStatisticsSearchVO params, HttpServletResponse response) throws Exception {

        // 공통코드 및 페이징 처리 제외 설정
        params.setInvmExntPgsgCd(status.getCode());
        params.setPage(null);
        params.setRecord(null);

        // 날짜 포맷 세팅
        params.setSearchFromDate(DateUtil.checkFormat(params.getSearchFromDate()));
        params.setSearchToDate(DateUtil.checkFormat(params.getSearchToDate()));

        // 타이틀 세팅
        String title = "투자심사_" + status.getName() + "_(" + params.getSearchFromDate() + "_" + params.getSearchToDate() + ")";

        // 데이터 조회
        List<AdminStatisticsVO> searchList = repo.selectIvExamStatList(params);
        int searchTotal = repo.selectIvExamStatTotal(params);

        // Excel Form VO 설정
        ExcelFormVO excelFormVO = new ExcelFormVO(AdminStatisticsVO.class, searchList, title);

        excelFormVO.setHeaderTitle(title);
        excelFormVO.setLastTotalRowNm("총");
        excelFormVO.setLastTotalRowData(Long.toString(searchTotal) + " 건");

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }
}
