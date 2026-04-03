import VoUtils from './VoUtils'

const ValidateUtils = {
  validateEmpty: (list, properties) => {
    let isEmpty = false
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      isEmpty = ValidateUtils.isItemEmpty(item, properties)
      if (isEmpty) {
        break
      }
    }
    return isEmpty
  },
  isItemEmpty: (item, properties) => {
    let isEmpty = false
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      if (typeof property === 'object') {
        if (property.type === 'number') {
          // if (isNaN(item[property.property]) || Number(item[property.property]) === 0) {
          //   isEmpty = true
          //   break
          // }
          if (
            isNaN(item[property.property]) ||
            item[property.property] === '' ||
            item[property.property] === undefined ||
            item[property.property] === null
          ) {
            isEmpty = true
            break
          }
        }
      } else {
        if (item[property] === '' || item[property] === undefined || item[property] === null) {
          isEmpty = true
          break
        }
      }
    }
    return isEmpty
  },
  hasEqualText: (list, property, compareText) => {
    let r = false
    for (let i = 0; i < list.length; i++) {
      const listItem = list[i]
      if (listItem[property] === compareText) {
        r = true
        break
      }
    }
    return r
  },
  isValueEmpty: (value) => {
    let r = true
    if (value === undefined || value === null || String(value).trim() === '') {
      r = false
    }
    return r
  },
  isVoEmpty: (vo, properties, listProperties = [], numberProperties = []) => {
    let r = false
    if (numberProperties.length > 0) {
      let isEmpty = true
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i]
        if (ValidateUtils.getIsListProperty(property, listProperties)) {
          if (vo[property].length > 0) {
            isEmpty = false
          }
        } else if (ValidateUtils.getIsNumberField(property, numberProperties)) {
          if (vo[property] > 0) {
            isEmpty = false
          }
        } else {
          if (ValidateUtils.isEmpty(vo[property]) === false) {
            isEmpty = false
          }
        }
      }
      if (isEmpty) {
        r = true
      }
    } else {
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i]
        if (ValidateUtils.isValueEmpty(vo[property]) === false) {
          r = true
          break
        }
      }
    }
    return r
  },
  getIsNumberField: (property, numberProperties) => {
    let r = false
    if (numberProperties.length > 0) {
      for (let i = 0; i < numberProperties.length; i++) {
        const numberProperty = numberProperties[i]
        if (property === numberProperty) {
          r = true
          break
        }
      }
    }
    return r
  },
  getIsListProperty: (property, listProperties) => {
    let r = false
    if (listProperties.length > 0) {
      for (let i = 0; i < listProperties.length; i++) {
        const numberProperty = listProperties[i]
        if (property === numberProperty) {
          r = true
          break
        }
      }
    }
    return r
  },
  isEmpty: (value) => {
    let r = false
    if (value === undefined || value === null || String(value).trim() === '') {
      r = true
    }
    return r
  },
  isArraysEmpty: (arrays = []) => {
    let r = true
    if (arrays.length > 0) {
      for (let i = 0; i < arrays.length; i++) {
        const list = arrays[i]
        if (list.length > 0) {
          r = false
          break
        }
      }
    }
    return r
  },
  isVoListEmpty: (vo, list, numberProperties = [], exceptionProperties = []) => {
    let r = true
    let count = 0
    const properties = VoUtils.getProperties(vo, exceptionProperties)
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (ValidateUtils.isListItemEmpty(item, properties, numberProperties) === false) {
        count++
      }
    }
    if (count === list.length) {
      r = false
    }
    return r
  },
  isListItemEmpty: (item, properties, numberProperties = [], exceptionProperties = []) => {
    let r = false
    if (properties.length > 0) {
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i]
        if (ValidateUtils.isEmpty(item[property])) {
          r = true
          break
        }
      }
    }
    if (numberProperties.length > 0) {
      for (let i = 0; i < numberProperties.length; i++) {
        const numberProperty = numberProperties[i]
        if (item[numberProperty] <= 0) {
          r = true
          break
        }
      }
    }
    return r
  },
  hasListItemEmpty: (list, properties = [], numberProperties = []) => {
    let r = false
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const isEmpty = ValidateUtils.isListItemEmpty(item, properties, numberProperties)
      if (isEmpty) {
        r = true
        break
      }
    }
    return r
  },
  isEmptyValueInVo: (vo = {}, exclusionList = []) => {
    const arr = Array.isArray(vo)
      ? vo
      : Object.entries(vo)
          .filter(([k, v]) => !exclusionList.includes(k))
          .map(([k, v]) => v)
    return arr.some((el) =>
      el && typeof el === 'object' ? ValidateUtils.isEmptyValueInVo(el, exclusionList) : ValidateUtils.isEmpty(el)
    )
  }
}

export default ValidateUtils
