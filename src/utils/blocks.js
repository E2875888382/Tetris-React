import {blocks} from './shapes';

// 随机取出一个block
export function getRandomBlock() {
    const randomBlockIndex = Math.floor(Math.random() * 7);
    const randomBlockType = Object.keys(blocks)[randomBlockIndex];
    // 某种形状的block
    const randomBlockList = blocks[randomBlockType];
    // 具体的block
    const randomListIndex = 0;
    const randomBlock = randomBlockList[randomListIndex];
    let randomX = 0;
    let randomY = 0;

    switch (randomBlockType) {
        case 'O':
            randomX = Math.floor(Math.random() * 8);
            randomY = 0;
            break;
        case 'I':
            randomX = Math.floor(Math.random() * 9);
            randomY = 0;
            break;
        case 'L':
            randomX = Math.floor(Math.random() * 8);
            randomY = 0;
            break;
        case 'T':
            randomX = Math.floor(Math.random() * 7);
            randomY = -1;
            break;
        default:
            randomX = Math.floor(Math.random() * 7);
            randomY = 0;
    }

    return {
        shape: randomBlock,
        index: randomListIndex,
        pos: [randomX, randomY],
        type: randomBlockType
    }

}

// 旋转block，direction（true表示顺时针）
export function getRotatedBlock(blockType, blockIndex, direction = true) {
    let nextBlockIndex;

    if (direction) {
        nextBlockIndex = blockIndex + 1 < 4 ? blockIndex + 1 : 0;
    } else {
        nextBlockIndex = blockIndex - 1 >= 0 ? blockIndex - 1 : 3;
    }
    return {
        shape: blocks[blockType][nextBlockIndex],
        index: nextBlockIndex
    };
}

// 获取block的边界信息,用于边界检测
export function getBlockBorderAttr(block) {
    const len = block.length;
    let colPointlist = [];
    let highestPoint = 0;
    let lowestPoint = 0;

    for (let i = 0; i < len; i++) {
        if (block[i].includes(1)) {
            highestPoint = i;
            break;
        }
    }
    for (let i = len - 1; i > 0; i--) {
        if (block[i].includes(1)) {
            lowestPoint = i;
            break;
        }
    }
    block.forEach(row=> {
        row.forEach((col, index)=> {
            if (col === 1) colPointlist.push(index);
        });
    });
    return {
        leftBorder: Math.min.apply(null, colPointlist),
        rightBorder: Math.max.apply(null, colPointlist),
        topBorder: highestPoint,
        bottomBorder: lowestPoint
    }
}