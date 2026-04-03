package com.ibk.sb.restapi.biz.service.platform.vo.common;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class BoxFileResVO {

    private String inptDelYn;

    private String fileMngmNo;

    private Integer fileSqn;

    private List<BoxFileInfoVO> list;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class BoxFileInfoVO {

        private String fileMngmNo;
        private String fileNm;
        private String ibkboxSvcDcd;
        private String fileClsfDcd;
        private String filePathNm;
        private String fileJobScreId;
        private String fileJobScreNm;
        private String filePtrnNm;

        private Integer fileSqn;
        private Integer flszVl;

        private String thmlFileYn;
        private String orcpFileNm;
        private String etcRmrkCon;
        private String sysLsmdId;
        private String thmlFileMngmNo;
        private String thmlFileSqn;
        private String delYn;
        private String thmlFilePathNm;
        private String thmlFileNm;
        private String thmlOrcpFileNm;
        private String rgptDcd;
        private String fileRgsnYmd;
    }
}
