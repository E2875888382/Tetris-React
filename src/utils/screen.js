import {detectColumn, detectRow} from './detect';

// screen二维数组拷贝
function copy(arr) {
    return arr.map(row=> row.slice());
}

// 初始化空白screen
export function initScreen() {
    return new Array(20).fill(0).map(row=> new Array(10).fill(0));
}

// 从screen中移除block，返回screen
function removeOldBlock(oldBlock, [oldPosX, oldPosY], screen) {
    let temp = copy(screen);

    oldBlock.forEach((row, rowIndex)=> {
        row.forEach((col, colIndex)=> {
            if (col === 1) temp[rowIndex + oldPosY][colIndex + oldPosX]--;
        })
    });
    return temp;
}

// 将block合并入screen，返回screen
function mergeNewBlock(newBlock, [newPosX, newPosY], screen) {
    let temp = copy(screen);

    // 合并之前检查newBlock的边界合法性，不合法的就不合并，防止取值的时候越界
    if (!detectColumn(newBlock, [newPosX, newPosY]) || !detectRow(newBlock, [newPosX, newPosY])) {
        return [];
    }
    newBlock.forEach((row, rowIndex)=> {
        row.forEach((col, colIndex)=> {
            if (col === 1) temp[rowIndex + newPosY][colIndex + newPosX]++;
        })
    });
    return temp;
}

// 移除旧的并且合并新的
export function removeAndMergeBlock(
    screen,
    {
        shape: oldShape,
        index: oldIndex,
        type: oldType,
        pos: oldPos
    },
    {
        shape: newShape,
        index: newIndex,
        type: newType,
        pos: newPos
    }
) {
    const tempScreen = removeOldBlock(oldShape, oldPos, screen);
    const newScreen = mergeNewBlock(newShape, newPos, tempScreen);

    // 越界无法操作时按原值返回
    return newScreen.length > 0 ? newScreen : screen;
}

// 消除所有可消除的行，并返回新screen 
export function eliminate(screen, erasableLines) {
    let rest = screen.filter((item, index)=> !erasableLines.includes(index));

    for (let i = 0, len = erasableLines.length; i < len; i++) {
        rest.unshift(new Array(10).fill(0));
    }
    return rest;
}