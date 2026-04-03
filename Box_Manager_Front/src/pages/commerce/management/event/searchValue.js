export const searchStatus = {
  label: '상태',
  items: [
    {
      label: '전체',
      id: 'statusAll',
      checked: true
    },
    {
      label: '진행',
      id: 'statusOpen',
      checked: true
    },
    {
      label: '대기',
      id: 'statusReady',
      checked: true
    },
    {
      label: '종료',
      id: 'statusClose',
      checked: true
    }
  ]
}

export const searchInput = {
  active: 'evntTtl',
  list: [
    {
      label: '이벤트명',
      id: 'evntTtl'
    }
  ]
}

export const searchDate = {
  default: '15d',
  active: true
}
