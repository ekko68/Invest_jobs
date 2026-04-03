/** @jsxImportSource @emotion/react */
import { galleryStyle } from 'assets/style/ComponentStyle'

const Gallery01 = (props) => {
  const { data } = props

  return (
    <div
      className="gallery_wrap"
      css={galleryStyle}
      style={{ background: `url(${data.img}) center center no-repeat`, backgroundSize: 'cover' }}
    >
      <div className="gallery_inner">
        <h2 className="gallery_title">{data.title}</h2>
        <p className="gallery_subtitle">{data.subInfo}</p>
      </div>
    </div>
  )
}

export default Gallery01
