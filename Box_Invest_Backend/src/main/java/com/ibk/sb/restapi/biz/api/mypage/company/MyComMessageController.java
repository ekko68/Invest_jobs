package com.ibk.sb.restapi.biz.api.mypage.company;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.BadgePagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.message.MessageService;
import com.ibk.sb.restapi.biz.service.message.vo.MessageSummaryVO;
import com.ibk.sb.restapi.biz.service.message.vo.MessageVO;
import com.ibk.sb.restapi.biz.service.message.vo.RequestMessageVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
@Api(tags = {"기업 마이페이지 메시지 서비스 API"})
@RequestMapping(path = {"/api/my/company/message", "/api/iv/v1/my/company/message"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class MyComMessageController {

    private final MessageService messageService;

    /** ================================ Get Method Mapping ================================ **/

    /**
     * Category: 마이페이지(기업)
     * Page: 대시보드
     * 최근 메시지 목록 조회
     * @return
     */
    @ApiOperation(value = "최근 메시지 목록 조회")
    @GetMapping("/recent/list")
    public ResponseData searchCompanyRecentMessageList() throws Exception {

        List<MessageSummaryVO> recentMessageList = messageService.searchRecentMessageList();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(recentMessageList)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 대시보드, 메시지
     * 메시지 상세 조회
     * @return
     */
    @ApiOperation(value = "메시지 상세 조회")
    @GetMapping("/detail/{id}")
    public ResponseData searchCompanyMessage(@PathVariable("id") String id) throws Exception {
        MessageVO messageVO = messageService.searchMessageWithLoginInfo(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(messageVO)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 메시지
     * 받은 메시지 목록 조회
     * @return
     */
    @ApiOperation(value = "받은 메시지 목록 조회")
    @GetMapping("/receive/list")
    public ResponseData searchCompanyReceiveMessage(RequestMessageVO requestMessageVO) throws Exception {
        BadgePagingVO<MessageSummaryVO> receiveMsgList = messageService.searchReceiveMessageList(requestMessageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(receiveMsgList)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 메시지
     * 받은 메시지 카운트 조회
     * @return
     */
    @ApiOperation(value = "받은 메시지 카운트 조회")
    @GetMapping("/receive/count")
    public ResponseData searchCompanyReceiveMessage() throws Exception {
        int receiveCnt = messageService.searchUnreadReceiveMessageCnt(null);
        HashMap<String, Integer> result = new HashMap<>();
        result.put("receiveCnt", receiveCnt);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }



    /**
     * Category: 마이페이지(기업)
     * Page: 메시지
     * 보낸 메시지 목록 조회
     * @return
     */
    @ApiOperation(value = "보낸 메시지 목록 조회")
    @GetMapping("/send/list")
    public ResponseData searchCompanySendMessage(RequestMessageVO requestMessageVO) throws Exception {
        PagingVO<MessageSummaryVO> sendMsgList = messageService.searchSendMessageList(requestMessageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(sendMsgList)
                .build();
    }



    /** ================================ Post Method Mapping ================================ **/

    /**
     * Category: 마이페이지(기업)
     * Page: 메시지
     * 메시지 답장하기
     * @param messageVO
     * @return
     */
    @ApiOperation(value = "메시지 답장하기")
    @PostMapping("/reply")
    public ResponseData replyMessage(@RequestBody MessageVO messageVO) throws Exception {
        messageService.replyMessage(messageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }


    /**
     * Category: 마이페이지(기업)
     * Page: 메시지
     * 메시지 전체 읽음 요청
     * @return
     */
    @ApiOperation(value = "메시지 전체 읽음 요청")
    @PostMapping("/read/all/{type}")
    public ResponseData saveCompanyMessageReadAll(@PathVariable("type") String type) throws Exception {

        IvtCode.TransmitTypeEnum typeEnum = null;

        if(StringUtils.hasLength(type)) {
            if(type.equals("receive")) typeEnum = IvtCode.TransmitTypeEnum.RECEIVE;
            else if(type.equals("send")) typeEnum = IvtCode.TransmitTypeEnum.SEND;
        }

        messageService.saveCompanyMessageReadAll(typeEnum);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

}
