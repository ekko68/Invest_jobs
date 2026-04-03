/******************************************************************** 
 * @업무명		: 	공통
 * @설명		:	실행 script
 * @파일명		:	orchestra_framework.js
 * @기존명		:
 *********************************************************************
 * 번호		작업자	작업일		변경내용
 *--------------------------------------------------------------------
 * 1        이정숙	2017-07-14	최초작성
 * 2		김기백  2018-06-07  코드 정리
 * 3		박햔일  2018-07-17  코드 정리
 *********************************************************************/

var OFHistoryObj = {};

/**
 * 2018.07.17 박현일 수정
 * DOM이 모두 로드된 시점에서 호출되는 함수
 * 화면이동이 완료된 시점에서 아래의 리스너에 의해 함수가 호출이 되면
 * 이전화면에서 전달한 파라미터를 네이티브영역에서 컨텐츠영역으로 가져오는 기능
 * 단, 업무화면의 스크립트내에 'ofReady' 함수가 존재하여야 함.
 * 
 * 2019.01.21 김기백 수정
 * exBuilder의 특성상 업무화면의 스크립트내에 ofReady를 선언해도 전역이 아니므로 호출불가.
 * OFHistoryObject 전역변수에 데이터를 저장하는 형태로 수정.
 */
document.addEventListener("DOMContentLoaded",
    function () {
        // 플러그인 호출시 콜백함수 이름을 지정해서 넘겨야 정상적으로 콜백 받을수 있음.
        OFHistory.list(callbackHistoryList, {}, true, "OFHistory.list1");
    }
);

/**
 * 히스토리 정보 콜백
 * @param result
 */
var callbackHistoryList = function(result){
	if (result.resultCode == 0) {
        OFHistoryObj = result.result;
    }
}

/**
 * Null Check Function
 * @param value
 * @returns {boolean}
 */
function isEmptyValue(value){

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

}

/**
 * @class 콜백없는경우, 기본 콜백
 */
function default_callback(ret) {
	console.log("default_callback ::::: " + JSON.stringify(ret));
}

// 로그 출력 여부
var OF_ConsoleLog_Flag = true;
var OF = {
    exeStatus	 : 0
    , callbackId : 0
    , callerId : 0
    , isWebApp	 : function(){
        var userAgent = navigator.userAgent || navigator.vendor || window.ofa;
        if(userAgent.match(/Android/i)){
            this.exeStatus = userAgent.indexOf("AndroidWebKit") == -1 ? 2 : 3;
        }else{
            if(userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)){
                this.exeStatus = userAgent.indexOf("Safari", 0) != -1 ? 4 : 5;
            }else{
                this.exeStatus = 0;
            }
        }
    } //end: , isWebApp: function(){
    , log : function(){
        try{
            throw Error('');
        }catch(err){
            var args = [];
            for(var i = 0; i < arguments.length; i++){
                args.push(arguments[i]);
            }
        }
    } //end: , log: function(){
    , exec : function () {
        try {

            var index = 0;
//            var cb = encodeURIComponent(arguments[index++]);
//            if (typeof cb === "function"){
//				cb = "(" + cb + ")";
//			}
            var cb = arguments[index++];
            if (typeof cb === "function"){
				//cb = "(" + cb + ")";
				cb = cb.name;
			}
			
            var info = {
                callback  : cb,
                extension : arguments[index++],
                method	  : arguments[index++]
            };

            if (!Array.isArray(arguments[index]) && typeof(arguments[index]) != "boolean") {
                info.callerId = arguments[index++];
            }

            if (!Array.isArray(arguments[index]) && typeof(arguments[index]) == "boolean") {
                info.singleton = arguments[index++];
            }

            var params = [];
            for (var i = index; i < arguments.length ; i++) {
                params.push(arguments[i]);
            }

            info["params"] = params;
            
            var json = JSON.stringify(info);

            OF.execute_run(json);
        } catch (e) {
            var args = [];

            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            
            OF.log("execute : " + args + " = " + e);
        }

    }

    , execute_run : function(ofa_json){
        this.log(ofa_json);
        var status = this.exeStatus;

        switch(status){
            case 2: //안드로이드 웹
                break;
            case 3: //안드로이드 앱
                orchestraBridge.execute(ofa_json);
                break;
            case 4: //아이폰 웹
                break;
            case 5: //아이폰 앱
            	var pluginMessage = "ofa:///#" + ofa_json;
            	var isWK = false;
            	try{
            		if(typeof(webkit.messageHandlers.orchestraBridge) != "undefined")
            			isWK = true;
            	}catch(e){}
            	
            	if (isWK) {
            		// WKWebView
            		webkit.messageHandlers.orchestraBridge.postMessage({"pluginMessage" : pluginMessage});
            	} else {
            		//UIWebView
            		alert(pluginMessage);
            	}
                break;
            default:
                break;
        }
    } //end: , execute: function(ofa_json){
}; //end: var ofa = {
OF.isWebApp();

