import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import { useState } from 'react'
import { termFormatter } from 'modules/common'
import { NoImage02 } from 'modules/consts/Img'
import { fileDownloadMkt } from 'modules/utils/CommonUtils'
import Radio from 'components/atomic/Radio'
import TextInput from 'components/atomic/TextInput'
import InputImageFile from 'components/atomic/ImageFile'
import DatePicker, { registerLocale } from 'react-datepicker'
import ko from 'date-fns/locale/ko'

const Admin_Product_Main_web_registration_01_1 = (props) => {
  const { onUploadImageFile, onDeleteImageFile, images } = props
  const [confirmDelete, setConfirmDelete] = useState(false)

  const typeRadioList = [
    { id: 'publicY', value: '공개', name: 'public' },
    { id: 'publicN', value: '비공개', name: 'public' }
  ]

  // ===== 파일 다운로드
  const handleFileDownload = async (file) => {
    await fileDownloadMkt(file)
  }
  const [date1, setDate1] = useState({
    startDate: null,
    endDate: null
  })

  const [date2, setDate2] = useState({
    startDate: null,
    endDate: null
  })
  // ===== datepicker
  const onChangeDate = (currentDate, type, type2) => {
    // type: 신청기간인지 진행기간인지, type2: 시작일인지 종료일인지
    if (type === 'date1') {
      type2 === 'start'
        ? (setDate1({
            ...date1,
            startDate: currentDate
          }),
          setForm({
            ...form,
            enlsSldyTs: currentDate
          }))
        : (setDate1({
            ...date1,
            endDate: currentDate
          }),
          setForm({
            ...form,
            enlsCldyTs: currentDate
          }))
    } else {
      type2 === 'start'
        ? (setDate2({
            ...date2,
            startDate: currentDate
          }),
          setForm({
            ...form,
            evntStdyTs: currentDate
          }))
        : (setDate2({
            ...date2,
            endDate: currentDate
          }),
          setForm({
            ...form,
            evntFndaTs: currentDate
          }))
    }
  }
  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">상품 메인 (웹) 배너 관리</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>제목, 공개여부, 설명, 링크, 기간선택, 이미지 등록가능한 입력 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left th_length'}>
                  {/* <span className="require" aria-label="필수 요소" /> */}
                  제목
                </th>
                <td>
                  <TextInput
                    title="제목"
                    placeholder="배너 제목을 입력하세요."
                    value={''}
                    length={15}
                    onChange={() => {}}
                  />
                </td>
              </tr>
              <tr className="tr_radio">
                <th className={'ta_left bg_light_grey'}>
                  <span className="require" aria-label="필수 요소" />
                  공개
                </th>

                <td>
                  {typeRadioList.map((radio) => (
                    <Radio key={radio.id} radio={radio} name={radio.name} onChange={() => {}} />
                  ))}
                </td>
              </tr>

              <tr>
                <th className={'ta_left th_length'}>배너 제목 문구</th>
                <td>
                  <TextInput
                    title="배너 제목"
                    placeholder="배너 제목을 입력하세요."
                    value={''}
                    length={15}
                    onChange={() => {}}
                  />
                  <TextInput
                    title="배너 제목"
                    placeholder="배너 제목을 입력하세요."
                    value={''}
                    length={15}
                    onChange={() => {}}
                  />
                  <TextInput
                    title="배너 제목"
                    placeholder="배너 제목을 입력하세요."
                    value={''}
                    length={15}
                    onChange={() => {}}
                  />
                </td>
              </tr>

              <tr>
                <th className={'ta_left th_length'}>배너 설명 문구</th>
                <td>
                  <TextInput
                    title="배너 설명"
                    placeholder="설명을 입력하세요."
                    value={''}
                    length={30}
                    onChange={() => {}}
                  />
                  <TextInput
                    title="배너 설명"
                    placeholder="설명을 입력하세요."
                    value={''}
                    length={30}
                    onChange={() => {}}
                  />
                  <TextInput
                    title="배너 설명"
                    placeholder="설명을 입력하세요."
                    value={''}
                    length={30}
                    onChange={() => {}}
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>링크</th>
                <td>
                  <input
                    type="text"
                    className="input"
                    placeholder="링크를 입력하세요."
                    title="링크"
                    onChange={() => {}}
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  기간
                </th>
                <td>
                  <div className="period_calendar">
                    <DatePicker
                      selected={date1.startDate ? date1.startDate : null}
                      onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'start')}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      maxDate={date1.endDate ? date1.endDate : null}
                      title={'기간조회'}
                    />
                    <span className="datepicker_dash">~</span>
                    <DatePicker
                      selected={date1.endDate ? date1.endDate : null}
                      onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'end')}
                      locale={ko}
                      dateFormat={'yyyy-MM-dd'}
                      minDate={date1.startDate ? date1.startDate : null}
                      title={'기간조회'}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th className={'ta_left th_length'}>
                  <span className="require" aria-label="필수 요소" />
                  이미지 등록
                </th>
                <td>
                  <div className="img_info_wrap">
                    <div className="img_wrap">
                      <InputImageFile
                        images={images}
                        onUploadImageFile={onUploadImageFile}
                        onDeleteImageFile={onDeleteImageFile}
                        subText="첨부 이미지 권장 사이즈는 가로 1410 x 세로 555px(픽셀)입니다. JPG, PNG 첨부 가능 합니다"
                      />
                      {/* 1. case 메인 ,기업, 이벤트 웹 PC 사이즈 문구 */}
                      {/* subText="첨부 이미지 권장 사이즈는 가로 1410 x 세로 555px(픽셀)입니다. JPG, PNG 첨부 가능 합니다" */}

                      {/* 2. case 메인 ,기업, 이벤트 모바일 사이즈 문구 */}
                      {/* subText="첨부 이미지 권장 사이즈는 가로 300 x 세로 400px(픽셀)입니다. JPG, PNG 첨부 가능 합니다" */}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => {}}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={() => {}}>
            등록
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Admin_Product_Main_web_registration_01_1
