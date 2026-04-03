export const StringUtils = {
  hasLength: (param) => {
    if (param !== null && param !== undefined && String(param).trim() !== '') return true
    else return false
  },
  toBr: (value) => {
    if (value === null || value === undefined) return ''
    // 현재 메뉴등록을 query로 직접 하기에 \n 직접입력으로 개행처리를 하고 있음
    // todo : 메뉴 등록, 수정 화면 작업이 추가될 경우 api로 입력처리후 하단의 정규식을 주석된 것으로 수정할 것
    return String(value).replace(/(?:\r\n|\r|\n|\\n)/g, '<br/>')
    // return String(value).replace(/(?:\r\n|\r|\n)/g, '<br/>');
  },
  getContentDispositionFileName: (disposition, defaultName = '') => {
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = filenameRegex.exec(disposition)
      if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, '')
      }
    }

    return defaultName
  },
  comma: (value) => {
    const num = value === undefined || value === null || String(value).trim() === '' ? 0 : value
    // negative lookbehind 문법 사파리, ios 지원 안함
    // return String(num).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    const splitNum = num.toString().split('.')
    splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return splitNum.join('.')
  },
  telNumber: (value) => {
    return String(value).replace(/(\d{3})(\d{4})(\d{4})/g, '$1-$2-$3')
  },
  bizNum: (value) => {
    return String(value).replace(/(\d{3})(\d{2})(\d{5})/g, '$1-$2-$3')
  },
  faxNum: (value) => {
    return String(value).replace(/(\d{4})(\d{3})(\d{4})/g, '$1-$2-$3')
  },
  date: (value) => {
    return String(value).replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
  }
}
