package com.ibk.sb.restapi.biz.service.kipris;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.kipris.feign.KiprisFeign;
import com.ibk.sb.restapi.biz.service.kipris.vo.*;
import com.ibk.sb.restapi.biz.service.kipris.vo.response.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KiprisService {

    private final KiprisFeign kiprisFeign;

    public PagingVO<KiprisSummaryVO> testKiprisPagingList(RequestSearchKiprisVO requestSearchKiprisVO, String searchType) throws Exception {
        List<KiprisSummaryVO> result = new ArrayList<>();

        // 사업장번호 하이픈(-) 처리
        String bizNum = requestSearchKiprisVO.getBizNum().replaceAll("[^0-9]", "");
        if (bizNum.length() != 10) {
            throw new BizException(StatusCode.COM0005);
        }
        bizNum = bizNum.substring(0, 3) + "-" + bizNum.substring(3, 5) + "-" + bizNum.substring(5, 10);

        // 출원인번호 조회
        String applicantNum = "";
        KiprisApplicantResponseVO applicantResponse = kiprisFeign.getApplicant(bizNum);

        // 조회값이 있는 경우 출원인번호 세팅
        if (applicantResponse.getBody().getItems().getCorpBsApplicantInfo() != null && applicantResponse.getBody().getItems().getCorpBsApplicantInfo().size() > 0) {
            applicantNum = applicantResponse.getBody().getItems().getCorpBsApplicantInfo().get(0).getApplicantNumber();
        } else {
            return new PagingVO<>(requestSearchKiprisVO, result);
        }

        // 리스트 세팅 및 리턴
        List<KiprisSummaryVO> list = new ArrayList<>();
        switch (searchType) {

            // 특허 실용 페이징 조회
            case "IP":
                // IP 페이징 리스트 조회
                list = searchKiprisIpList(requestSearchKiprisVO, applicantNum);
                break;

            // 상표 페이징 조회
            case "TRADEMARK":
                // 상표 페이징 리스트 조회
                list = searchKiprisTradeMarkList(requestSearchKiprisVO, applicantNum);
                break;

            // 디자인 페이징 조회
            case "DESIGN":
                // 디자인 페이징 리스트 조회
                list = searchKiprisDesignList(requestSearchKiprisVO, applicantNum);
                break;
        }

        return new PagingVO<>(requestSearchKiprisVO, list);
    }

    /**
     * Kipris 각 탭별 총계 값 조회
     * @return
     * @throws Exception
     */
    public KiprisTotalVO searchKiprisTabTotal() throws Exception {

        // 리턴 객체
        KiprisTotalVO result = new KiprisTotalVO(0, 0, 0, "");

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 해당 메서드는 내정보 페이지 최초 로드시에 사용하므로 출원인 번호를 한번 거치게 되어있음
        String bizNum = user.getUserGroupBizNum();

        // 사업자 번호가 없다면 초기값 인스턴스 리턴
        if (!StringUtils.hasLength(bizNum)) {
            return result;
        }

        // 사업장번호 하이픈(-) 처리
        bizNum = bizNum.replaceAll("[^0-9]", "");
        if (bizNum.length() != 10) {
            throw new BizException(StatusCode.COM0005);
        }
        bizNum = bizNum.substring(0, 3) + "-" + bizNum.substring(3, 5) + "-" + bizNum.substring(5, 10);

        // 임시 사업자 번호
//        String bizNum = "107-81-34848";

        // 출원인번호 조회
        KiprisApplicantResponseVO applicantResponse = kiprisFeign.getApplicant(bizNum);

        // 조회값 없는 경우
        if(!(applicantResponse.getBody().getItems().getCorpBsApplicantInfo() != null && applicantResponse.getBody().getItems().getCorpBsApplicantInfo().size() > 0)) {
            return result;
        }

        // 출원인 번호 세팅
        result.setApplicantNumber(applicantResponse.getBody().getItems().getCorpBsApplicantInfo().get(0).getApplicantNumber());

        // 각 항목 총개수 조회
        KiprisIpResponseVO ipRes = kiprisFeign.getIpListResponse(result.getApplicantNumber(), 1, 1);
        KiprisTradeMarkResponseVO tmRes = kiprisFeign.getTradeMarkListResponse(result.getApplicantNumber(), 1, 1);
        KiprisDesignResponseVO designRes = kiprisFeign.getDesignListResponse(result.getApplicantNumber(), 1, 1);

        // 각 항목 송신 확인 및 총계 설정
        result.setIpTotalCnt(
                (ipRes != null && ipRes.getHeader() != null && ipRes.getHeader().getSuccessYN().equals(IvtCode.YnTypeEnum.Y.name()))
                        ? ipRes.getCount().getTotalCount() != null ? ipRes.getCount().getTotalCount() : 0
                        : 0
        );

        result.setTrademarkTotalCnt(
                (tmRes != null && tmRes.getHeader() != null && tmRes.getHeader().getSuccessYN().equals(IvtCode.YnTypeEnum.Y.name()))
                        ? tmRes.getCount().getTotalCount() != null ? tmRes.getCount().getTotalCount() : 0
                        : 0
        );

        result.setDesignTotalCnt(
                (designRes != null && designRes.getHeader() != null && designRes.getHeader().getSuccessYN().equals(IvtCode.YnTypeEnum.Y.name()))
                        ? designRes.getCount().getTotalCount() != null ? designRes.getCount().getTotalCount() : 0
                        : 0
        );

        return result;
    }


    /**
     * Kipris 페이징 리스트 조회
     *
     * @param requestSearchKiprisVO
     * @param kiprisTypeEnum
     * @return
     * @throws Exception
     */
    public PagingVO<KiprisSummaryVO> searchKiprisPagingList(RequestSearchKiprisVO requestSearchKiprisVO, IvtCode.KiprisTypeEnum kiprisTypeEnum) throws Exception {

        // 리턴할 리스트
        List<KiprisSummaryVO> resultList = new ArrayList<>();

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 출원인 번호 세팅
        String applicantNum = "";
        if (StringUtils.hasLength(requestSearchKiprisVO.getApplicantNumber())) {
            applicantNum = requestSearchKiprisVO.getApplicantNumber();
        } else {
            String bizNum = user.getUserGroupBizNum();

            // 사업자 번호가 없다면 빈 리스트 리턴
            if (!StringUtils.hasLength(bizNum)) {
                return new PagingVO<>(requestSearchKiprisVO, resultList);
            }

            // 사업장번호 하이픈(-) 처리
            bizNum = bizNum.replaceAll("[^0-9]", "");
            if (bizNum.length() != 10) {
                throw new BizException(StatusCode.COM0005);
            }
            bizNum = bizNum.substring(0, 3) + "-" + bizNum.substring(3, 5) + "-" + bizNum.substring(5, 10);

//            String bizNum = "107-81-34848";

            // 출원인번호 조회
            KiprisApplicantResponseVO applicantResponse = kiprisFeign.getApplicant(bizNum);

            // 조회값이 있는 경우 출원인번호 세팅
            if (applicantResponse.getBody().getItems().getCorpBsApplicantInfo() != null && applicantResponse.getBody().getItems().getCorpBsApplicantInfo().size() > 0) {
                applicantNum = applicantResponse.getBody().getItems().getCorpBsApplicantInfo().get(0).getApplicantNumber();
            } else {
                return new PagingVO<>(requestSearchKiprisVO, resultList);
            }
        }

        // 리스트 세팅 및 리턴
        List<KiprisSummaryVO> list = new ArrayList<>();

        if (kiprisTypeEnum == IvtCode.KiprisTypeEnum.IP) {
            list = searchKiprisIpList(requestSearchKiprisVO, applicantNum);
        } else if (kiprisTypeEnum == IvtCode.KiprisTypeEnum.TRADEMARK) {
            list = searchKiprisTradeMarkList(requestSearchKiprisVO, applicantNum);
        } else if (kiprisTypeEnum == IvtCode.KiprisTypeEnum.DESIGN) {
            list = searchKiprisDesignList(requestSearchKiprisVO, applicantNum);
        }

        return new PagingVO<>(requestSearchKiprisVO, list);
    }

    /**
     * Kipris IP 리스트 조회
     *
     * @param requestSearchKiprisVO
     * @param applicantNum
     * @return
     * @throws Exception
     */
    public List<KiprisSummaryVO> searchKiprisIpList(RequestSearchKiprisVO requestSearchKiprisVO, String applicantNum) throws Exception {

        List<KiprisSummaryVO> resultList = new ArrayList<>();

        KiprisIpResponseVO ipResponseVO = kiprisFeign.getIpListResponse(applicantNum, requestSearchKiprisVO.getPage(), requestSearchKiprisVO.getRecord());

        // 송신 확인
        if (!(ipResponseVO != null && ipResponseVO.getHeader() != null && ipResponseVO.getHeader().getSuccessYN().equals(IvtCode.YnTypeEnum.Y.name()))) {
            return resultList;
        }

        if (ipResponseVO.getBody().getItems().getItem() != null && ipResponseVO.getBody().getItems().getItem().size() > 0) {

            ipResponseVO.getBody().getItems().getItem().forEach(item -> {
                KiprisSummaryVO summaryVO = KiprisSummaryVO.builder()
                        .applicantNumber(applicantNum) // 출원인번호
                        .applicationNumber(item.getApplicationNumber()) // 출원번호
                        .applicationCon(item.getApplicationDate()) // 출원일자
                        .registrationNumber(item.getRegisterNumber()) // 등록번호
                        .registrationDate(item.getRegisterDate()) // 등록일자
                        .inventionName(item.getInventionTitle()) // 발명의 명칭
                        .applicationCon(item.getAstrtCont()) // 초록
                        .smImgUrl(item.getDrawing()) // 작은 이미지 경로
                        .bgImgUrl(item.getBigDrawing()) // 큰 이미지 경로
                        .build();

                resultList.add(summaryVO);
            });

            // 총 개수 처리
            resultList.get(0).setTotalCnt(ipResponseVO.getCount().getTotalCount());
        }
        return resultList;
    }

    /**
     * Kipris 상표 리스트 조회
     *
     * @param requestSearchKiprisVO
     * @param applicantNum
     * @return
     * @throws Exception
     */
    public List<KiprisSummaryVO> searchKiprisTradeMarkList(RequestSearchKiprisVO requestSearchKiprisVO, String applicantNum) throws Exception {

        List<KiprisSummaryVO> resultList = new ArrayList<>();

        KiprisTradeMarkResponseVO tmResponseVO = kiprisFeign.getTradeMarkListResponse(applicantNum, requestSearchKiprisVO.getPage(), requestSearchKiprisVO.getRecord());

        if (!(tmResponseVO != null && tmResponseVO.getHeader() != null && tmResponseVO.getHeader().getSuccessYN().equals(IvtCode.YnTypeEnum.Y.name()))) {
            return resultList;
        }

        // 리스트 세팅
        // 상표는 초록 없음
        if (tmResponseVO.getBody().getItems().getItem() != null && tmResponseVO.getBody().getItems().getItem().size() > 0) {

            tmResponseVO.getBody().getItems().getItem().forEach(item -> {
                KiprisSummaryVO summaryVO = KiprisSummaryVO.builder()
                        .applicantNumber(applicantNum) // 출원인번호
                        .applicationNumber(item.getApplicationNumber()) // 출원번호
                        .applicationCon(item.getApplicationDate()) // 출원일자
                        .registrationNumber(item.getRegistrationNumber()) // 등록번호
                        .registrationDate(item.getRegistrationDate()) // 등록일자
                        .inventionName(item.getTitle()) // 제목
                        .smImgUrl(item.getDrawing()) // 이미지 경로
                        .bgImgUrl(item.getBigDrawing()) // 큰 이미지 경로
                        .build();

                resultList.add(summaryVO);
            });

            // 총 개수 처리
            resultList.get(0).setTotalCnt(tmResponseVO.getCount().getTotalCount());
        }

        return resultList;
    }

    /**
     * Kirpris 디자인 리스트 조회
     *
     * @param requestSearchKiprisVO
     * @param applicantNum
     * @return
     * @throws Exception
     */
    public List<KiprisSummaryVO> searchKiprisDesignList(RequestSearchKiprisVO requestSearchKiprisVO, String applicantNum) throws Exception {
        List<KiprisSummaryVO> resultList = new ArrayList<>();

        KiprisDesignResponseVO designResponseVO = kiprisFeign.getDesignListResponse(applicantNum, requestSearchKiprisVO.getPage(), requestSearchKiprisVO.getRecord());

        // 송신 확인
        if (!(designResponseVO != null && designResponseVO.getHeader() != null && designResponseVO.getHeader().getSuccessYN().equals(IvtCode.YnTypeEnum.Y.name()))) {
            return resultList;
        }

        // 리스트 세팅
        // 디자인의 경우 초록 부분을 상세 조회로 추가 확인 필요
        if (designResponseVO.getBody().getItems().getItem() != null && designResponseVO.getBody().getItems().getItem().size() > 0) {

            for (KiprisDesignResponseVO.Items.Item item : designResponseVO.getBody().getItems().getItem()) {
                KiprisSummaryVO summaryVO = KiprisSummaryVO.builder()
                        .applicantNumber(applicantNum) // 출원인번호
                        .applicationNumber(item.getApplicationNumber()) // 출원번호
                        .applicationCon(item.getApplicationDate()) // 출원일자
                        .registrationNumber(item.getRegistrationNumber()) // 등록번호
                        .registrationDate(item.getRegistrationDate()) // 등록일자
                        .inventionName(item.getArticleName()) // 물품의 명칭
                        .build();

                // 상세 조회 및 창작 설명, 이미지 세팅
                KiprisDesignDetailResponseVO detailResponseVO = kiprisFeign.getDesignDetailResponse(item.getApplicationNumber());

                // 송신 확인
                if (!(detailResponseVO != null && detailResponseVO.getHeader() != null && detailResponseVO.getHeader().getSuccessYN().equals(IvtCode.YnTypeEnum.Y.name()))) {
                    continue;
                }

                KiprisDesignDetailResponseVO.Item detailItem = detailResponseVO.getBody().getItem();

                if (detailItem != null) {
                    // 창작의 내용 정보 세팅
                    if (detailItem.getCreativeDescriptionInfoArray() != null
                            && detailItem.getCreativeDescriptionInfoArray().getCreativeDescriptionInfo() != null
                            && detailItem.getCreativeDescriptionInfoArray().getCreativeDescriptionInfo().size() > 0) {

                        summaryVO.setApplicationCon(detailItem.getCreativeDescriptionInfoArray().getCreativeDescriptionInfo().get(0).getDesignDescription());
                    }

                    // 이미지 육면도 정보 세팅
                    if (detailItem.getBiblioSummaryInfoArray() != null
                            && detailItem.getBiblioSummaryInfoArray().getDesignImageInfoArray() != null
                            && detailItem.getBiblioSummaryInfoArray().getDesignImageInfoArray().getDesignImageInfo() != null
                            && detailItem.getBiblioSummaryInfoArray().getDesignImageInfoArray().getDesignImageInfo().size() > 0) {

                        List<KiprisDesignDetailResponseVO.Item.BiblioSummaryInfoArray.DesignImageInfoArray.DesignImageInfo.ImagePath> imgList
                                = detailItem.getBiblioSummaryInfoArray().getDesignImageInfoArray().getDesignImageInfo().get(0).getImagePath();

                        if (imgList != null && imgList.size() > 0) {
                            summaryVO.setSmImgUrl(imgList.get(0).getSmallPath());
                            summaryVO.setBgImgUrl(imgList.get(0).getLargePath());

                            List<String> smImgUrlList = new ArrayList<>();
                            List<String> bgImgUrlList = new ArrayList<>();

                            imgList.forEach(img -> {
                                smImgUrlList.add(img.getSmallPath());
                                bgImgUrlList.add(img.getLargePath());
                            });

                            summaryVO.setSmImgUrlList(smImgUrlList);
                            summaryVO.setBgImgUrlList(bgImgUrlList);
                        }
                    }
                }

                resultList.add(summaryVO);
            }

            // 총 개수 처리
            resultList.get(0).setTotalCnt(designResponseVO.getCount().getTotalCount());
        }

        return resultList;
    }

}
