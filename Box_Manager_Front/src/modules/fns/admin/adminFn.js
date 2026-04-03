import Checkbox from 'components/atomic/Checkbox'
import React from 'react'

/** 권한 > 테이블 ui 2차 배열 생성. 예) json -> [[<td />, <td />, <td />, <td />], ...] */
export const makeUi = (list, handleChange) => {
  const newUiList = []

  for (const item of list) {
    let depth1_isUse = false
    let depth1 = item.menuId

    if (item?.lnbList && item.lnbList.length > 0) {
      // 중메뉴 있음.
      item['rowSpan'] = item.lnbList.reduce((acc, lnb) => (lnb?.subList?.length > 0 ? lnb?.subList?.length + acc : acc + 1), 0)

      for (const lnb of item?.lnbList) {
        let depth2_isUse = false
        let depth2 = lnb.menuId

        if (lnb.subList && lnb.subList.length > 0) {
          // 소메뉴 있는 경우..
          lnb['rowSpan'] = lnb.subList.length

          // tr 안쪽 td 생성(소메뉴 있음).
          for (const sub of lnb.subList) {
            if(sub?.checked == "N" || sub?.checked === false){
              sub['checked'] = false;
            }else if(sub?.checked == "Y" || sub?.checked === true){
              sub['checked'] = true;
            }

            // prettier-ignore
            newUiList.push([
              depth1_isUse ? undefined : (<th key={item.menuId} rowSpan={item.rowSpan}>{item.menuNm}</th>),
              depth2_isUse ? undefined : (<th key={`${item.menuId}_${lnb.menuId}`} rowSpan={lnb.rowSpan}>{lnb.menuNm}</th>),
              <th key={`${item.menuId}_${lnb.menuId}_${sub.menuId}`}>{sub.menuNm}</th>,
              <td key={`${item.menuId}_${lnb.menuId}_${sub.menuId}_checkbox`} className={"ta_center"} >
                <Checkbox
                    className="type02"
                    checkbox={{ id: sub.menuId, value: '' }}
                    name="menuCheckBox"
                    checked={sub['checked']}
                    onChange={(e) => handleChange(e, sub.menuId)}
                />
              </td>
            ])
            // td에 rowSpan값이 있다면 td 생성 방지용.
            if (!depth1_isUse && depth1 === item.menuId) depth1_isUse = true
            if (!depth2_isUse && depth2 === lnb.menuId) depth2_isUse = true
          }
        } else {

          if(lnb?.checked == "N" || lnb?.checked === false){
            lnb['checked'] = false;
          }else if(lnb?.checked == "Y" || lnb?.checked === true){
            lnb['checked'] = true;
          }

          // tr 안쪽 td 생성(소메뉴 없음).
          newUiList.push([
            depth1_isUse ? undefined : <th key={item.menuId}>{item.menuNm}</th>,
            depth2_isUse ? undefined : <th key={`${item.menuId}_${lnb.menuId}`}>{lnb.menuNm}</th>,
            <th key={`${lnb.menuId}_undefined`} />,
            <td key={`${lnb.menuId}_undefined_checkbox`} className={'ta_center'}>
              <Checkbox
                  className="type02"
                  checkbox={{ id: lnb.menuId, value: '' }}
                  name="menuCheckBox"
                  checked={lnb['checked']}
                  onChange={(e) => handleChange(e, lnb.menuId)}
              />
            </td>
          ])
          // td에 rowSpan값이 있다면 td 생성 방지용.
          if (!depth1_isUse && depth1 === item.menuId) depth1_isUse = true
          if (!depth2_isUse && depth2 === lnb.menuId) depth2_isUse = true
        }
      }
    } else {
      // if (item.menuId !== 'admin') {
      //   // 중메뉴 없음.
      //   newUiList.push([
      //     <th key={`${item.menuId}`}>{item.menuNm}</th>,
      //     <th key={`${item.menuId}_undefined`} />,
      //     <th key={`${item.menuId}_undefined_undefined`} />,
      //     <td key={`${item.menuId}_undefined_undefined_checkbox`} className={'ta_center'} />
      //   ])
      // }
      newUiList.push([
        <th key={`${item.menuId}`}>{item.menuNm}</th>,
        <th key={`${item.menuId}_undefined`} />,
        <th key={`${item.menuId}_undefined_undefined`} />,
        <td key={`${item.menuId}_undefined_undefined_checkbox`} className={'ta_center'} />
      ])
    }
  }

  return newUiList
}

// ** validCheck
// 필수값 체크 : require,
// 패스워드 확인 : mismatch,
// 비밀번호 8글자 이상 20글자 이하: pwdLength,
// 비밀번호 숫자, 소문자, 대문자 : pwdCheck
// 비밀번호 특수문자 포함: pwdSpecial
// 비밀번호 연속문자 4번이상 : pwdRow
// 이메일유효성 : emailValid
export const adminWriteValidCheck = (type, val) => {
  switch(type){
    case "idCheck":
      if(val.replace(/^\s+|\s+$/g,'').length < 3){
        return {
          state : false,
          msg : "아이디는 공백을 제외한 3자리 이상으로 작성해주세요."
        };
      }
      break;
    case "nameCheck":
      if(val.replace(/^\s+|\s+$/g,'').length < 2){
        return {
          state : false,
          msg : "이름은 공백을 제외한 2자리 이상으로 작성해주세요."
        };
      }
      break;
    case "pwdCheck":
      if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/.test(val)) {
        return {
          state : false,
          msg : "비밀번호는 8~20자 이내로 영문 대소문자,숫자,특수문자, 중 3가지 이상 혼용하여 입력해 주세요."
        };
      }
      if (!/[~!@#$%";'^,&*()_+|</>=>`?:{[}]/g.test(val)) {
        return {
          state : false,
          msg : "비밀번호는 8~20자 이내로 영문 대소문자,숫자,특수문자, 중 3가지 이상 혼용하여 입력해 주세요."
        };
      }
      // eslint-disable-next-line no-case-declarations
      let cnt = 0
      for (let i = 0; i < String(val).length; i++) {
        if (String(val)[i] === String(val)[i + 1]) {
          cnt++
        }
      }
      if (cnt + 1 >= 4) {
        return {
          state : false,
          msg : "연속된 숫자 또는 4자 이상의 동일 문자는 비밀번호로 사용할 수 없습니다."
        };
      }
      break;
    case "emailCheck":
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
        return {
          state : false,
          msg : "이메일 형식이 올바르지 않습니다."
        };
      }
      break;
    case "phoneCheck":
      if (!/^\d{3}-\d{3,4}-\d{4}$/.test(val)) {
        return {
          state : false,
          msg : "휴대폰번호 형식이 올바르지 않습니다."
        };
      }
      break;
    case "telCheck":
      if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(val)) {
        return {
          state : false,
          msg : "전화번호 형식이 올바르지 않습니다."
        };
      }
      break;
    default:
      if(val.replace(/^\s+|\s+$/g,'') == ''){
        return {
          state : false,
          msg : "입력값이 공백입니다."
        };
      }
  }

  return {
    state : true,
    msg : ""
  }
}
