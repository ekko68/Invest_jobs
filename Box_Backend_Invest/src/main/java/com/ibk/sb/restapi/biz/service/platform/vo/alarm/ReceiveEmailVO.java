package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown=true)
@ApiModel( value="ReceiveEmailVO", description="IBK Email 발송 응답 정보" )
public class ReceiveEmailVO {

    private static final long serialVersionUID = 6745685925397018742L;

    @JsonIgnore
    @ApiModelProperty( name="등록결과", notes="등록결과", example="성공 : Status.OK | 실패 : Status.ERROR" )
    private String regRslt;

    @JsonIgnore
    @ApiModelProperty( name="등록결과메시지", notes="등록결과메시지", example="" )
    private String regRsltMsg;



    @ApiModelProperty( name="Email발송요청일련번호", notes="Email발송요청일련번호", example="" )
    private String emlSndgRqstSrn;

    @ApiModelProperty( name="발송결과내용", notes="발송결과내용", example="" )
    private String sndgRsltCon;

   

}
