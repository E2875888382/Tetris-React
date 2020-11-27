import {detectColumn} from './detect';

// screen二维数组浅拷贝
function copy(arr) {
    let res = new Array(10);

    for (let i = 0; i < 20; i++) {
        res[i] = arr[i].slice();
    }
    return res;
}

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
    let temp = copy(screen);
    const len = oldBlock.length;

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
    let temp = copy(screen);
    const len = newBlock.length;

    // 合并之前检查newBlock合法性，不合法的就不合并，防止取值的时候越界
    if (!detectColumn(newBlock, [newPosX, newPosY])) {
        return [];
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

    // 越界无法操作时按原值返回
    return newScreen.length > 0 ? newScreen : screen;
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

    if (len >= 0 && len < 2) {
        return 100;
    } else if (len >= 2 && len < 4) {
        return 500;
    } else {
        return 1000;
    }
}