import { createKey } from 'modules/utils/MathUtils'
import { useEffect, useState, Fragment } from 'react'
import * as mainFn from 'modules/fns/mkt/mainFn'

export default function ImageUpload(props) {
  const {
    onDeleteImageFile,
    subText = '사이즈, 노출 영역에 대한 안내문구가 노출됨',
    maxImageCount = 5,
    id = createKey(),
    images,
    form,
    setForm
  } = props

  const [imgDataList, setImgDataList] = useState([])

  useEffect(() => {
    if (images) setImgDataList(images)
  }, [images])

  const deleteImage = (index) => {
    setImgDataList((pre) => {
      const copy = [...pre]
      copy.splice(index, 1)
      return copy
    })
    onDeleteImageFile(index)
  }

  return (
    <Fragment>
      <ul className="imgFile_list">
        {imgDataList.length < maxImageCount && (
          <li>
            <div className="imgFile_input_wrap">
              <input
                className="imgFile_input"
                type="file"
                id={id}
                onChange={(e) => mainFn.handleGetImageFileInfo(e, form, setForm)}
                accept="image/*"
              />
              <label className="imgFile_label" htmlFor={id} style={{ cursor: 'pointer' }}>
                <span className="hide">이미지 파일 추가</span>
              </label>
            </div>
          </li>
        )}
        {imgDataList.map((imageData, index) => {
          return (
            <li key={createKey()}>
              <img src={imageData} alt="대표 이미지" />
              <button
                type="button"
                className="imgFile_del_button"
                onClick={() => {
                  deleteImage(index)
                }}
              >
                <span className="hide">상품 이미지 삭제</span>
              </button>
            </li>
          )
        })}
      </ul>
      <ul className="imgFile_description">
        <li>{subText}</li>
      </ul>
    </Fragment>
  )
}
