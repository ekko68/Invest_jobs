package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ts;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class TsIvtBackupVO {

    /** @Alias 적용을 위해 내부클래스가 아니라 각각 class 파일 생성 */

    @JsonProperty("TB_BOX_IVT101M")
    private List<Ivt101M> ivt101MList;

    @JsonProperty("TB_BOX_IVT102M")
    private List<Ivt102M> ivt102MList;

    @JsonProperty("TB_BOX_IVT103M")
    private List<Ivt103M> ivt103MList;

    @JsonProperty("TB_BOX_IVT107M")
    private List<Ivt107M> ivt107MList;

    @JsonProperty("TB_BOX_IVT201M")
    private List<Ivt201M> ivt201MList;

    @JsonProperty("TB_BOX_IVT301M")
    private List<Ivt301M> ivt301MList;

    @JsonProperty("TB_BOX_IVT401H")
    private List<Ivt401H> ivt401HList;
}
