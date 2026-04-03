package com.ibk.sb.restapi.biz.service.ir.vo.progress;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Alias("RequestIRProgressVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class RequestIRProgressVO extends BaseTableVO {

    /**
     * 작업 진행도 업데이트 요청 VO
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 적용 IR 탭
    private String tabType;

    // 해당 탭 진척률
    private Integer tabProgress;

    private final List<String> TAB_TYPE_LIST = Arrays.stream(IvtCode.IrTabTypeEnum.values())
            .map(IvtCode.IrTabTypeEnum::getType).collect(Collectors.toList());

    /** 탭 타입 Setter 커스텀 **/
    public void setTabType(String tabType) {
        this.tabType = (TAB_TYPE_LIST.contains(tabType) && !tabType.equals(IvtCode.IrTabTypeEnum.IR_ALL.getType())) ? tabType : "FAIL";
    }

}
