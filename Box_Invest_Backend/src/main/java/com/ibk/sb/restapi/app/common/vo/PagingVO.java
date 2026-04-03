package com.ibk.sb.restapi.app.common.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PagingVO<T extends BaseTableVO> {

    private Integer page = 0, record = 0;

    private Integer total = 0; // 총 데이터 수

    private Integer totalPage = 0; // 총 페이지 수

    private Integer startPage = 0, endPage = 0; // 화면의 페이지 시작, 끝번호

    private boolean prev = false, next = false; // 이전 다음 유무

    private List<T> list = new ArrayList<>(); // DB 리스트 데이터


    /**
     * PagingVO 생성자 세팅
     * @param pageVO requestPage 정보 : page, record, pageSize
     * @param list DB 조회 정보 (totalCnt 값이 세팅되어야 함)
     */
    public PagingVO(PageVO pageVO, List<T> list) { // total 값 체크를 위해 따로 파라미터를 세팅
        this(pageVO, list, list != null && list.size() > 0 ? list.get(0).getTotalCnt() : 0);
    }

    /**
     * PagingVO 생성자 세팅
     * @param pageVO requestPage 정보 : page, record, pageSize
     * @param list DB 조회 정보
     * @param total 전체 Table 레코드 수
     */
    public PagingVO(PageVO pageVO, List<T> list, Integer total) {

        this.total = total;
        this.list = list;

        if(pageVO.getPage() != null && pageVO.getRecord() != null) {
            this.page = pageVO.getPage();
            this.record = pageVO.getRecord();

            // 총 페이지 수 세팅
            this.totalPage = (int) (Math.ceil((total * 1.0) / pageVO.getRecord()));

            // 임시 끝번호, 시작번호 세팅
            this.endPage = (int) (Math.ceil(pageVO.getPage() / (pageVO.getPageSize() * 1.0))) * pageVO.getPageSize();
            this.startPage = this.endPage - (pageVO.getPageSize() - 1);

            // 끝번호 유효성 확인
            if(totalPage < this.endPage) {
                this.endPage = totalPage;
            }

            // prev, next 확인
            this.prev = this.startPage > 1;
            this.next = this.endPage < totalPage;
        }

        // request의 page 혹은 record가 null 로 입력될 경우
        // -> 1 page의 모든 리스트 조회로 처리한다.
        else {
            this.page = 1;
            this.record = null;
            
            this.totalPage = 1;
            this.startPage = 1;
            this.endPage = 1;

            this.prev = false;
            this.next = false;
        }
    }
}
