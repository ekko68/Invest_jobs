import React, { forwardRef, useImperativeHandle, useState } from 'react'
import NoResult from "components/common/NoResult";
import {createKey} from "modules/utils/CommonUtils";


const IntroMedia = forwardRef((props, ref) => {
  const [list, setList] = useState([])
  useImperativeHandle(ref, () => ({
    setData
  }))
  const setData = (temp) => {
    setList(temp)
  }
  const convertYouTubeUrl = (inrdPictUrl) => {
    let movieId = ''
    const array = String(inrdPictUrl).split('/')
    if (array) {
      if (array.length > 0) {
        movieId = array[array.length - 1]
        movieId = movieId.replace('watch?v=', '');
      }
    }
    return 'https://www.youtube.com/embed/' + movieId
  }
  return (
    <div className="intro_video_wrap">
      <ul className="intro_video_list">
        {
          list?.length > 0
              ? list?.map((item, i) => (
                  <li className="intro_video_item" key={createKey()}>
                    <iframe
                        width="100%"
                        height="200px"
                        src={convertYouTubeUrl(item['inrdPictUrl'])}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        key={createKey()}
                    >
                      &nbsp;
                    </iframe>
                  </li>
              ))
              : <NoResult msg={'등록된 소개영상 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/>
        }
      </ul>
    </div>
  )
});

export default IntroMedia;
