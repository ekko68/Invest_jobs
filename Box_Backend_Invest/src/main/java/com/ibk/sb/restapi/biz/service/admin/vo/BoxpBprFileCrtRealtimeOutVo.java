package com.ibk.sb.restapi.biz.service.admin.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import org.springframework.lang.Nullable;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class BoxpBprFileCrtRealtimeOutVo {

	@Nullable
	@ApiModelProperty( name="기본정보", notes="기본정보")
	private Common common;

	@Nullable
	@ApiModelProperty( name="인덱스키", notes="인덱스키")
	private IndexKeyType indexKey;

	@Nullable
	@ApiModelProperty( name="메타데이터", notes="메타데이터")
	private MetaData metaData;

	@Nullable
	@ApiModelProperty( name="BPR문서목록", notes="BPR문서목록")
	private BprDoc[] bprDocs;

	@Nullable
	@ApiModelProperty( name="파일정보", notes="파일정보")
	private FileInfo fileInfo;

	@Getter
	@Setter
	public static class Common {
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String businessCode;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String routingCode;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String affairsID;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String scanUserID;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String sendUserID;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String branchCode;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String resend;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String append;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String quickFlag;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String sendDate;
	}

	@Getter
	@Setter
	public static class IndexKeyType {
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String indexKey;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String packingKey;
	}


	@Getter
	@Setter
	public static class MetaData {
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String mapId;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String admBrcd;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String rnno;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String csno;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String csnm;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String reprNm;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String repIndxKey;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String chrmEmno;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String edpsCsn;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String trnYmd;
	}

	@Getter
	@Setter
	public static class FileInfo {
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private List<tifsItem> tifs;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private infItem inf;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private int totalCount;
	}

	@Getter
	@Setter
	public static class tifsItem {
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String formCode;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String fileName;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String filePath;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String pageCount;
	}

	@Getter
	@Setter
	public static class infItem {
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String fileName;
		
		@Nullable
		@ApiModelProperty( name="", notes="", required=false, example="" )
		private String filePath;
	}

	@Getter
	@Setter
	public static class BprDoc{

		@ApiModelProperty( name="서식코드", notes="서식코드", example="999999" )
		private String formCode;

		@ApiModelProperty( name="파일경로목록", notes="파일경로목록", example="999999" )
		private String[] filePaths;
	}
}
