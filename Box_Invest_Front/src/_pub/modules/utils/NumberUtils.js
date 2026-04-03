
export const isNumber = (number) => {
    if(!isNaN(number) && (number !== null && number !== undefined && String(number).trim() !== '')) return true;
    else return false;
};

export const isAnyNotNumber = (...numberArr) => {
    let result = false;
    for(let number of numberArr) {
        if(isNaN(number) || !(number !== null && number !== undefined && String(number).trim() !== '')) {
            result = true;
            break;
        }
    }
    return result;
};

export const limitJsSafeIntegerNumberSet = (number) => {
    if(!isNaN(number) && (number !== null && number !== undefined && String(number).trim() !== '')) {
        if(number > Number.MAX_SAFE_INTEGER) return Number.MAX_SAFE_INTEGER;
        else if(number < Number.MIN_SAFE_INTEGER) return Number.MIN_SAFE_INTEGER;
        else return number;
    }
    else {
        return 0;
    }
};

export const limitJsIntegerNumberSet = (number) => {
    if(!isNaN(number) && (number !== null && number !== undefined && String(number).trim() !== '')) {
        if(number > Number.MAX_VALUE) return Number.MAX_VALUE;
        else if(number < Number.MIN_VALUE) return Number.MIN_VALUE;
        else return number;
    }
    else {
        return 0;
    }
};

export const limitNumberSet = (number, max = NumberConst.MAX_TRILLION, min = NumberConst.MIN_MINUS_TRILLION) => {
    if(!isNaN(number) && (number !== null && number !== undefined && String(number).trim() !== '')) {
        if(number > max) return max;
        else if(number < min) return min;
        else return number;
    }
    else {
        return 0;
    }
};

export const NumberConst = {
    MAX_TRILLION: 999999999999999,
    MIN_MINUS_TRILLION: -999999999999999
}

Object.freeze(NumberConst);