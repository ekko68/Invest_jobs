package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
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
@ApiModel( value="ReceiveSmsVO", description="IBK SMS 발송 응답 정보" )
public class ReceiveSmsVO {

    private static final long serialVersionUID = 4170677520378353640L;

    @JsonIgnore
    @ApiModelProperty( name="등록결과", notes="등록결과", example="성공 : Status.OK | 실패 : Status.ERROR" )
    private String regRslt;

    @JsonIgnore
    @ApiModelProperty( name="등록결과메시지", notes="등록결과메시지", example="" )
    private String regRsltMsg;
    
    @ApiModelProperty( name="SMS요청결과코드", notes="SMS요청결과코드", required=true, example="0000" )
    private String smsRqstRucd;

    @ApiModelProperty( name="SMS일련번호", notes="SMS일련번호", required=true, example="1" )
    private long smsSrn;

    @ApiModelProperty( name="SMS발송결과내용", notes="SMS발송결과내용", required=true, example="SMS발송 결과입니다." )
    private String sndgRsltCon;

   

}
