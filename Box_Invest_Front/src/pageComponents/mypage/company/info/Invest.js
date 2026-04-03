import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { StringUtils } from 'modules/utils/StringUtils'
import { createKey } from 'modules/utils/CommonUtils'
import { CheckYn } from 'modules/consts/BizConst'

const Invest = forwardRef((props, ref) => {
  const history = useHistory()
  const [item, setItem] = useState({
    investHope: {
      invmAmtCd: '',
      invmAmtNm: '',
      invmStgCd: '',
      invmStgNm: '',
      oppbYn: CheckYn.NO,
      osivHopeyn: CheckYn.NO,
      utlinsttId: ''
    },
    investFieldList: [],
    utilTechList: []
  })
  useImperativeHandle(ref, () => ({
    setData
  }))
  const setData = (data) => {
    setItem(data)
  }
  useEffect(() => {}, [item])
  const onClickInvestWrite = () => {
    history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INVEST_WRITE)
  }
  return (
    <div className="section section03">
      <div className="section_header">
        <h3 className="section_title">투자희망</h3>
        <Button className={'blue'} onClick={onClickInvestWrite}>
          수정하기
        </Button>
      </div>
      <CardLayout>
        <div className="prod_info_wrap">
          <div className="card_header">
            <h3 className="ico_title title">단계 및 금액</h3>
          </div>
          <div className="prod_content">
            <div className="prod_inner hope">
              <div className="info_table ">
                <table className="table type03">
                  <caption>계정 정보 테이블</caption>
                  <colgroup>
                    <col width={'12%'} />
                    <col width={'38%'} />
                    <col width={'12%'} />
                    <col width={'38%'} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>노출유무</th>
                      <td colSpan={3}>
                        {item?.investHope['oppbYn'] === CheckYn.YES ? (
                          <span className="highlight_blue">공개</span>
                        ) : (
                          <span className="highlight_orange">비공개</span>
                        )}
                      </td>
                    </tr>
                    {item?.investHope['oppbYn'] === CheckYn.YES && (
                      <tr>
                        <th>희망단계</th>
                        <td>{item?.investHope['invmStgNm']}</td>
                        <th>투자금(원)</th>
                        <td>{StringUtils.comma(item?.investHope?.invmAmtNm)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* 분야 및 기술 start */}
        <div className="prod_info_wrap category">
          <div className="card_header">
            <h3 className="ico_title title">분야 및 기술</h3>
          </div>
          <div className="prod_content">
            <div className="prod_inner hope">
              <div className="info_table ">
                <table className="table type03">
                  <caption>투자희망정보 분야 및 기술 테이블</caption>
                  <colgroup>
                    <col width={'12%'} />
                    <col width={'38%'} />
                    <col width={'12%'} />
                    <col width={'38%'} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>비즈니스 분야</th>
                      <td>
                        <ul className="tag_box_list">
                          {item?.investFieldList?.map((_item, index) => (
                            <li className="tag_box_item" key={createKey()}>
                              {_item['invmFildNm']}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <th>관심기술</th>
                      <td>
                        <ul className="tag_box_list">
                          {item?.utilTechList?.map((_item, index) => (
                            <li className="tag_box_item" key={createKey()}>
                              {_item['utlzTchnNm']}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* 분야 및 기술 end */}

        <div className="prod_info_wrap">
          <div className="card_header">
            <h3 className="ico_title title">해외투자</h3>
          </div>
          <div className="prod_content">
            <div className="prod_inner hope">
              <div className="info_table ">
                <table className="table type03">
                  <caption>해외투자 테이블</caption>
                  <colgroup>
                    <col width={'12%'} />
                    <col width={'38%'} />
                    <col width={'12%'} />
                    <col width={'38%'} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th>해외투자 희망여부</th>
                      <td colSpan={3}>
                        {item?.investHope?.osivHopeyn === CheckYn.YES ? (
                          <span className="highlight_blue">희망</span>
                        ) : (
                          <span className="highlight_orange">비희망</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>
    </div>
  )
})

export default Invest
