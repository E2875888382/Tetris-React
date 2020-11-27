import React from 'react';
import './index.less';
import Screen from '../components/Screen';
import Panel from '../components/Panel';
import Controller from '../components/Controller';
import {detectRow, detectColumn, detectCrash, detectErasableList, detectGameOver} from '../utils/detect';
import {removeAndMergeBlock, initScreen, eliminate, calculateScore} from '../utils/screen';
import {getRandomBlock, getRotatedBlock} from '../utils/blocks';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            block: [],
            blockType: '',
            blockIndex: 0,
            blockPosition: [0, 0],
            nextBlock: [],
            nextBlockType: '',
            nextBlockIndex: 0,
            nextBlockPosition: [0, 0],
            screen: [],
            pause: false, // 暂停游戏
            gameOver: false, // 是否gameOver
            erasableLines: 0, // 已经消除的行数
            score: 0, // 积分
            erasableLinesList: [] // 需要消除的行数，用于添加动画
        };
    }
    componentDidMount() {
        this._init();
        this._drop(500);
    }
    _init() {
        // 构造时生成两个block
        const newScreen = initScreen();
        const {newBlock, newPosition, newBlockType, newBlockIndex} = getRandomBlock();
        const {
            newBlock: nextBlock,
            newPosition: nextBlockPosition,
            newBlockType: nextBlockType,
            newBlockIndex: nextBlockIndex 
        } = getRandomBlock();
        

        this.setState((state, props)=> ({
            screen: removeAndMergeBlock(newScreen, [], [0, 0], newBlock, newPosition),
            block: newBlock,
            blockType: newBlockType,
            blockIndex: newBlockIndex,
            blockPosition: newPosition,
            nextBlock: nextBlock,
            nextBlockType: nextBlockType,
            nextBlockIndex: nextBlockIndex,
            nextBlockPosition: nextBlockPosition,
            score: 0
        }));
    }
    // 掉落任务，可以根据累计消除的行数加快掉落速度
    _drop(speed) {
        const timer = setInterval(()=> {
            if (this.state.gameOver) {
                clearInterval(timer);
                alert('game over');
                return;
            };
            if (this.state.pause) {
                clearInterval(timer);
                return;
            }
            this.handleControl('down');
        }, speed);
    }
    // 在screen中生成新的block
    _addNewBlock(screen) {
        // 将next更新到当前，生成新的block到next中
        const {newBlock, newPosition, newBlockType, newBlockIndex} = getRandomBlock();
        const newScreen = removeAndMergeBlock(screen, [], [0, 0], this.state.nextBlock, this.state.nextBlockPosition);

        this.setState((state, props)=> ({
            screen: newScreen,
            block: state.nextBlock,
            blockType: state.nextBlockType,
            blockIndex: state.nextBlockIndex,
            blockPosition: state.nextBlockPosition,
            nextBlock: newBlock,
            nextBlockType: newBlockType,
            nextBlockIndex: newBlockIndex,
            nextBlockPosition: newPosition
        }));
    }
    _eliminate(screen) {
        // 检测是否能消除
        const erasableLines = detectErasableList(screen);

        if (erasableLines.length > 0) {
            // 保存消除的行数，并计算积分
            const score = calculateScore(erasableLines);
            // 获取经过消除后的screen
            const eliminatedScreen = eliminate(screen, erasableLines); 

            this.setState((state, props)=> ({
                erasableLines: state.erasableLines + erasableLines.length,
                score: state.score + score,
                // erasableLinesList: erasableLines,
                // pause: true
            }));
            this._addNewBlock(eliminatedScreen);
            // setTimeout(()=> {
            //     this._addNewBlock(eliminatedScreen);
            //     // 这里要触发消除动画
            //     this.setState((state, props)=> {
            //         this._drop(500);
            //         return {
            //             erasableLinesList: [],
            //             pause: false
            //         };
            //     });
            // }, 1000);
        } else {
            this._addNewBlock(this.state.screen);
        }  
    }
    // 更新视图都需要经过统一的校验
    _updateScreen(screen, block, blockPosition, blockIndex, control) {
        // 1. 水平方向移动和旋转需要检测行越界
        if (['left', 'right', 'rotate'].indexOf(control) !== -1) {
            if (!detectRow(screen, blockPosition, block)) return; 
        }
        // 2. 下落和旋转需要检测高越界
        if (['down', 'rotate'].indexOf(control) !== -1) {
            if (!detectColumn(block, blockPosition)) {
                if (control === 'down') {
                    this._eliminate(screen);
                };
                return;
            };
        }
        // 3. 检测游戏是否结束
        if (detectGameOver(screen)) {
            this.setState((state, props)=> ({
                gameOver: true,
                score: 0
            }));
            return;
        }
        // 4. 检测block碰撞
        if (detectCrash(screen)) {
            if (control === 'down') {
                this._eliminate(screen);
            };
            return;
        };
        // 通过检验后更新状态
        this.setState((state, props)=> ({
            blockPosition: blockPosition,
            screen: screen,
            block: block,
            blockIndex: blockIndex
        }));
    }
    // 控制方向和旋转
    handleControl(direction) {
        // 暂停的时候禁止移动
        if (this.state.pause) return;
        const {
            screen: oldScreen,
            block: oldBlock,
            blockIndex: oldBlockIndex,
            blockType: oldBlockType,
            blockPosition: [posX, posY]
        } = this.state;

        switch (direction) {
            case 'left': 
                this._updateScreen(
                    removeAndMergeBlock(oldScreen, oldBlock, [posX, posY], oldBlock, [posX - 1, posY]),
                    oldBlock,
                    [posX - 1, posY],
                    oldBlockIndex,
                    direction
                );
                break;
            case 'right':
                this._updateScreen(
                    removeAndMergeBlock(oldScreen, oldBlock, [posX, posY], oldBlock, [posX + 1, posY]),
                    oldBlock,
                    [posX + 1, posY],
                    oldBlockIndex,
                    direction
                );
                break;
            case 'down':
                this._updateScreen(
                    removeAndMergeBlock(oldScreen, oldBlock, [posX, posY], oldBlock, [posX, posY + 1]),
                    oldBlock,
                    [posX, posY + 1],
                    oldBlockIndex,
                    direction
                );
                break;
            case 'rotate':
                const {block, blockIndex} = getRotatedBlock(oldBlockType, oldBlockIndex, true);

                this._updateScreen(
                    removeAndMergeBlock(oldScreen, oldBlock, [posX, posY], block, [posX, posY]),
                    block,
                    [posX, posY],
                    blockIndex,
                    direction
                );
                break;
            default: 
                break;
        }
    }
    // 重新开始
    handelRestart() {
        let erasableLinesList = [...new Array(20).keys()];
        // 添加清除全部的动画
        this.setState((state, props)=> ({
            erasableLinesList: erasableLinesList
        }));
        setTimeout(()=> {
            this.setState((state, props)=> ({
                erasableLinesList: []
            }));
            this._init();
        }, 1000);
    }
    // 暂停
    handlePause() {
        this.setState((state, props)=> {
            if (state.pause) this._drop(500);
            return {
                pause: !state.pause
            }
        });
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
                        nextBlock={this.state.nextBlock} 
                        score={this.state.score}
                    />
                </div>
                <Controller 
                    handleControl={this.handleControl.bind(this)}
                    handleRestart={this.handelRestart.bind(this)}
                    handlePause={this.handlePause.bind(this)}
                />
            </div>
        );
    }
}

export default App;