/**
 * device 구분
 *
 * @return 'ios' or 'android' or 'else'
 */
var getUserAgent = function() {

//	OF.isWebApp();
    if (OF.exeStatus == 3) {
        return "android";
    } else if (OF.exeStatus == 5) {
        return "ios";
    } else {
        return "else";
    }
};


/**
 * 2018.08.24 박현일
 * Orchestra Framework Core에서 포함되어 배포되는 플러그인은
 * orchestra_framework.js에 선언되어 관리한다.
 */
OFDebugConsole = function(isDeprecated) {
    this.logLevel = OFDebugConsole.INFO_LEVEL;
    this.isDeprecated = isDeprecated ? true : false;
};
OFDebugConsole.ALL_LEVEL   = 1;
OFDebugConsole.INFO_LEVEL  = 1;
OFDebugConsole.WARN_LEVEL  = 2;
OFDebugConsole.ERROR_LEVEL = 4;
OFDebugConsole.NONE_LEVEL  = 8;
OFDebugConsole.prototype.setLevel = function(level) {
    this.logLevel = level;
};
OFDebugConsole.callbackCnt = 1;
OFDebugConsole.prototype.processMessage = function(message, maxDepth) {
    if (maxDepth === undefined)
        maxDepth = 0;
    if (typeof (message) != 'object') {
        return (this.isDeprecated ? "WARNING: debug object is deprecated, please use console object \n"
            + message
            : message);
    } else {
        function indent(str) {
            return str.replace(/^/mg, "    ");
        }
        function makeStructured(obj, depth) {
            var str = "";
            for ( var i in obj) {
                try {
                    if (typeof (obj[i]) == 'object' && depth < maxDepth) {
                        str += i + ":\n" + indent(makeStructured(obj[i]))
                            + "\n";
                    } else {
                        str += i
                            + " = "
                            + indent(String(obj[i])).replace(/^    /,
                                "") + "\n";
                    }
                } catch (e) {
                    str += i + " = EXCEPTION: " + e.message + "\n";
                }
            }
            return str;
        }
        return ((this.isDeprecated ? "WARNING: debug object is deprecated, please use console object\n"
            : "")
            + "Object:\n" + makeStructured(message, maxDepth));
    }
};

OFDebugConsole.prototype.log = function(message, maxDepth) {
    if (OF_ConsoleLog_Flag) {
        if (this.logLevel <= OFDebugConsole.INFO_LEVEL) {
            OF.exec(null,"OFDebugConsole", "log", "OFDebugConsole.log" + String(OFDebugConsole.callbackCnt++), true, [message,'INFO']);
        } else {
            console.log(message);
        }
    }
};

OFDebugConsole.prototype.warn = function(message, maxDepth) {
    if (OF_ConsoleLog_Flag) {
        if (this.logLevel <= OFDebugConsole.WARN_LEVEL) {
            OF.exec(null, "OFDebugConsole", "log", "OFDebugConsole.log" + String(OFDebugConsole.callbackCnt++), true, [message,'WARN']);
        } else {
            console.log(message);
        }
    }
};

OFDebugConsole.prototype.error = function(message, maxDepth) {
    if (OF_ConsoleLog_Flag) {
        if (this.logLevel <= OFDebugConsole.ERROR_LEVEL) {
            OF.exec(null, "OFDebugConsole", "log", "OFDebugConsole.log" + String(OFDebugConsole.callbackCnt++), true, [message,'ERROR']);
        } else {
            console.log(message);
        }
    }
};

if (getUserAgent() != 'else'){
    window.debug   = new OFDebugConsole(true);
    window.console = new OFDebugConsole();
}


OFHistory = {};
/**
 * 웹 화면이동
 * @param params
 * params = {
 *      url : page URL,
 *      parameter : {
 *          전달할 파라미터
 *      },
 *      pageData : {
 *          현재화면 데이터(뒤로 돌아왔을때 입력했던 데이터를 보여주고싶을때 사용)
 *      }
 * }
 * @param singleton
 * @param callerID
 */
