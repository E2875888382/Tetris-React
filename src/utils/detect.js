// 检测行越界
export function detectRow(screen, [posX, posY]) {
    const legalRow = screen.every(row=> row.length <= 10);
    const legalPosX = posX >= 0;

    return legalRow && legalPosX;
}

// 检测列越界
export function detectColumn(block, [posX, posY]) {
    // block的高度
    const blockHeight = block.length;
    // block中有值的最低点
    let lowestPoint = 0;

    // 从后往前遍历，获取最低点
    for (let i = blockHeight - 1; i > 0; i--) {
        if (block[i].includes(1)) {
            lowestPoint = i;
            break;
        }
    }

    // block在screen的最低点 = 相对高度 + block最低点 + 1
    const totalHeight = posY + lowestPoint + 1;

    return totalHeight <= 20;
}

// 检测screen中是否存在碰撞
export function detectCrash(screen) {
    for (let i = 0, len = screen.length; i < len; i++) {
        if (!screen[i].every(item=> item <= 1)) {
            return true;
        }
    }
    return false;
}

// 检测是否有可消除的行，并返回可消除行的index集合，如果没有返回[]
export function detectErasableList(screen) {
    let res = [];

    for (let i = 0, len = screen.length; i < len; i++) {
        // 如果某一排值都大于1代表这排可消除
        if (screen[i].every(item=> item >= 1)) {
            res.push(i);
        }
    }
    return res;
}