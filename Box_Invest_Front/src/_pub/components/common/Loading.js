import * as React from 'react'
import Lottie from 'react-lottie'
import animationData from 'assets/images/lottie/ibk_logo_loading'

import 'assets/style/loading.scss'

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      className: 'loading_lottie'
    }
  }

  return (
    <div className="loadingPage" id="loadingstate">
      <Lottie options={defaultOptions} />
      <div className="loading_text">
        <span className="blind">IBK 기업은행</span>
      </div>
    </div>
  )
}

export default Loading
