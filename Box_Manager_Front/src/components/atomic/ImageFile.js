import { createKey } from 'modules/utils/MathUtils'
import { useEffect, useState } from 'react'

export default function InputImageFile(props) {
  const {
    onUploadImageFile,
    onDeleteImageFile,
    subText = '사이즈, 노출 영역에 대한 안내문구가 노출됨',
    maxImageCount = 5,
    images
  } = props

  // input id를 겹치게 하고 싶지 않기위함
  const id = createKey()

  const [imgDataList, setImgDataList] = useState([])

  useEffect(() => {
    if (images) setImgDataList(images)
  }, [images])

  const imgFileSet = (e) => {
    let file = e?.target?.files[0]

    e.target.value = null // reset file input 같은 파일 여러번 올리기 위함

    const reader = new FileReader()
    reader.onload = (e) => {
      addImage(e.target.result, file)
    }
    reader.readAsDataURL(file)
  }

  const addImage = (image, file) => {
    setImgDataList((pre) => {
      return [...pre, { imgSrc: image, file }]
    })
    onUploadImageFile({ imgSrc: image, file })
  }

  const deleteImage = (index) => {
    setImgDataList((pre) => {
      const copy = [...pre]
      copy.splice(index, 1)
      return copy
    })
    onDeleteImageFile(index)
  }

  return (
    <>
      <ul className="imgFile_list">
        {imgDataList.length < maxImageCount && (
          <li>
            <div className="imgFile_input_wrap">
              <input className="imgFile_input" type="file" id={id} onChange={(e) => imgFileSet(e)} accept="image/*" />
              <label className="imgFile_label" htmlFor={id} style={{ cursor: 'pointer' }}>
                <span className="hide">이미지 파일 추가</span>
              </label>
            </div>
          </li>
        )}
        {imgDataList.map((imageData, index) => {
          return (
            <li key={createKey()}>
              <img src={imageData.imgSrc || imageData.imgUrl} alt="대표 이미지" />
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
    </>
  )
}
