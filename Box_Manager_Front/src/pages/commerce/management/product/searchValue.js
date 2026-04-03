export const searchStatus = {
  label: '상태',
  items: [
    {
      label: '전체',
      id: 'statusAll',
      checked: true
    },
    {
      label: '판매',
      id: 'statusSales',
      checked: true
    },
    {
      label: '판매박탈',
      id: 'statusDeprive',
      checked: true
    }
  ]
}

export const searchInput = {
  active: 'selrUsisName',
  list: [
    {
      label: '회사명',
      id: 'selrUsisName'
    },
    {
      label: '상품명',
      id: 'pdfNm'
    }
  ]
}

export const searchDate = {
  default: '15d',
  active: true
}
