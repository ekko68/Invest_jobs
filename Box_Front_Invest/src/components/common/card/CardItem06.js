/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { cardItem06Style } from 'assets/style/ComponentStyle'
import Input from 'components/atomic/Input'
const CardItem06 = (props) => {
  /*
      type : "write" || null
      */
  const { type, data } = props

  const [inputs, setInputs] = useState({
    utlinsttId: '',
    enprIrrsInfoId: '',
    tmmbSqn: '',
    image: '',
    tmmbJbcl: '',
    tmmbNm: '',
    crrCon: ''
  })

  useEffect(() => {
    if (type === 'write') {
      setInputs({
        utlinsttId: data?.utlinsttId ?? '',
        enprIrrsInfoId: data?.enprIrrsInfoId ?? '',
        tmmbSqn: data?.tmmbSqn ?? '',
        image: data?.image ?? '',
        tmmbJbcl: data?.tmmbJbcl ?? '',
        tmmbNm: data?.tmmbNm ?? '',
        crrCon: data?.crrCon ?? ''
      })
    }
  }, [])

  const handleInputsChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  }

  if (type === 'write') {
    // 수정 및 신규작성
    return (
      <div className={'carditem06 write'} css={cardItem06Style}>
        <button className="btn_card_delete">
          <span className="hide">인력카드삭제</span>
        </button>
        {data?.image ? (
          <div className="img_wrap img_cover">
            <div className="edit_group">
              <button className="btn_edit">
                <span className="hide">편집</span>
              </button>
              <button className="btn_delete">
                <span className="hide">삭제</span>
              </button>
            </div>
            <img src={data?.image} alt="" />
          </div>
        ) : (
          <div className="img_wrap no_image">
            <div className="upload_wrap">
              <button className="btn_upload">Upload</button>
            </div>
          </div>
        )}

        <div className="content">
          <div className="content_inner scroll_lightgrey">
            <div className="inputs_wrap">
              <p className="position">
                <input
                  type="text"
                  name={'tmmbJbcl'}
                  value={inputs.tmmbJbcl}
                  placeholder={'직급'}
                  className="input"
                  onChange={handleInputsChange}
                />
              </p>
              <p className="name">
                <input
                  type="text"
                  name={'tmmbNm'}
                  value={inputs.tmmbNm}
                  placeholder={'이름'}
                  className="input"
                  onChange={handleInputsChange}
                />
              </p>
            </div>
            <p className="info">
              <textarea
                name={'crrCon'}
                value={inputs.crrCon}
                className="textarea scroll"
                onChange={handleInputsChange}
                placeholder={'내용'}
                maxLength={200}
              />
            </p>
          </div>
        </div>
      </div>
    )
  } else {
    // 데이터 출력
    return (
      <div className={'carditem06'} css={cardItem06Style}>
        <div className="img_wrap img_cover">
          {data.image ? <img src={data.image} alt="" /> : <img src={'/images/img_person.png'} alt="" />}
        </div>
        <div className="content">
          <div className="content_inner scroll_lightgrey">
            <p className="position">{data.tmmbJbcl}</p>
            <p className="name">{data.tmmbNm}</p>
            <p className="info">{data.crrCon}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default CardItem06
