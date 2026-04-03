package com.ibk.sb.restapi.biz.service.message.repo;

import com.ibk.sb.restapi.biz.service.message.vo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MessageRepo {


    /** SELECT **/

    // 읽지 않은 수신메시지 카운트
    public Integer selectUnreadReceiveMessageCount(@Param("rcvInttId") String rcvInttId,
                                                   @Param("invmExntRqstId") String invmExntRqstId);

    // 수신, 발신 parent 메시지 목록 조회
//    public List<MessageSummaryVO> selectParentMessageList(RequestMessageVO requestMessageVO);

    // child 메시지 목록 조회
//    public List<MessageSummaryVO> selectChildMessageList(@Param("prnsMsgId") String prnsMsgId,
//                                                         @Param("utlinsttId") String utlinsttId);

    // 수신, 발신 메시지 목록 조회
    public List<MessageSummaryVO> selectMessageList(RequestMessageVO requestMessageVO);

    // 투자심사 메시지 리스트 조회
    public List<MessageSummaryVO> selectAuditMessageList(RequestAuditMessageVO requestAuditMessageVO);

    // 메시지 상세 조회
    public MessageVO selectMessage(@Param("msgId") String msgId);

    // 메시지 첨부파일 리스트 조회
    public List<MessageFileVO> selectMessageFileList(@Param("msgId") String msgId);

    /** INSERT **/

    // 메시지 등록
    public Integer insertMessage(MessageVO messageVO);

    // 메시지 첨부파일 매핑 등록
    public Integer insertMessageFileMapping(MessageFileVO messageFileVO);

    // 투자심사 메시지 매핑 등록
    public Integer insertAuditMessageMapping(@Param("invmExntRqstId") String invmExntRqstId,
                                             @Param("msgId") String msgId,
                                             @Param("rgsnUserId") String rgsnUserId);

    // 기업 사업문의 메시지 등록
    public Integer insertBizAskMessage(RequestBizAskMessageVO requestBizAskMessageVO);

    /** UPDATE **/

    // 메시지 읽음 여부 수정
    public Integer updateMessageRead(@Param("msgId") String msgId,
                                     @Param("amnnUserId") String amnnUserId);

    // 메시지 전체 읽음 여부 수정
    public Integer updateMessageReadAllSeparateByListType (RequestMessageReadAllVO requestMessageReadAllVO);

}
