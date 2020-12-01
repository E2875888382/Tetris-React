import {getBlockBorderAttr} from './blocks';

// 检测行越界, 通过检测返回true
export function detectRow(block, [posX, posY]) {
    // 获取block的左右边界
    const {leftBorder, rightBorder} = getBlockBorderAttr(block);

    return ((posX + leftBorder) >= 0) && ((posX + rightBorder) <= 9);
}

// 检测列越界, 通过检测返回true
export function detectColumn(block, [posX, posY]) {
    // 获取block的上下边界
    const {topBorder, bottomBorder} = getBlockBorderAttr(block);

    return ((posY + topBorder) >= 0) && ((posY + bottomBorder) <= 19);
}

// 检测screen中是否存在碰撞，存在返回true，否则返回false
export function detectCrash(screen) {
    let bool = false;

    screen.forEach(row=> {
        if (!row.every(item=> item <= 1)) {
            bool = true;
        }
    });
    return bool;
}

// 检测是否有可消除的行，并返回可消除行的index集合，如果没有返回[]
export function detectErasableList(screen) {
    let res = [];

    screen.forEach((row, index)=> {
        // 如果某一排值都大于1代表这排可消除
        if (row.every(item=> item >= 1)) {
            res.push(index);
        }
    });
    return res;
}

// 检测游戏是否结束，也就是格子堆到顶了
export function detectGameOver(screen) {
    // 第1行出现碰撞
    return screen[1].some(item=> item > 1);
}