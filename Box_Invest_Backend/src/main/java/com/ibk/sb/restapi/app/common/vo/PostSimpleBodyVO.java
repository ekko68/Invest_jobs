package com.ibk.sb.restapi.app.common.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PostSimpleBodyVO {

    @Getter
    @Setter
    public static class SimpleIdBody {
        private String id;
        private List<String> idList;
    }

    @Getter
    @Setter
    public static class SimpleFileBody {
        private String fileId;
        private String fileNm;
        private Long fileSize;
        private String fileExt;
        private String fileMime;
    }

    @Getter
    @Setter
    public static class SimpleSearchContent {
        private String searchContent;
        private String checkYn;
        private String type;
    }
}
