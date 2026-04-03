package com.ibk.sb.restapi.biz.service.vc.vo.base;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import com.ibk.sb.restapi.biz.service.admin.vo.BoxIvtFileVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Alias("VcOperationReportVO")
@JsonIgnoreProperties({
        "delYn", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs", "amnnUserNm","rvsRnum",
        "totalCnt", "rnum", "imgFileId", "imgUrl", "rptDsncPrev", "rgsnUserNm"
})
public class VcOperationReportVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_CNRN_ORRP_M
     */

    // 투자사ID
    private String invtId;

    // 보고서구분
    private String rptDsnc;

    // 기존_보고서구분 (수정 때 사용)
    private String rptDsncPrev;

    // 파일ID
    private String fileId;

    // 파일이름
    private String fileNm;

    // 최종제출일
    private String lada;

}
