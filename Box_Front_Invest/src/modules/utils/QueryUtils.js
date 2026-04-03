import querystring from 'querystring'

const QueryUtils = {
  getQuery: (props) => {
    let query = null
    if (props.location) {
      const { search } = props.location
      query = querystring.parse(search.replace('?', ''))
    }
    return query
  },
  getObjectQuery: (props, properties) => {
    let r = null
    if (props.location) {
      r = {}
      const query = QueryUtils.getQuery(props)
      if (query) {
        for (let i = 0; i < properties.length; i++) {
          const property = properties[i]
          if (query.hasOwnProperty(property)) {
            r[property] = query[property]
          }
        }
      }
    }
    return r
  },
  setEqualBoolean: (props, property, compareValue, boolean) => {
    if (props.location) {
      const query = QueryUtils.getQuery(props)
      if (query) {
        if (query.hasOwnProperty(property)) {
          if (query[property] === compareValue) {
            boolean = true
          } else {
            boolean = false
          }
        }
      }
    }
  },
  setEqualRefBoolean: (props, property, compareValue, refBoolean) => {
    if (props.location) {
      const query = QueryUtils.getQuery(props)
      if (query) {
        if (query.hasOwnProperty(property)) {
          if (query[property] === compareValue) {
            refBoolean.current = true
          } else {
            refBoolean.current = false
          }
        }
      }
    }
  },
  getSimpleQueryString: (props, property) => {
    let r = ''
    if (props.location) {
      const query = QueryUtils.getQuery(props)
      if (query) {
        r = query[property]
      }
    }
    return r
  },
  getRedirectStringForLogin: () => {
    return window.location.href
  },
  getLocationParam: (props, property) => {
    let r = null
    if (props) {
      if (props.location) {
        if (props.location.state) {
          if (props.location.state[property]) {
            r = props.location.state[property]
          }
        }
      }
    }
    return r
  }
}

export default QueryUtils
