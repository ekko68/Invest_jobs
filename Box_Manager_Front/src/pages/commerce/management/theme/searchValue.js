export const searchStatus = {
  label: '상태',
  items: [
    {
      label: '전체',
      id: 'statusAll',
      checked: true
    },
    {
      label: '공개',
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
    },
    {
      label: '비공개',
      id: 'statusPrivate',
      checked: true
    }
  ]
}

export const searchInput = {
  active: 'themeTitle',
  list: [
    {
      label: '제목',
      id: 'themeTitle'
    },
    {
      label: '설명',
      id: 'themeExpl'
    }
  ]
}

export const searchDate = {
  default: '15d',
  active: true
}
