const VoUtils = {
  getProperties: (vo, exceptionProperties = []) => {
    const allProperties = VoUtils.getVoProperties(vo)
    const useProperties = VoUtils.getUseProperties(allProperties, exceptionProperties)
    return useProperties
  },
  getVoProperties: (vo) => {
    const properties = []
    for (let property in vo) {
      properties.push(property)
    }
    return properties
  },
  getUseProperties: (properties, exceptionProperties = []) => {
    const useProperties = []
    if (exceptionProperties.length === 0) {
      return properties
    } else {
      if (exceptionProperties.length > 0) {
        for (let i = 0; i < properties.length; i++) {
          const property = properties[i]
          let isEqual = false
          for (let j = 0; j < exceptionProperties.length; j++) {
            const exceptionProperty = exceptionProperties[j]
            if (property === exceptionProperty) {
              isEqual = true
            }
          }
          if (isEqual === false) {
            useProperties.push(property)
          }
        }
      }
    }
    return useProperties
  },
  getIsExceptionProperty: (property, exceptionProperties = []) => {
    let r = false
    if (exceptionProperties.length > 0) {
      for (let i = 0; 0 < exceptionProperties.length; i++) {
        const exceptionProperty = exceptionProperties[i]
        if (property === exceptionProperty) {
          r = true
          break
        }
      }
    }
    return r
  },
  setNullNumberToZero: (vo, properties) => {
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      if (vo[property] === null || vo[property] === undefined) {
        vo[property] = 0
      }
    }
  },
  setVoNullToEmpty: (vo, numberProperties = [], exceptionProperties = []) => {
    const properties = VoUtils.getProperties(vo, exceptionProperties)
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]

      if (VoUtils.getIsNumberProperty(property, numberProperties)) {
        if (vo[property] === null) vo[property] = 0
      } else {
        if (vo[property] === null) vo[property] = ''
      }
    }
  },
  getIsNumberProperty: (property, numberProperties = []) => {
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
  setListVoNullToEmpty: (list, numberProperties = [], exceptionProperties = []) => {
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        VoUtils.setVoNullToEmpty(item, numberProperties, exceptionProperties)
      }
    }
  },
  setInitNumberToZero: (sourceVo = {}, targetVo = {}) => {
    for (const k in sourceVo) {
      if (sourceVo[k] === 0 && targetVo[k] === null) {
        targetVo[k] = 0
      }
    }
    return targetVo
  }
}

export default VoUtils
