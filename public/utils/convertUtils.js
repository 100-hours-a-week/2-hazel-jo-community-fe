// 숫자를 K 단위로 변환
export const convertK = (num) => {
    if(num >= 1000) {
        return (num / 1000).toFixed(0) + 'k';
    }
    return num.toString();
}