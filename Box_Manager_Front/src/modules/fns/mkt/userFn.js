// ===== agency
export const handleConfirmPopup = (type, confirm, setConfirm, params) => {
  if (!type || confirm.status) {
    setConfirm({
      type: null,
      status: false,
      msg: '',
      params: {}
    })
    return
  } else {
    /** type: 권한해제(authCancel), 요청반려(reject) */
    let msg = ''

    type === 'authCancel'
      ? (msg = '에이전시 권한을 해제하시겠습니까?')
      : type === 'reject'
      ? (msg = '에이전시 요청을 반려하시겠습니까?')
      : ''
    setConfirm({
      type: type,
      status: true,
      msg: msg,
      params: params ? params : {}
    })
  }
}

export const handleAlertPopup = (type, alert, setAlert) => {
  /** type: 승인(complete), 권한해제(authCancel), 요청반려(rejectCancel), 확인(confirm) */
  if (!type || alert.status) {
    setAlert({
      type: type,
      status: false,
      msg: ''
    })
    return
  }

  let msg = ''
  type === 'approve'
    ? (msg = '승인 완료되었습니다.')
    : type === 'cancelRequest'
    ? (msg = '권한이 해제되었습니다.')
    : type === 'reject'
    ? (msg = '에이전시 권한 요청이\n반려되었습니다.')
    : ''

  setAlert({
    type: type,
    status: true,
    msg: msg
  })
}
