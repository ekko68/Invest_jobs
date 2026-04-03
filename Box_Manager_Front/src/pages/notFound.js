import Button from 'components/atomic/Button'

const notFound = () => {
  return (
    <div className="not_found_wrap">
      <div className="not_found_container">
        <h3 className="not_found_title">404</h3>
        <div className="not_found_main_text">
          <p className={'p01'}>현재 페이지를 찾을 수 없습니다!</p>
          <p className={'p02'}>(404 Not found)</p>
        </div>
        <div className="not_found_sub_text">
          페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다. <br />
          입력하신 주소가 정확한지 다시 한번 확인해 주시기 바랍니다.
        </div>
        <div className="btn_group">
          <Button className={'linear_sky_blue'}>이전 페이지로 이동</Button>
          <Button className={'full_blue'}>메인 페이지로 이동</Button>
        </div>
      </div>
    </div>
  )
}
export default notFound
