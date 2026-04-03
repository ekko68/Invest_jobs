import DateUtils from './DateUtils'

const FormUtils = {
  setVoInput: (vo, property, value, numberFields = []) => {
    let isNumber = false
    if (numberFields.length > 0) {
      for (let i = 0; i < numberFields.length; i++) {
        const numberField = numberFields[i]
        if (property === numberField) {
          isNumber = true
          break
        }
      }
    }
    if (isNumber) vo[property] = Number(value)
    else vo[property] = value
  },
  setVoDate: (vo, property, currentDate) => {
    vo[property] = DateUtils.customDateFormat(currentDate, 'yyyy-MM-dd')
  },
  setVoDateExceptDash: (vo, property, currentDate) => {
    const _currentDate = new Date(currentDate);
    console.log(currentDate);
    // vo[property] = DateUtils.customDateFormat(currentDate, 'yyyyMMdd');
    vo[property] = DateUtils.customDateFormat(_currentDate, 'yyyyMMdd');
    console.log(vo[property])
  },
  setVoBizNum: (vo, property, target) => {
    target.value = target.value.replace(/\D/g, '')
    if (target.value.length >= 3 && target.value.length <= 4) {
      target.value = target.value.replace(/(\d{3})/g, '$1-')
    } else if (target.value.length >= 5 && target.value.length <= 9) {
      target.value = target.value.replace(/(\d{3})(\d{2})/g, '$1-$2-')
    } else {
      target.value = target.value.slice(0, 10)
      target.value = target.value.replace(/(\d{3})(\d{2})(\d{5})/g, '$1-$2-$3')
    }
    vo[property] = target.value.replace(/\D/g, '')
  },
  setVoCorporateNum: (vo, property, target) => {
    target.value = target.value.replace(/\D/g, '')
    if (target.value.length >= 6 && target.value.length <= 12) {
      target.value = target.value.replace(/(\d{6})/g, '$1-')
    } else {
      target.value = target.value.slice(0, 13)
      target.value = target.value.replace(/(\d{6})(\d{7})/g, '$1-$2')
    }
    vo[property] = target.value.replace(/\D/g, '')
  },
  setVoNumberInput: (vo, property, target) => {
    let isMaxLength = false
    if (target.getAttribute('maxlength')) {
      isMaxLength = true
    }
    if (isMaxLength) {
      const maxLength = parseInt(target.getAttribute('maxlength'))
      const str = String(target.value)
      if (str.length > maxLength) {
        const newValue = str.substring(0, maxLength)
        target.value = newValue
        vo[property] = newValue
      } else {
        vo[property] = target.value
      }
    } else {
      vo[property] = target.value
    }
  }
}
export default FormUtils
