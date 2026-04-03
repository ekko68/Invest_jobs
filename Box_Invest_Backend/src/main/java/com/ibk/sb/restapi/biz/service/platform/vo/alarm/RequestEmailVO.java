package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.util.List;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString 
@JsonIgnoreProperties(ignoreUnknown=true)
@ApiModel( value="RequestEmailVO", description="IBK Email 발송 요청 정보" )
public class RequestEmailVO {

    private static final long serialVersionUID = 4361301760022453955L;

    @ApiModelProperty( name="IBKBOX기업회원ID", notes="IBKBOX기업회원ID", required = true, example="" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String ibkboxEnmbId;

    /*@ApiModelProperty( name="전산고객번호", notes="전산고객번호", required=false, example="" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private Long edpsCsn;*/

    @ApiModelProperty( name="고객명", notes="고객명", required=true, example="" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String csm;

    @ApiModelProperty( name="발신이메일주소", notes="발신이메일주소", required=true, example="" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String dsmsEad;

    @ApiModelProperty( name="수신이메일주소", notes="수신이메일주소", required=true, example="" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String rcvEad;

    @ApiModelProperty( name="이메일제목명", notes="이메일제목명", required=true, example="" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String emlTtlNm;

    @ApiModelProperty( name="이메일본문내용", notes="이메일본문내용1", required=true, example="" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String emlThtxCon1;
    
    @ApiModelProperty( name="이메일발송요청 일련번호", notes="이메일발송요청 일련번호", required=true, example="" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String emlSndgRqstSrn;
}
