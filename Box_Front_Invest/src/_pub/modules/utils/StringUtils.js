/* eslint-disable no-mixed-spaces-and-tabs */
export const StringUtils = {
    comma: (value) => {
        const num = value === undefined || value === null || String(value).trim() === '' ? 0 : value
        // negative lookbehind 문법 사파리, ios 지원 안함
        // return String(num).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
        const splitNum = num.toString().split('.');
        splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return splitNum.join('.');
    },
    bizNum: (value) => {
        return String(value).replace(/(\d{3})(\d{2})(\d{5})/g, '$1-$2-$3')
    },
    corporateNum: (value) => {
        return String(value).replace(/(\d{6})(\d{7})/g, '$1-$2')
    },
    toBr: (value) => {
        if (value === null) return "";
        // return String(value).replace(/\n/g, '<br/>')
        return String(value).replace(/(?:\r\n|\r|\n)/g, '<br/>');
    },
    brToArray: (value) => {
        return value.split('\n')
    },
    hasLength: (value) => {
        if (value !== null && value !== undefined && String(value).trim() !== '') return true;
        else return false;
    },
    isAnyBlank: (...valueStrArr) => { // 하나라도 빈 값이 있는지
        let result = false;
        for(let value of valueStrArr) {
            if (!(value !== null && value !== undefined && String(value).trim() !== '')) {
                result = true;
                break;
            }
        }
        return result;
    },
    toCssCase: (camelString) => {
        return camelString.split('').map(character => {
            if (character == character.toUpperCase()) return '-' + character.toLowerCase();
            else return character;
        }).join('');
    },
    cutStrByLimit: (valueStr='', limitNum=0) => {
        if(valueStr?.length > limitNum) {
            return valueStr.substring(0, limitNum);
        }
        else {
            return valueStr;
        }
    },
    makeReduceDelimiterString: (delimiter , ...stringValues) => {
        return stringValues?.reduce((pre, cur) => {
            if(cur !== null && cur !== undefined && String(cur).trim() !== '') return pre + delimiter + cur
            else return pre;
        })
    },
    /**
	 * 이메일 패턴 체크
	 * @param email
	 * @return {boolean}
	 */
    isValidEmail: (email) => {
        console.log(email);
		let pattern = /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}/;
	    if (email.match(pattern) == null) {
	        return false;
	    }
	    else {
	        return true;
	    }
    }
}

export const FormatUtils = {
    numberWithCommas: new Intl.NumberFormat('ko-KR'),
}
