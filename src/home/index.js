import React from 'react';
import './index.less';
import Screen from '../components/Screen';
import {detectRow, detectColumn, detectCrash, detectErasableList} from '../utils/detect';
import {removeAndMergeBlock, initScreen, eliminate} from '../utils/screen';
import {getRandomBlock, getRotatedBlock} from '../utils/blocks';

class App extends React.Component {
    constructor() {
        super();
        const {newBlock, newPosition, newBlockType, newBlockIndex} = getRandomBlock();

        this.state = {
            block: newBlock,
            blockType: newBlockType,
            blockIndex: newBlockIndex,
            blockPosition: newPosition, // 当前块相对于screen的位置（x, y）
            screen: initScreen()
        };
    }
    componentDidMount() {
        this.setState((state, props)=> ({
            screen: this._newScreen(state.block, state.blockPosition),
        }));
    }
    // 通过相对位置将block合并到screen中，并返回新的screen
    _newScreen(newBlock, newPos, oldScreen = []) {
        // 1. 拷贝一份screen
        const screen = oldScreen.length > 0 ? oldScreen : this.state.screen;
        const oldBlock = this.state.block;
        const oldPos = this.state.blockPosition;

        return removeAndMergeBlock(screen, oldBlock, oldPos, newBlock, newPos);
    }
    // 统一的边界校验，并最终更新视图
    _updateScreen(screen, block, blockPosition, blockIndex) {
        // 1. 检测宽
        if (!detectRow(screen, blockPosition)) return; 
        // 2. 检测高
        if (!detectColumn(block, blockPosition)) return;
        // 3. 检测block碰撞
        if (detectCrash(screen)) return ;
        // 4. 检测是否能消除
        const erasableLines = detectErasableList(screen);

        if (erasableLines.length > 0) {
            const {newBlock, newPosition} = getRandomBlock();
            const eliminatedScreen = eliminate(screen, erasableLines); // 消除后的screen
            // 添加新的随机block, 更新screen，触发消除动画
            this.setState((state, props)=> ({
                blockPosition: newPosition,
                screen: this._newScreen(newBlock, newPosition, eliminatedScreen),
                block: newBlock,
                blockIndex: blockIndex
            }));
            return;
        }
        // 5. 检测是否到底了，产生新的块

        this.setState((state, props)=> ({
            blockPosition: blockPosition,
            screen: screen,
            block: block,
            blockIndex: blockIndex
        }));
    }
    // 左右平移，需要进行边界检测
    handleTranslateX(direction) {
        const [posX, posY] = this.state.blockPosition;
        const newPos = [direction === 'left' ? posX - 1: posX + 1, posY];

        this._updateScreen(
            this._newScreen(this.state.block, newPos),
            this.state.block,
            newPos,
            this.state.blockIndex
        );
    }
    // 向下移动
    handleTranslateDown() {
        const [posX, posY] = this.state.blockPosition;

        this._updateScreen(
            this._newScreen(this.state.block, [posX, posY + 1]),
            this.state.block, 
            [posX, posY + 1],
            this.state.blockIndex
        );
    }
    // 旋转方法
    handleRotate(direction) {
        const clockwise = direction === 'clockwise';
        const {block, blockIndex} = getRotatedBlock(this.state.blockType, this.state.blockIndex, clockwise);

        this._updateScreen(
            this._newScreen(block, this.state.blockPosition),
            block,
            this.state.blockPosition,
            blockIndex
        );
    }
    render() {
        return (
            <div className="container">
                <Screen screen={this.state.screen} />
                <div className="controller-box">
                    <div className="direction_controller">
                        <div onClick={this.handleTranslateX.bind(this, 'left')} className="button button_left"></div>
                        <div onClick={this.handleTranslateX.bind(this, 'right')} className="button button_right"></div>
                        <div onClick={this.handleTranslateDown.bind(this)} className="button button_down"></div>
                    </div>
                    <div className="rotate_controller">
                        <div onClick={this.handleRotate.bind(this, 'clockwise')} className="button">顺</div>
                        <div onClick={this.handleRotate.bind(this, 'anticlockwise')} className="button">逆</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;