OFHistory.go = function( params, singleton, callerID ) {

    if (getUserAgent() != "else") {

        var sendParam = {};
        if (typeof(params) == "number") {
            sendParam.step = params
        }else{
            sendParam = params;
        }

        if (isEmptyValue(callerID)){
            callerID = 0;
        }
        if (isEmptyValue(singleton)){
            singleton = false;
        }
        OF.exec(null, "OFHistory", "go", callerID, singleton, sendParam);
    } else {
        var history = localStorage.getItem("history");
        if (typeof(params) == "number") {
            history = JSON.parse(history);
            history.index += params;
            history.direction = params > 0 ? "forward" : "backward";
            params = history.list[history.index];
        } else {
            if (!history) {
                history = { list : [], index : -1};
            } else {
                history = JSON.parse(history);
            }
            history.direction = "forward";
            history.index++;
            history.list.splice(history.index);
            history.list.push({ url:params.url, parameter : params.parameter } );
        }
        var currentHistory = history.list[history.index - 1];
        if (currentHistory) {
            currentHistory.pageData = params.pageData;
        }
        localStorage.setItem("history", JSON.stringify(history));
        ofMovePage(params);
    }
}


/**
 * param의 historyID의 히스토리를 가져온다.
 * 파라미터가 없으면 현재 웹뷰의 히스토리를 가져온다.
 * @param callback
 * @param params
 *      params = historyID
 * @param singleton
 * @param callerID
 */
OFHistory.list = function (callback, params, singleton, callerID){
    if (getUserAgent() != "else") {
        if (isEmptyValue(callerID)){
            callerID = 0;
        }
        if (isEmptyValue(singleton)){
            singleton = false;
        }
        if(isEmptyValue(params)){
            params = {};
        }
        OF.exec(callback, "OFHistory", "list", callerID, singleton, params);
    } else {
        callback({ resultCode : 0, result : JSON.parse(localStorage.getItem("history"))});
    }
}

/**
 * 전체 히스토리를 반환한다.
 * @param callback
 * @param singleton
 * @param callerID
 */
OFHistory.listAll = function (callback, singleton, callerID){
    if (getUserAgent() != "else") {
        if (isEmptyValue(callerID)){
            callerID = 0;
        }
        if (isEmptyValue(singleton)){
            singleton = false;
        }
        OF.exec(callback, "OFHistory", "listAll", callerID, singleton, {});
    } else {
        callback({ resultCode : 0, result : JSON.parse(localStorage.getItem("history"))});
    }
}

OFToast = {};
/**
 * Toast 로 메세지 창 나타낸다.
 * @param {String} msg 나타날 메세지.
 */
OFToast.show = function(msg, singleton, callerID){
	if(getUserAgent() != "else"){
		 if (isEmptyValue(callerID)){
            callerID = 0;
        }
        if (isEmptyValue(singleton)){
            singleton = false;
        }
        
		OF.exec(null, "OFToast", "show", callerID, singleton, msg);
		
	}else{
		alert("NOT SUPPORTED ON PC BROWSER");
	}
}

OFNavigator = {};
/**
 * 네이티브 화면 이동
 * @param params
 * params = {
 *      historyId   : "히스토리id",
 *      classId     : "activity or ViewController Id",
 *      nativeParameter : {
 *      },
 *      webParameter : {
 *          contents : {},
 *          footer : {}
 *      }
 * }
 * @param singleton
 * @param callerID
 */
OFNavigator.go = function( params, singleton, callerID ) {
    if (getUserAgent() != "else") {
        if (isEmptyValue(callerID)){
            callerID = 0;
        }
        if (isEmptyValue(singleton)){
            singleton = false;
        }
    } else {
        alert("NOT SUPPORTED ON PC BROWSER");
    }

//    var sendParam = {};
//    if (typeof(params) == "number") {
//        sendParam.step = params
//    }else{
        sendParam = params;
//    }
//
//    if(isEmptyValue(sendParam.historyId)){
//        sendParam.historyId = "";
//    }
//    if(isEmptyValue(sendParam.classId)){
//        sendParam.classId = "";
//    }
//    if(isEmptyValue(sendParam.nativeParameter)){
//        sendParam.nativeParameter = {};
//    }
//    if(isEmptyValue(sendParam.webParameter)){
//        sendParam.webParameter = {};
//    }
    OF.exec(null, "OFNavigator", "go", callerID, singleton, sendParam);
}



