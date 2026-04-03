import { StringUtils } from 'modules/utils/StringUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import CommonAxios, { getFileDownloadConfig } from 'modules/utils/CommonAxios'
import Api from 'modules/consts/Api'
import DateUtils from 'modules/utils/DateUtils'

const NiceDocUtil = {
  getDownloadBtnNm: (papersAtchFlpthNm) => {
    return papersAtchFlpthNm != 'expired' && papersAtchFlpthNm != 'XX'
      ? '다운로드'
      : papersAtchFlpthNm == 'expired'
      ? '기간만료'
      : '서류생성중'
  },
  downloadNiceSimpleDoc: async (docItem, papersAtchFlpthNm, alertPopRef, commonContext) => {
    if (papersAtchFlpthNm == 'expired') {
      exeFunc(alertPopRef, 'open', '기간이 만료되었습니다.<br/><br/>재발급 후 이용하세요.')
      return
    }
    if (papersAtchFlpthNm == 'XX') {
      exeFunc(alertPopRef, 'open', '서류를 생성 중입니다..<br/><br/>잠시 후 이용하세요.')
      return
    }
    if (papersAtchFlpthNm == '0') {
      exeFunc(alertPopRef, 'open', '소득금액증명원은 대표자 본인만.<br/><br/>다운로드 할 수 있습니다.')
      return
    }

    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        const res = await CommonAxios(getFileDownloadConfig(docItem['fileId']), true)
        if (res) {
          if (res.status === 200) {
            const blob = new Blob([res.data], { type: res.headers['content-type'] })
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.setAttribute('download', docItem['fileName'])
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
          }
        }
      },
      true,
      true
    )
  }
}

export default NiceDocUtil
