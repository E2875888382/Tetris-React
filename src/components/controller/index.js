import React from 'react';
import './index.less';

export default function Controller(props) {
    const {handleTranslate, handleRotate, handleRestart, handlePause} = props;

    return (
        <div className="controller-box">
            <div className="rotate_controller">
                <div onClick={()=> handleRestart()} className="button">重玩</div>
                <div onClick={()=> handlePause()} className="button">暂停</div>
            </div>
            <div className="direction_controller">
                <div onClick={()=> handleRotate()} className="button button_top"></div>
                <div onClick={()=> handleTranslate('left')} className="button button_left"></div>
                <div onClick={()=> handleTranslate('right')} className="button button_right"></div>
                <div onClick={()=> handleTranslate('down')} className="button button_down"></div>
            </div>
        </div>
    );
}