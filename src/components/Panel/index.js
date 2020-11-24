import React from 'react';
import style from './index.module.less';

export default function Panel(props) {
    return (
        <div className={style.container}>
            <div className={style.score_panel}>
                <span className={style.title}>score:</span>
                <span>{props.score}</span>
            </div>
            <div className={style.next_block}>
                <span className={style.title}>next:</span>
                {
                    props.nextBlock.map((row, k1)=> {
                        return <div key={k1} className={style.screen__row}>
                            {
                                row.map((col, k2)=> {
                                    return <span key={k2} className={col ? style.screen__item_black : style.screen__item}></span>
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    )
}