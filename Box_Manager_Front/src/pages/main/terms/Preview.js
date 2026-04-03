import Button from 'components/atomic/Button'
import React from 'react'

const Preview = ({ preview, handlePopup }) => {

    const onPopup = () => {
        if (handlePopup) handlePopup()
    }

    return (
        <div className={`popup_wrap popup_confirm`}>
            <div className="layer">&nbsp;</div>
            <div className="popup_container" style={{ width: 420 }}>
                <div className="popup_content" >
                    <div className='preview-popup' style={{ width: 360 }}>
                        <div className="section_agree">
                            <div
                                className={'terms_text'}
                                style={{ maxHeight: '50vh', }}
                                dangerouslySetInnerHTML={{
                                    __html: preview
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="popup_footer">
                    <Button className={'full_blue'}
                        onClick={onPopup}
                    >
                        닫기
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Preview
