import React from 'react';
import './index.less';
import '../../assets/css/animation.less';

function Screen(props) {
    return (
        <div className="screen">
            {
                props.screen.map((row, k1)=> {
                    let rowClass = 'screen__row';

                    if (props.erasableLinesList.indexOf(k1) !== -1) {
                        rowClass += ' flash';
                    }
                    return <div key={k1} className={rowClass}>
                        {
                            row.map((col, k2)=> {
                                return <span key={k2} className={col ? 'screen__item_black' : 'screen__item'}></span>
                            })
                        }
                    </div>
                })
            }
        </div>
    );
}

export default Screen;