package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import lombok.AllArgsConstructor;
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
@ApiModel( value="RequestSmsVO", description="IBK SMS 발송 요청 정보" )
public class RequestSmsVO {

    private static final long serialVersionUID = -3456945591022265501L;

    @ApiModelProperty(
            name="SMS전송종류코드", notes="SMS전송종류코드", required=true,
            example="회원 SMS전송 시 SMS와 MMS 종류를 구분하는 종류코드, S : SMS(단문) , M : MMS(장문)" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String smtsKcd;

    /*
    계정계 API 명세서 참고 :
    AH001 (회원가입 초대)
    AH002 (비대면계좌개설 안내)
    AH003 (심사완료 안내)
    AH004 (대출실행완료 안내)
    AH005 (큐레이션 등록 안내)
    AH006 (OPEN API 관리)
    AH007 (BOX 시스템)
     */
    @ApiModelProperty( name="SMS업무구분코드", notes="SMS업무구분코드", required=true, example="AH007" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String smsBswrDcd;



    /*@ApiModelProperty( name="전산고객번호", notes="전산고객번호", required=false, example="1" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private Long edpsCsn;*/

    @ApiModelProperty( name="SMS수신번호", notes="SMS수신번호", required=true, example="01099999999" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String smrvNo;

    @ApiModelProperty( name="SMS발신번호", notes="SMS발신번호", required=true, example="01099999999" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String smsDsmsNo;

    // smtsKcd가 "S"일 경우 필수 처리
    // 90byte 까지 입력가능
    @ApiModelProperty( name="SMS발신내용", notes="SMS발신내용", required=false, example="SMS발신내용 입니다." )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String smsDsmsCon;

    // smtsKcd가 "M"일 경우 필수 처리
    // 60 byte 까지 가능
    @ApiModelProperty( name="MMS제목명", notes="MMS제목명", required=false, example="MMS제목" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String mmsTtlNm;

    // 2000 byte 까지 가능
    @ApiModelProperty( name="MMS발신내용", notes="MMS발신내용", required=false, example="MMS발신내용 입니다." )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String mmsDsmsCon;
    
    @ApiModelProperty( name="요청부점코드", notes="2채널ARS인증총길이", required=false, example="0001" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String rqstBrcd;

    // 숫자형식 사번만 입력가능 (A, F 사번 입력시 오류)
    @ApiModelProperty( name="요청직원번호", notes="요청직원번호", required=false, example="099999" )
    @JsonInclude( JsonInclude.Include.NON_NULL )
    private String rqstEmn;
    
    
    


}
