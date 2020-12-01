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