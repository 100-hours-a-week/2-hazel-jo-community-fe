// DOM 요소 선택 함수 
export const selectDom = (selector) => document.querySelector(selector);
export const selectAll = (selectors) => 
    Object.fromEntries(Object.entries(selectors).map(([key, value]) => [key, selectDom(value)]));