import React from 'react';
import './index.less';

export default function Controller(props) {
    const {handleTranslateX, handleTranslateDown, handleRotate, handleRestart, handlePause} = props;

    return (
        <div className="controller-box">
            <div className="direction_controller">
                <div onClick={()=> handleTranslateX('left')} className="button button_left"></div>
                <div onClick={()=> handleTranslateX('right')} className="button button_right"></div>
                <div onClick={()=> handleTranslateDown()} className="button button_down"></div>
            </div>
            <div className="rotate_controller">
                <div onClick={()=> handleRotate('clockwise')} className="button">顺旋转</div>
                <div onClick={()=> handleRotate('anticlockwise')} className="button">逆旋转</div>
                <div onClick={()=> handleRestart()} className="button">重新开始</div>
                <div onClick={()=> handlePause()} className="button">暂停</div>
            </div>
        </div>
    );
}