import Button from 'components/atomic/Button'
import Toggle from 'components/Toggle'
import { NoImage } from 'modules/consts/Img'

const Form = (props) => {
  const {
    contTxt = true, // 이미지 텍스트 필요없음 체크 (boolean)
    btnTxt = true, // 링크버튼 텍스트 필요없음 체크 (boolean)
    item,
    title,
    idx,
    id,
    handleAddImage,
    handleGetImageFileInfo,
    handleConfirmDelete,
    handleToggle,
    handleChangeInputTexts
  } = props

  if (item) {
    return (
      <div className="banner_section">
        <h4 className="page_title">{`${title}${idx + 1}`}</h4>
        <div className="banner_img_wrap" onClick={(e) => handleAddImage(item?.bnnrSqn)}>
          {!item?.fileInfo?.imgUrl ? (
            <img src={NoImage} alt={'이미지없음'} />
          ) : (
            <img src={item?.fileInfo?.imgUrl} alt={item?.bnnrPhrsCon ? item?.bnnrPhrsCon : '배너이미지'} />
          )}
        </div>
        <div className="banner_upload_wrap">
          {/*banner_upload_row start*/}
          <div className="banner_upload_row">
            <p className="label">이미지 업로드</p>
            <div className="banner_upload">
              <input
                type="text"
                className={'input require'}
                placeholder={'필수 입력 항목입니다.'}
                defaultValue={item?.fileInfo?.fileNm}
                readOnly
                id={`banner_filename_${item?.bnnrSqn}`}
                name={`banner_filename_${item?.bnnrSqn}`}
                onClick={(e) => handleAddImage(item?.bnnrSqn)}
                title={'이미지업로드'}
                key={item?.fileInfo?.fileNm}
              />
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                className={'input require'}
                hidden
                id={`banner_file_${item?.bnnrSqn}`}
                name={`banner_file_${item?.bnnrSqn}`}
                onChange={handleGetImageFileInfo}
                title={'파일업로드'}
              />
              <Button className={'basic btn_upload'} onClick={(e) => handleAddImage(item?.bnnrSqn)}>
                파일첨부
              </Button>
              {/* @todo 삭제 후 저장까지 눌러야 완전히 삭제됨 */}
              <Button className={'full_blue btn_delete'} onClick={(e) => handleConfirmDelete(item?.bnnrSqn)}>
                삭제
              </Button>
              {/*toggle start*/}
              <Toggle
                className="theme_blue"
                data={{
                  id: `toggle_${id}`,
                  value: item?.expuYn === 'Y' ? 'ON' : 'OFF',
                  status: item?.expuYn === 'Y' ? true : false
                }}
                onChange={(e) => handleToggle(e, item?.bnnrSqn)}
              />
              {/*toggle end*/}
            </div>
          </div>
          {/*banner_upload_row end*/}
          {/*banner_upload_row start*/}
          <div className="banner_upload_row" style={{ height: '84px', display: `${contTxt ? 'flex' : 'none'}` }}>
            <p className="label">이미지 텍스트</p>
            <div className="textarea_form" style={{ height: '84px', padding: '0 0 8px 0' }}>
              <textarea
                className="textarea"
                style={{ minWidth: '487px', maxWidth: '487px', height: '100%', fontSize: '15px' }}
                defaultValue={item?.bnnrPhrsCon && item?.bnnrPhrsCon.replace('<br/>', '\n')}
                id={`banner_content_${item?.bnnrSqn}`}
                name={`banner_content_${item?.bnnrSqn}`}
                onBlur={(e) =>
                  handleChangeInputTexts(e, item?.bnnrSqn, (obj) => ({ ...obj, bnnrPhrsCon: e.target.value }))
                }
                title={'이미지텍스트'}
                maxLength={40}
                placeholder={'40자 이내 입력'}
              />
            </div>
          </div>
          {/*banner_upload_row end*/}
          {/*banner_upload_row start*/}
          <div className="banner_upload_row">
            <p className="label">{btnTxt ? '링크버튼 텍스트' : '링크url'}</p>
            <div className="banner_upload">
              {btnTxt && (
                <input
                  type="text"
                  className="input input_btn_title"
                  defaultValue={item?.btnPhrsCon}
                  id={`banner_btn_text_${item?.bnnrSqn}`}
                  name={`banner_btn_text_${item?.bnnrSqn}`}
                  onBlur={(e) =>
                    handleChangeInputTexts(e, item?.bnnrSqn, (obj) => ({ ...obj, btnPhrsCon: e.target.value }))
                  }
                  title={'링크이름'}
                  maxLength={10}
                  placeholder={'10자 이내 입력'}
                />
              )}
              <input
                type="text"
                className={`input input_btn_url ${!btnTxt ? 'width_full' : ''}`}
                defaultValue={item?.bnnrLnknUrl}
                id={`banner_url_${item?.bnnrSqn}`}
                name={`banner_url_${item?.bnnrSqn}`}
                onBlur={(e) =>
                  handleChangeInputTexts(e, item?.bnnrSqn, (obj) => ({ ...obj, bnnrLnknUrl: e.target.value }))
                }
                title={'링크url'}
              />
            </div>
          </div>
          {/*banner_upload_row end*/}
        </div>
      </div>
    )
  }
}
export default Form
