/** NOTICE LIST */
/** popup delete confirm */
const handleConfirmDelete = (confirmDelete, setConfirmDelete, setNoticeCheckAll, checkList) => {
  if (confirmDelete) {
    setConfirmDelete(false) // 삭제 컨펌 팝업 비활성화
  } else {
    let deleteList = checkList.filter((obj) => obj.checkbox.status === true)
    if (deleteList.length <= 0) {
      alert('삭제할 목록을 선택하세요')
    } else {
      setConfirmDelete(true) // 삭제 컨펌 팝업 활성화
    }
  }
}

/** delete notice item */

export { handleConfirmDelete }
