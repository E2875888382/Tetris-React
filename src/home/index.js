import React, {Component} from 'react';
import './index.less';
import Screen from '../components/Screen';
import Panel from '../components/Panel';
import Control from '../components/Control';
import {detectRow, detectColumn, detectCrash, detectErasableList, detectGameOver} from '../utils/detect';
import {removeAndMergeBlock, initScreen, eliminate} from '../utils/screen';
import {getRandomBlock, getRotatedBlock} from '../utils/blocks';
import {calculateScore} from '../utils/rules';

class App extends Component {
    constructor() {
        super();
        const emptyBlock = {shape:[], type:'', index:0, pos:[0, 0]};

        this.state = {
            // 空白块，用于重置
            emptyBlock: emptyBlock,
            // 当前块
            currentBlock: emptyBlock,
            // 下一个块
            nextBlock: emptyBlock,
            // 最终显示的screen
            screen: [],
            // 得分
            score: 0,
            // 要消除的行数索引，用于添加消除动画
            erasableLinesList: [],
            // 累计消除的行数
            erasableLines: 0,
            // 游戏结束标志
            gameOver: false,
            // 游戏暂停标志
            pause: false
        };
        this.timer = null;
    }
    componentDidMount() {
        this._reset();
        this._loop();
    }
    // 卸载定时器
    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    // 定时器实现掉落
    _loop(speed) {
        clearTimeout(this.timer);
        if (!this.state.pause || !this.state.gameOver) {
            this.timer = setTimeout(()=> {
                this.handleControl('down');
            }, speed || 500);
        }
    }
    // 重置所有变量
    _reset() {
        const randomCurrent = getRandomBlock();

        this.setState((state, props)=> ({
            currentBlock: randomCurrent,
            nextBlock: getRandomBlock(),
            score: 0,
            erasableLinesList: [],
            erasableLines: 0,
            gameOver: false,
            pause: false,
            screen: removeAndMergeBlock(initScreen(), state.emptyBlock, randomCurrent)
        }));
    }
    // 检查能否消除
    _eliminate(screen) {
        // 检测是否能消除
        const newErasableLinesList = detectErasableList(screen);

        if (newErasableLinesList.length > 0) {
            // 获取经过消除后的screen
            const eliminatedScreen = eliminate(screen, newErasableLinesList); 

            // 累加消除的行数和积分
            this.setState((state, props)=> ({
                erasableLines: state.erasableLines + newErasableLinesList.length,
                score: state.score + calculateScore(newErasableLinesList),
                erasableLinesList: newErasableLinesList,
                pause: true
            }));
            // 添加消除动画
            setTimeout(() => {
                // 掉落新块
                this.setState((state, props)=> ({
                    screen: removeAndMergeBlock(eliminatedScreen, state.emptyBlock, state.nextBlock),
                    currentBlock: state.nextBlock,
                    nextBlock: getRandomBlock(),
                    erasableLinesList: [],
                    pause: false
                }));
                this._loop();
            }, 500);
        } else {
            // 掉落新块
            this.setState((state, props)=> ({
                screen: removeAndMergeBlock(state.screen, state.emptyBlock, state.nextBlock),
                currentBlock: state.nextBlock,
                nextBlock: getRandomBlock()
            }));
            this._loop();
        }
    }
    // 统一的更新视图函数吗，这里添加边界校验
    _updateScreen(newScreen, newBlock, direction) {
        // 1. 检测行越界
        if (!detectRow(newBlock.shape, newBlock.pos)) return; 
        // 2. 检测高越界
        if (!detectColumn(newBlock.shape, newBlock.pos)) {
            if (direction === 'down') this._eliminate(newScreen);
            return;
        }
        // 3. 检测游戏是否结束
        if (detectGameOver(newScreen)) {
            this.setState((state, props)=> ({
                gameOver: true,
                score: 0,
                erasableLines: 0
            }));
            return;
        }
        // 4. 检测block碰撞
        if (detectCrash(newScreen)) {
            // 垂直方向的碰撞需要考虑消除
            if (direction === 'down') this._eliminate(newScreen);
            return;
        }
        // 通过检验后更新状态
        this.setState((state, props)=> {
            this._loop();
            return {
                currentBlock: newBlock,
                screen: newScreen
            }
        });
    }
    // 控制方向和旋转
    handleControl(direction) {
        // 暂停或者游戏结束的时候禁止移动
        if (this.state.pause || this.state.gameOver) return;
        const [posX, posY] = this.state.currentBlock.pos;
        let newBlock;

        switch (direction) {
            case 'left': 
                newBlock = {
                    shape: this.state.currentBlock.shape,
                    type: this.state.currentBlock.type,
                    index: this.state.currentBlock.index,
                    pos: [posX - 1, posY]
                };
                break;
            case 'right':
                newBlock = {
                    shape: this.state.currentBlock.shape,
                    type: this.state.currentBlock.type,
                    index: this.state.currentBlock.index,
                    pos: [posX + 1, posY]
                };
                break;
            case 'down':
                newBlock = {
                    shape: this.state.currentBlock.shape,
                    type: this.state.currentBlock.type,
                    index: this.state.currentBlock.index,
                    pos: [posX, posY + 1]
                };
                break;
            case 'rotate':
                const rotatedBlock = getRotatedBlock(this.state.currentBlock.type, this.state.currentBlock.index);

                newBlock = {
                    shape: rotatedBlock.shape,
                    pos: this.state.currentBlock.pos,
                    index: rotatedBlock.index,
                    type: this.state.currentBlock.type
                };
                break;
            default :
                break;
        }
        this._updateScreen(removeAndMergeBlock(this.state.screen, this.state.currentBlock, newBlock), newBlock, direction);
    }
    // 重新开始
    handelRestart() {
        // 添加清除全部的动画
        this.setState((state, props)=> ({
            erasableLinesList: [...new Array(20).keys()]
        }));
        setTimeout(()=> {
            this._reset();
            this._loop();
        }, 1000);
    }
    // 暂停
    handlePause() {
        this.setState((state, props)=> ({
            pause: !state.pause
        }));
        this._loop();
    }
    render() {
        return (
            <div className="main-container">
                <div className="game-box">
                    <Screen 
                        screen={this.state.screen} 
                        erasableLinesList={this.state.erasableLinesList}
                    />
                    <Panel 
                        nextBlock={this.state.nextBlock.shape} 
                        score={this.state.score}
                    />
                </div>
                <Control
                    handleControl={this.handleControl.bind(this)}
                    handleRestart={this.handelRestart.bind(this)}
                    handlePause={this.handlePause.bind(this)}
                />
            </div>
        );
    }
}
export default App;