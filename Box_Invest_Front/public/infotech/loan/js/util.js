
var StringUtil = {
	
	/**
	 * Null Check Function
	 * @param value
	 * @returns {boolean}
	 */
	isEmptyValue : function(value){
		if(typeof value == 'undefined'){
			return true;
		}
		if (value == ""
			|| value == null
			|| value == undefined
			|| (value != null && typeof value == "object" && !Object
					.keys(value).length))
		{
			if (String(value) == String(0)) {
				return false;
			}
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 영문, 숫자만 입력 체크
	 * @param value
	 * @return {boolean}
	 */
	checkIdRegex : function(value){
		var rValue = value.replace(/[^0-9a-zA-z]/g, "");
		
		if(rValue == value){
			return true;
		}
		
		return false;
	},
	/**
	 * 이메일 패턴 체크
	 * @param email
	 * @return {boolean}
	 */
	isValidEmail : function(email){
		var pattern = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}/;
		
	    if (email.match(pattern) == null) {
	        return false;
	    }
	    else {
	        return true;
	    }
	},
	/**
	 * fixNull(puValue);
	 * null이거나 정의되지 않은경우 ""로 반환
	 */
	fixNull: function(value) {
		var vsType = typeof(value);
		if (vsType == "string" || (vsType == "object" && value instanceof String)) {
			value = value.replace(/\s*/g, "");
		}

		return (value == null || value == "null" || value == "undefined") ? "" : String(value);
	},
	/**
	 * isNull(puValue);
	 * Null 여부 체크
	 */
	isNull : function(value) {
		return (this.fixNull(value) == "");
	},
	/**
	 * 빈 문자열 0으로 채우기
	 * @param {String} str
	 * @param {Number} padLen
	 */
	lpad : function(str, padLen){
		str += "";

		while (str.length < padLen) {
			str = "0" + str;
		}
		str = str.length >= padLen ? str.substring(0, padLen) : str;
		return str;
	},
	/**
	 * 숫자타입 콤마 생성
	 * @param {any} value
	 */
	numberWithCommas : function(value){
		return this.removeLeftZero(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
	},
	/**
	 * 좌측 0 제거
	 * @param {any} value
	 */
	removeLeftZero : function(value){
		return value.toString().replace(/(^0+)/, "");
	},
	/**
	 * 전화번호 변환
	 * @param {any} value
	 */
	phoneConvert : function(value){
		if(value.length==8) return value.substr(0,4)+"-"+value.substr(4);
		return value.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
	}
}



var DeviceUtil = {
	isMobile : function(){
		var flag = false;
		var mobile = [
			"iPhone", "iPod", "BlackBerry", "Android", "Windows CE",
			"Window CE;", "LG", "MOT", "SAMSUNG", "SonyEricsson",
			"Mobile", "Symbian", "Opera Mobi", "Opera Mini", "IEmobile"
		];
		
		for(var m in mobile){
			if(navigator.userAgent.match(mobile[m]) != null){
				flag = true;
				break;
			}
		}
		
		return flag;
	}
}



// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}


if(!String.prototype.startsWith){
	String.prototype.startsWith = function(search, pos){
		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
	}
}
