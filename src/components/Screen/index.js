import React from 'react';
import './index.less';

function Screen(props) {
    return (
        <div className="screen">
            {
                props.screen.map((row, k1)=> {
                    return <div key={k1} className="screen__row">
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