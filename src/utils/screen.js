import {detectColumn} from './detect';

// 初始化空白screen
export function initScreen() {
    let row = new Array(20);

    for (let i = 0; i < 20; i++) {
        row[i] = new Array(10).fill(0);
    }
    return row;
}

// 从screen中移除block，返回screen
export function removeOldBlock(oldBlock, [oldPosX, oldPosY], screen) {
    let temp = new Array(10);
    const len = oldBlock.length;

    // 拷贝screen
    for (let i = 0; i < 20; i++) {
        temp[i] = screen[i].slice();
    }
    for (let i = 0; i < len; i++) {
        for (let j = 0, l = oldBlock[i].length; j < l; j++) {
            if (oldBlock[i][j] === 1) {
                temp[i + oldPosY][j + oldPosX] = 0;
            }
        }
    }
    return temp;
}

// 将block合并入screen，返回screen
export function mergeNewBlock(newBlock, [newPosX, newPosY], screen) {
    let temp = new Array(10);
    const len = newBlock.length;

    // 拷贝screen
    for (let i = 0; i < 20; i++) {
        temp[i] = screen[i].slice();
    }
    // 合并之前检查newBlock合法性，不合法的就不合并，防止取值的时候越界
    if (!detectColumn(newBlock, [newPosX, newPosY])) {
        return temp;
    }
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < newBlock[i].length; j++) {
            if (newBlock[i][j] === 1) {
                temp[i + newPosY][j + newPosX] += 1;
            }
        }
    }
    return temp;
}

// 移除旧的并且合并新的
export function removeAndMergeBlock(screen, oldBlock, [oldPosX, oldPosY], newBlock, [newPosX, newPosY]) {
    const tempScreen = removeOldBlock(oldBlock, [oldPosX, oldPosY], screen);
    const newScreen = mergeNewBlock(newBlock, [newPosX, newPosY], tempScreen);

    return newScreen;
}

// 消除所有可消除的行，并返回新screen 
export const eliminate = (screen, erasableLines)=> {
    let rest = screen.filter((item, index)=> !erasableLines.includes(index));

    for (let i = 0, len = erasableLines.length; i < len; i++) {
        rest.unshift(new Array(10).fill(0));
    }
    return rest;
}

// 根据消除的行数计算积分
export function calculateScore(erasableLines) {
    const len = erasableLines.length;

    if (len >= 0 && len <= 2) {
        return 100;
    } else if (len > 3 && len <= 6) {
        return 1000;
    } else {
        return 2000;
    }
}