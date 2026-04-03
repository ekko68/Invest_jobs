import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from '_pub/modules/consts/RouterConst'
import { Button, MenuItem, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { DescriptionOutlined } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { BtSelect } from '_pub/components/bt/BtSelect/BtSelect'

const Accept_InvestBusiness = () => {
  return (
    <>
      {/* Contents */}
      <div className="investBusiness_container investBusiness_accept">
        <div className="section_header">
          <h3 className={'title'}>출자사업 접수</h3>
        </div>
        <div className="investBusiness_box">
          <h3 className="accept_title">출자사업 개요</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>출자사업명</th>
                <td>핀테크 혁신펀드 위탁운용사 선정</td>
                <th>공고일자</th>
                <td>2024-06-11</td>
              </tr>
            </tbody>
          </table>
          <h3 className="accept_title">운용사 정보</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  운용사명
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
                <th>
                  대표자명
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
              </tr>

              <tr>
                <th>
                  설립일자
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <DatePicker
                    format="YYYY-MM-DD"
                    title={'설립일자'}
                    sx={{ width: '100%' }}
                    numberProperty=""
                    // item={vo}
                    // values={''}
                    disabled={false}
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </td>
                <th>
                  회사 형태
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <BtSelect defaultValue={0}>
                    <MenuItem disabled value={0}>
                      선택하세요
                    </MenuItem>
                    <MenuItem value={1}>창업투자회사</MenuItem>
                    <MenuItem value={2}>신기술사업금융업자</MenuItem>
                    <MenuItem value={3}>LLC</MenuItem>
                    <MenuItem value={4}>창업기획자(AC)</MenuItem>
                    <MenuItem value={5}>자산운용사</MenuItem>
                    <MenuItem value={6}>사모집합투자기구운용사</MenuItem>
                    <MenuItem value={7}>기타</MenuItem>
                  </BtSelect>
                </td>
              </tr>

              <tr>
                <th>
                  사업자등록번호
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
                <th>
                  담당자
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
              </tr>

              <tr>
                <th>
                  연락처
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
                <th>
                  이메일
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
              </tr>

              <tr>
                <th>
                  공동GP여부
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <FormControl>
                    <RadioGroup row>
                      <FormControlLabel value="1" control={<Radio />} label="Y" />
                      <FormControlLabel value="2" control={<Radio />} label="N" />
                    </RadioGroup>
                  </FormControl>
                </td>
              </tr>

              <tr>
                <th>
                  공동GP정보
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">공동GP명</th>
                          <th scope="col">대표자명</th>
                          <th scope="col">설립일자</th>
                          <th scope="col">사업자등록번호</th>
                          <th scope="col">담당자</th>
                          <th scope="col">연락처</th>
                          <th scope="col">이메일</th>
                        </tr>
                        <tr>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={7} className="td_add_row">
                            <button type="button" className="button_add_row">
                              행 추가 +
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 className="accept_title">출자제안서 정보</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>지원분야</th>
                <td colSpan="3">
                  <FormControl>
                    <RadioGroup row>
                      <FormControlLabel value="1" control={<Radio />} label="이차전지" />
                      <FormControlLabel value="2" control={<Radio />} label="초기기업" />
                      <FormControlLabel value="3" control={<Radio />} label="ESG" />
                    </RadioGroup>
                  </FormControl>
                </td>
              </tr>
              <tr>
                <th>
                  조합명
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
                <th>
                  펀드구분
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <BtSelect defaultValue={0}>
                    <MenuItem disabled value={0}>
                      선택하세요
                    </MenuItem>
                    <MenuItem value={1}>창업투자회사</MenuItem>
                    <MenuItem value={2}>신기술사업금융업자</MenuItem>
                    <MenuItem value={3}>LLC</MenuItem>
                    <MenuItem value={4}>창업기획자(AC)</MenuItem>
                    <MenuItem value={5}>자산운용사</MenuItem>
                    <MenuItem value={6}>사모집합투자기구운용사</MenuItem>
                    <MenuItem value={7}>기타</MenuItem>
                  </BtSelect>
                </td>
              </tr>
              <tr>
                <th>
                  IBK출자요청액(억원)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
                <th>
                  펀드결성규모(억원)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
              </tr>
              <tr>
                <th>
                  존속기간(년)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
                <th>
                  출자금 납부방식
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <BtSelect defaultValue={0}>
                    <MenuItem disabled value={0}>
                      선택하세요
                    </MenuItem>
                    <MenuItem value={1}>창업투자회사</MenuItem>
                    <MenuItem value={2}>신기술사업금융업자</MenuItem>
                    <MenuItem value={3}>LLC</MenuItem>
                    <MenuItem value={4}>창업기획자(AC)</MenuItem>
                    <MenuItem value={5}>자산운용사</MenuItem>
                    <MenuItem value={6}>사모집합투자기구운용사</MenuItem>
                    <MenuItem value={7}>기타</MenuItem>
                  </BtSelect>
                </td>
              </tr>
              <tr>
                <th>
                  기준수익률(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
                <th>
                  관리보수(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
              </tr>
              <tr>
                <th>
                  성과보수(%)
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <TextField size="small" value={''} sx={{ width: '100%' }} />
                </td>
              </tr>

              <tr>
                <th>
                  펀드참여인력
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">GP명</th>
                          <th scope="col">인력구분</th>
                          <th scope="col">이름</th>
                          <th scope="col">투자경력(년)</th>
                          <th scope="col">대표번호</th>
                          <th scope="col">휴대폰번호</th>
                          <th scope="col">이메일주소</th>
                        </tr>
                        <tr>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <BtSelect defaultValue={2}>
                              <MenuItem disabled value={0}>
                                대표펀드매니저
                              </MenuItem>
                              <MenuItem value={1}>대표펀드매니저1</MenuItem>
                              <MenuItem value={2}>대표펀드매니저2</MenuItem>
                              <MenuItem value={3}>대표펀드매니저3</MenuItem>
                              <MenuItem value={4}>대표펀드매니저4</MenuItem>
                            </BtSelect>
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={7} className="td_add_row">
                            <button type="button" className="button_add_row">
                              행 추가 +
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th>
                  출자자 모집현황
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                  <br />
                  (GP 포함)
                  <div className="th_guide_text">관련자료 첨부 필수</div>
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">GP명</th>
                          <th scope="col">발급기관명</th>
                          <th scope="col">진행단계</th>
                          <th scope="col">출자금액(억원)</th>
                        </tr>
                        <tr>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} placeholder="예) LOI, LOC, 투자심사중" />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="td_add_row">
                            <button type="button" className="button_add_row">
                              행 추가 +
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th>
                  주목적 추가항목
                  <br />
                  (선택입력사항)
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                        </tr>
                        <tr>
                          <td className="td_add_row">
                            <button type="button" className="button_add_row">
                              행 추가 +
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th>
                  선정우대 항목
                  <br />
                  (선택입력사항)
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="" />
                        <col width="" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">선정우대 내용</th>
                          <th scope="col">상세 내용</th>
                        </tr>
                        <tr>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                          <td>
                            <TextField size="small" sx={{ width: '100%' }} />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2} className="td_add_row">
                            <button type="button" className="button_add_row">
                              행 추가 +
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 className="accept_title">비고(보완내용 등 자유작성)</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  추가 내용 입력
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <div className="textarea_wrap">
                    <textarea placeholder="내용" className="textarea" maxLength={1000} title="추가 내용" />
                    <div className="textarea_count">
                      <span className="textarea_count_current">20</span>
                      <span className="textarea_count_total">/1000</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 className="accept_title">관련 자료 첨부</h3>
          <table className="view_table">
            <colgroup>
              <col width={'13%'} />
              <col width={'37%'} />
              <col width={'13%'} />
              <col width={'37%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  파일 첨부
                  <span className="required" aria-label="필수요소">
                    *
                  </span>
                </th>
                <td colSpan={3}>
                  <div className="fileAttach_drag_wrap">
                    <DescriptionOutlined className="fileAttach_drag_icon" />
                    <div className="fileAttach_drag_text">
                      파일을 드래그해서 올려 놓거나,
                      <br /> 파일첨부 버튼을 눌러 파일을 등록해 주세요.
                    </div>
                  </div>
                  <div className="fileAttach_input_wrap">
                    <input className="fileAttach_input" type="file" id="inputFile01" />
                    <label className="fileAttach_label" htmlFor="inputFile01">
                      파일첨부
                    </label>
                    <span className="fileAttach_text">pptx, doc, docx, hwp, pdf 100MB 이내</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="bottom_guide">
            * 제출 이후에는 내용 수정이 불가합니다. 입력하신 내용이 정확한지 확인 후 제출 부탁 드립니다. (접수 취소 후
            재신청은 가능)
          </div>
          <div className="bottom_buttons">
            <Button size="large" className="cancel_button" variant="contained" disableElevation>
              취소
            </Button>
            <Button size="large" variant="outlined" disableElevation>
              임시저장
            </Button>
            <Button size="large" variant="contained" disableElevation>
              제출
            </Button>
          </div>
        </div>
      </div>

      {/* End of Contents */}
    </>
  )
}

export default Accept_InvestBusiness
