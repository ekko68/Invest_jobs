import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import { useState } from 'react'
import { termFormatter } from 'modules/common'
import { NoImage02 } from 'modules/consts/Img'
import { fileDownloadMkt } from 'modules/utils/CommonUtils'

const BannerViewInfo = (props) => {
  /**
   * type must be : mainBanner | subBanner | prodBanner | eventBanner | popup
   * */
  const { data, type = null, linkToList, linkToWrite, handleDelete } = props
  const [confirmDelete, setConfirmDelete] = useState(false)

  // ===== 삭제 Confirm
  const handleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete)
  }

  // ===== 파일 다운로드
  const handleFileDownload = async (file) => {
    await fileDownloadMkt(file)
  }

  return (
    <>
      {confirmDelete && (
        <PopupConfirm msg={'삭제하시겠습니까?'}>
          <Button className={'full_grey_dark'} onClick={handleConfirmDelete}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleDelete}>
            확인
          </Button>
        </PopupConfirm>
      )}
      {/*table_wrap start*/}
      <div className="table_wrap">
        <table className="table_type02">
          <caption>{type === 'popup' ? '팝업' : '배너'} 정보 테이블</caption>
          <colgroup>
            <col width={'13%'} />
            <col width={'*'} />
          </colgroup>
          <tbody>
            <tr>
              <th className={'ta_left bg_light_grey'}>
                <p>제목</p>
              </th>
              <td>{data.ttl}</td>
            </tr>
            {type === 'mainBanner' && ( // 메인배너인 경우에만 출력
              <tr>
                <th className={'ta_left'}>
                  <p>부가설명</p>
                </th>
                <td>
                  <div className="content">{data.con}</div>
                </td>
              </tr>
            )}
            <tr>
              <th className={'ta_left'}>
                <p>링크</p>
              </th>
              <td>
                <p className="link highlight_blue">
                  <a href={data.link} target={'_blank'} rel="noopener noreferrer">
                    {data.link}
                  </a>
                </p>
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>기간</th>
              <td>
                <div className="date_input_wrap">
                  {termFormatter(data.stdy)} ~ {termFormatter(data.fnda)}
                </div>
              </td>
            </tr>
            <tr>
              <th className={'ta_left'}>
                <p>이미지 등록</p>
              </th>
              <td>
                {/*attach_content start*/}
                <div className="attach_content">
                  <div className="img_info_wrap">
                    <div className="img_wrap">
                      {data?.imgFileInfo?.fileId ? (
                        <button onClick={() => handleFileDownload(data.imgFileInfo)}>
                          <img src={data.imgUrl} alt={data.ttl} />
                          <figcaption className={'highlight_blue'}>{data.imgFileInfo?.fileNm}</figcaption>
                        </button>
                      ) : (
                        <div className="no_img">
                          <img src={NoImage02} alt="이미지 없음" />
                        </div>
                      )}
                    </div>

                    {/*<div className="img_wrap">*/}
                    {/*  {data.imgUrl ? (*/}
                    {/*    */}
                    {/*  ) : (*/}
                    {/*    <div className="no_img">*/}
                    {/*      <img src={NoImage02} alt="이미지 없음" />*/}
                    {/*    </div>*/}
                    {/*  )}*/}
                    {/*</div>*/}
                  </div>
                </div>
                {/*attach_content end*/}
              </td>
            </tr>
            {type === 'popupBanner' && (
              <tr>
                <th className={'ta_left'}>공개여부</th>
                <td>공개</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/*table_wrap end*/}
      <div className="rounded_btn_group">
        <Button className={'basic'} onClick={linkToList}>
          목록
        </Button>
        <Button className={'full_blue'} onClick={linkToWrite}>
          수정
        </Button>
        <Button className={'full_red'} onClick={handleConfirmDelete}>
          삭제
        </Button>
      </div>
    </>
  )
}

export default BannerViewInfo
