// @description
// Ex--- 파일명은 퍼블확인용
// 개발시에는 'Ex' 제외한 파일명으로 새로 생성후 작업부탁드려요

const ExSkeletonTableNew = (props) => {
  return (
    <>
      <div className={'banner_list_wrap table_th_border '}>
        <table className="table type02 ">
          <caption>테이블 목록 로딩중</caption>
          <colgroup>
            <col width={'*'} />
          </colgroup>
          <thead>
            <tr>
              <th />
            </tr>
          </thead>
          <tbody>
            {Array.apply(null, { length: 10 }).map((e, i) => {
              return (
                <tr key={i} className="is-skeleton">
                  <td className={'ta_center'} />
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ExSkeletonTableNew