OFPopup = {};
/**
 * 전체팝업 호출
 * @param params
 * params = {
 *      id:"팝업id",
 *      url:"팝업 full url",
 *      "parameter" : {JSON Object}
 * }
 * @param singleton
 * @param callerID
 */
OFPopup.openPopup = function (params, singleton, callerID){
    if (getUserAgent() != "else") {
        if (isEmptyValue(callerID)){
            callerID = 0;
        }
        if (isEmptyValue(singleton)){
            singleton = false;
        }
        OF.exec(null, "OFPopup", "openPopup", callerID, singleton, params);
    } else {
        alert("NOT SUPPORTED ON PC BROWSER");
    }
}


/**
 * 전체팝업 닫기
 * @param params
 * params = {
 *      id : "팝업id",
 *      callbackTargetID : "callback받을 타겟id",
 *      callbackFunction : "콜백함수명",
 *      callbackParameter : {콜백파라미터 JSON Object}
 * }
 * @param singleton
 * @param callerID
 */
OFPopup.closePopup = function (params, singleton, callerID){
    if (getUserAgent() != "else") {
        if (isEmptyValue(callerID)){
            callerID = 0;
        }
        if (isEmptyValue(singleton)){
            singleton = false;
        }
        if (isEmptyValue(params)){
            params = {};
        }
        OF.exec(null, "OFPopup", "closePopup", callerID, singleton, params);
    } else {
        alert("NOT SUPPORTED ON PC BROWSER");
    }
}


OFStopWatch = {};

/**
 * 스탑워치 시작
 * @param params
 * params = key String(구분값 문자열)
 * @param singleton
 * @param callerID
 */
OFStopWatch.start = function(params, singleton, callerID){

    OF.exec(null, "OFStopWatch", "start", callerID, singleton, params);

}

/**
 * 스탑워치 종료
 * @param params
 * params = key String(구분값 문자열)
 * @param singleton
 * @param callerID
 */
OFStopWatch.stop = function(params, singleton, callerID){

    OF.exec(null, "OFStopWatch", "stop", callerID, singleton, params);

}

/**
 * 종료시간-시작시간 출력
 * @param params
 * params = key String(구분값 문자열)
 * @param singleton
 * @param callerID
 */
OFStopWatch.print = function(params, singleton, callerID){

    OF.exec(null, "OFStopWatch", "print", callerID, singleton, params);

}

/**
 * 시작시간으로부터 현재시간까지 소요시간을 출력
 * @param singleton
 * @param callerID
 */
OFStopWatch.simple = function(singleton, callerID){

    OF.exec(null, "OFStopWatch", "simple", callerID, singleton);

}

/**
 * 시작시간으로부터 현재시간까지 소요시간을 문자열을 포함해서 출력
 * @param params
 * @param singleton
 * @param callerID
 */
OFStopWatch.simpleAddString= function(params, singleton, callerID){

    OF.exec(null, "OFStopWatch", "simpleAddString", callerID, singleton, params);

}

/**
 * 시작시간으로부터 현재시간까지 소요시간을 출력 후 startInterval 초기화
 * @param singleton
 * @param callerID
 */
OFStopWatch.resetToSimple = function(singleton, callerID){

    OF.exec(null, "OFStopWatch", "resetToSimple", callerID, singleton);

}

/**
 * 시작시간으로부터 현재시간까지 소요시간을 문자열을 포함해서 출력 후 startInterval 초기화
 * @param params
 * @param singleton
 * @param callerID
 */
OFStopWatch.resetToSimpleAddString = function(params, singleton, callerID){

    OF.exec(null, "OFStopWatch", "resetToSimpleAddString", callerID, singleton, params);

}

/**
 * startIntverval 초기화
 * @param singleton
 * @param callerID
 */
OFStopWatch.resetInterval= function(singleton, callerID){

    OF.exec(null, "OFStopWatch", "resetInterval", callerID, singleton);

}

/**
 * 모두 출력
 * @param singleton
 * @param callerID
 */
OFStopWatch.printAll = function(singleton, callerID){

    OF.exec(null, "OFStopWatch", "printAll", callerID, singleton);

}

/**
 * 모든 목록을 제거
 * @param singleton
 * @param callerID
 */
OFStopWatch.removeAll = function(singleton, callerID){

    OF.exec(null, "OFStopWatch", "removeAll", callerID, singleton);

}