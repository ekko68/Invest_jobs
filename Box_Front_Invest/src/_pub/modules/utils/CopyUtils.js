const CopyUtils = {
  copy(obj) {
    let clone = {}
    if (Array.isArray(obj)) clone = []
    for (let key in obj) {
      if (typeof obj[key] == 'object' && obj[key] != null) {
        clone[key] = CopyUtils.copy(obj[key])
      } else {
        clone[key] = obj[key]
      }
    }
    return clone
  }
}
export default CopyUtils
