package com.ibk.sb.restapi.app.common.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.util.StringUtils;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserVO {

    public AdminUserVO(String adminUserId) {
        this(adminUserId, null);
    }

    /**
     * 운영자 포탈 API, 배치 API 에서
     * CustomUser 대신 DB 등록 관리자 아이디 처리를 위함
     */
    private String adminUserId;

    /**
     * 운영자포탈과 로그인 시스템이 분리된 관계로
     * 아이디 유무 체크, 권한 체크 등 확인 요소 변경시
     * 해당 메서드 사용
     * @return
     */
    public boolean checkAdminAccess() {
        // 아이디 유무 검증
        if(!StringUtils.hasLength(this.adminUserId)) {
            return false;
        }
        return true;
    }

    /**
     * 그 외 추가 필드
     */

    // 대상 이용기관 ID
    // 사용 메서드 : IR 진행도 업데이트
    private String targetUsisId;

}
