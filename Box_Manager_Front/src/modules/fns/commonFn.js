import { loader } from '../utils/CommonAxios'
import ResponseUtils from '../utils/ResponseUtils'

export const createKey = () => {
  const createKey = (window.crypto || window.msCrypto).getRandomValues(new Uint32Array(1))[0]
  return createKey
}

// Image file type check
export const handleFileFormatCheck = (e) => {
  const { value } = e.target
  let ext = value.match(/\.([^\\.]+)$/)[1]
  switch (ext) {
    case 'jpg':
    case 'png':
    case 'jpeg':
    case 'webp':
      return true
    default:
      return false
  }
}

export const handleFileFormatCheckBoard = (e) => {
  const { value } = e.target
  let ext = value.match(/\.([^\\.]+)$/)[1]
  switch (ext) {
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'haansoftpptx':
    case 'haansoftxlsx':
    case 'pptx':
    case 'doc':
    case 'docx':
    case 'pdf':
    case 'hwp':
    case 'gif':
    case 'jpg':
    case 'png':
    case 'jpeg':
      return true
    default:
      return false
  }
}

export const handleFileFormatCheckDocs = (e) => {
  const { value } = e.target
  let ext = value.match(/\.([^\\.]+)$/)[1]
  switch (ext) {
    case 'jpg':
    case 'png':
    case 'jpeg':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
    case 'doc':
    case 'docx':
    case 'pdf':
    case 'hwp':
      return true
    default:
      return false
  }
}

// Multiple Upload
export const onChangeFileHandler = async (event, megaByte, maxMegaByte) => {
  let itsFileSizeOk = true
  if (event.target.files.length > 0) {
    const files = event.target.files
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > megaByte * maxMegaByte) {
        itsFileSizeOk = false
        break
      }
    }
    if (itsFileSizeOk === false) {
      alert(maxMegaByte + 'Mb를 넘어갑니다. ' + maxMegaByte + 'Mb 이하로 선택하세요')
      // alertPopRef.open(maxMegaByte + 'Mb를 넘어갑니다. ' + maxMegaByte + 'Mb 이하로 선택하세요')
      return
    } else {
      loader(true, 'Uploading...')
      const res = await ResponseUtils.getMultiFileUploadResponse(files)
      if (res) {
        return res
      }
    }
  }
}

// substract num1 - num2
export const onSubstractHandler = (num1, num2) => {
  let n1 = num1,
    n2 = num2
  if (typeof num1 !== 'number') n1 = parseInt(num1)
  if (typeof num2 !== 'number') n2 = parseInt(num2)
  let num = n1 - n2
  return num
}

// KRW transfer
export const krwFormatter = (number) => {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 사업자번호 구분
export const formatBusinessNumber = (businessNumber) => {
  // 정규표현식을 사용하여 사업자번호 형식에 맞게 변환
  const formattedNumber = businessNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')
  return formattedNumber
}

// 휴대폰번호 구분
export const formatPhoneNumber = (phoneNumber) => {
  let formattedNumber = phoneNumber.trim().replace(/\D/g, '') // 숫자가 아닌 문자 제거

  if (formattedNumber.length === 8) {
    return formattedNumber.replace(/(\d{4})(\d{4})/, '$1-$2')
  } else if (formattedNumber.length <= 10) {
    if (formattedNumber.startsWith('02') && formattedNumber.length === 9) {
      // 02-000-0000
      return formattedNumber.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
    } else if (formattedNumber.startsWith('02') && formattedNumber.length === 10) {
      // 02-0000-0000
      return formattedNumber.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
    } else {
      // 000-000-0000
      return formattedNumber.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})$/, '$1-$2-$3').replace(/(--)$/, '') // 여기서 이스케이프 문자를 제거했습니다.
    }
  } else {
    // 기본 정규표현식을 사용하여 형식 변환
    return formattedNumber.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3')
  }
}

export const stringHasLength = (value) => {
  // "string", [array], {object} 빈값으로 처리
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    String(value).trim() === '' ||
    (value !== null && typeof value === 'object' && !Object.keys(value).length)
  ) {
    return false
  } else {
    return true
  }
}

/**********
 #info
 - 사업자등록번호(10자리), 법인등록번호(13자리) 인식하여 구분표시 추가합니다.

 #params
 사업자등록번호 or 법인등록번호

 ex) bizFormatter("894192177645") -> "894-19-2177645"
 **********/
export const bizFormatter = (IdNo) => {
  if (!stringHasLength(IdNo)) return ''

  if (IdNo.length === 13) {
    return IdNo.replace(/(\d{6})(\d{7})/, '$1-$2')
  } else {
    return IdNo.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')
  }
}

// url validation check
export const handleUrlValidate = (url) => {
  let regex = new RegExp('(http|https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
  if (regex.test(url)) {
    return true
  } else {
    return false
  }
}

export const handleScrollTop = () => {
  const wrap = document.querySelector('.wrap')
  wrap.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

export const deepCopyByRecursion = (original) => {
  let clone

  if (Array.isArray(original)) {
    clone = []
    for (let item of original) {
      if (Array.isArray(item) || typeof item == 'object') clone.push(deepCopyByRecursion(item))
      else clone.push(item)
    }
  } else {
    clone = {}

    for (let key in original) {
      if (typeof original[key] == 'object' && original[key] != null && original[key] != undefined) {
        clone[key] = deepCopyByRecursion(original[key])
      } else clone[key] = original[key]
    }
  }

  return clone
}

/**********
 #info
 - 카드번호 구분표시 추가

 #params
 카드번호

 ex) cardNoFormatter("1234123412341234") -> "1234-1234-1234-1234"
 **********/
export const cardNoFormatter = (cardNo) => {
  if (!stringHasLength(cardNo)) return '-'

  if (cardNo.length === 12) {
    return cardNo.replace(/(\d{4})(\d{2})(\d{2})(\d{4})(\d{4})/, '$1-$2**-****-$5')
  } else {
    return cardNo.replace(/([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{4})([0-9]+)/, '$1-$2**-****-$5')
  }
}

export const isInvalidJSON = (string) => {
  try {
    JSON.parse(string)
    return true
  } catch (e) {
    return false
  }
}
