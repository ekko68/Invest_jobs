var DSPlugin; 
if (!DSPlugin) DSPlugin = {};

DSPlugin.defaultCallback = function(){};

/**
 * native app 의 실행, 검색, 종료기능등을 담는다.
 */
DSPlugin.app = {};

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

var DS = {
    
    log : function(){
        try{
            throw Error('');
        }catch(err){
            var args = [];
            for(var i = 0; i < arguments.length; i++){
                args.push(arguments[i]);
            }
        }
    }
    , exec : function (v) {
        try {

            var index = 0;

            var cb = arguments[index++];
            if (typeof cb === "function"){
				
				cb = cb.name;
			}
			
            var info = {
                callback  : cb,
                extension : arguments[index++],
                method	  : arguments[index++]
            };

            var params = [];
            for (var i = index; i < arguments.length ; i++) {
                params.push(arguments[i]);
            }
			
            info["params"] = params;
            
            var json = JSON.stringify(info);
			
            DS.execute_run(json, v);
        } catch (e) {
            var args = [];

            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            
            DS.log("execute : " + args + " = " + e);
        }

    }

    , execute_run : function(ofa_json, callback){
//        this.log(ofa_json);
//        var status = this.exeStatus;
		
		var data = JSON.parse(ofa_json);
		
		var result = dsBridge.call(data.extension, data.params[0], callback);
		
//		callback(result);
		
    } 
};

/**
 * 앱 실행시키기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.app.start = function(callback, params) {
	DS.exec(callback, 'OFAppManager', 'startApp', params);
};

/**
 * 앱 설치유무
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.app.search = function(callback, params) {
	DS.exec(callback, 'OFAppManager', 'searchApp', params);
};

/**
 * 앱 종료
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.app.close = function(callback, params) {
	DS.exec(callback, 'OFAppManager', 'appClose', params);
};

/**
 * 웹 실행시키기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.app.startWeb = function(callback, params) {
	DS.exec(callback, 'OFAppManager', 'startWeb', params);
};

/**
 * 전역 데이타를 관리한다.
 */
DSPlugin.global = {};

/**
 * 전역 데이타의 일반 데이타(휘발유성) 관리한다.
 */
DSPlugin.global.variable = {};

/**
 * 전역데이터 저장
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.global.variable.setValue = function(callback, params) {
	DS.exec(callback, "POSGlobalVariables", "setValue", params);
}

/**
 * 전역데이터 관련 값 가져오기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.global.variable.get = function(callback, params) {
	DS.exec(callback, "POSGlobalVariables", "getValue", params);
}

/**
 * 전역데이터 해당 키에 대한 값 가져오기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.global.variable.getValue = function(callback, params) {
	var sendParam = {
		"type": "value",
		"params": params
	}

	DSPlugin.global.variable.get(callback, sendParam);
}

/**
 * 전역데이터 키 목록 가져오기
 * 
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.global.variable.getKeys = function(callback) {
	var sendParam = {
		"type": "key"
	}

	DSPlugin.global.variable.get(callback, sendParam);
}

/**
 * 전역데이터 데이타 가져오기
 * 
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.global.variable.getAll = function(callback) {
	var sendParam = {
		"type": "all"
	}

	DSPlugin.global.variable.get(callback, sendParam);
}

/**
 * 전역데이터 삭제
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.global.variable.remove = function(callback, params) {
	DS.exec(callback, "POSGlobalVariables", "remove", params);
}

/**
 * 전역 데이타의 Preference or KeyChain을 관리한다.
 */
DSPlugin.global.pref = {};

/**
 * Preference or KeyChain 저장
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.global.pref.setValue = function(callback, params) {
	DS.exec(callback, "POSUserPreference", "setValue", params);
}

/**
 * Preference or KeyChain 관련 값 가져오기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.global.pref.get = function(callback, params) {
	DS.exec(callback, "POSUserPreference", "getValue", params);
}

/**
 * Preference or KeyChain 가져오기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.global.pref.getValue = function(callback, params) {
	var sendParam = {
		"type": "value",
		"params": params
	}

	DSPlugin.global.pref.get(callback, sendParam);
}

/**
 * Preference or KeyChain 키 목록 가져오기
 * 
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.global.pref.getKeys = function(callback) {
	var sendParam = {
		"type": "key"
	}

	DSPlugin.global.pref.get(callback, sendParam);
}

/**
 * Preference or KeyChain 데이타 가져오기
 * 
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.global.pref.getAll = function(callback) {
	var sendParam = {
		"type": "all"
	}

	DSPlugin.global.pref.get(callback, sendParam);
}

/**
 * Preference or KeyChain 삭제
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.global.pref.remove = function(callback, params) {
	DS.exec(callback, "POSUserPreference", "remove", params);
}

/**
 * native device 정보들을 관리한다.
 */
DSPlugin.device = {};

/**
 * Get Device Info
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.device.getInfo = function(callback, params) {
	if (isEmptyValue(singleton)) {
		params = {};
	}
	
	DS.exec(callback, "POSSystemInfoManager", "getSystemInfo", params);
}

/**
 * Clipboard 정보들을 관리한다.
 */
DSPlugin.clipboard = {};

/**
 * 클립보드 데이터 저장하기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.clipboard.setText = function(callback, params) {
	DS.exec(callback, "POSClipboard", "setText", params);
}

/**
 * 클립보드 데이터 가져오기
 * 
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.clipboard.getText = function(callback) {
	DS.exec(callback, "POSClipboard", "getText", []);
}

/**
 * sms 정보들을 관리한다.
 */
DSPlugin.sms = {};

/**
 * SMS 검색하기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.sms.search = function(callback, params) {
	DS.exec(callback, "POSSMS", "search", params);
}

/**
 * SMS 보내기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.sms.send = function(callback, params) {
	DS.exec(callback, "POSSMS", "sendSMS", params);
}

/**
 * SMS 보내기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.sms.sendUI = function(callback, params) {
	DS.exec(callback, "POSSMS", "sendSMSUI", params);
}

/**
 * SMS startReceiver
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.sms.startReceiver = function(callback) {
	DS.exec(callback, "POSSMS", "startSMSReceiver", {});
}

/**
 * SMS stopReceiver
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.sms.stopReceiver = function(callback) {
	DS.exec(callback, "POSSMS", "stopSMSReceiver", {});
}

DSPlugin.mainurl = {};

DSPlugin.mainurl.modiUrl = function(callback, params) {

	if (getUserAgent() != "else") {
		DS.exec(callback, "POSUrl", "SetatefaultMainURL", params);
	} else {
		alert("NOT SUPPORTED ON PC BROWSER");
	}
}

DSPlugin.mainurl.getDomain = function(callback, params) {

	if (getUserAgent() != "else") {
		DS.exec(callback, "POSUrl", "GetdefaultDomain", callerID, params);
	} else {
		alert("NOT SUPPORTED ON PC BROWSER");
	}
}

/*
DSPlugin.mainurl.deleteHistory = function(callback, params) {
	
	
    if (getUserAgent() != "else") {
	    
        if (isEmptyValue(callerID)){
            callerID = 0;
        }
        if (isEmptyValue(singleton)){
            singleton = false;
        }
        
       
        
        DS.exec(callback, "POSUrl", "DeleteAllHistory", callerID,  params  );
    } else {
        alert("NOT SUPPORTED ON PC BROWSER");
    }
}
*/

/**
 * camera 에 관련된 기능들을 담당한다.
 */
DSPlugin.camera = {};

/**
 * Get Picture
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.camera.getPicture = function(callback, params) {
	DS.exec(callback, "POSCamera", "getPicture", params);
}

/**
 * Get Business Card Info
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.camera.getBusinessCardInfo = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSBusinessCard", "getInfo", params);
}

/**
 * 이미지업로드(N)
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.camera.getImages = function(callback, params) {
	DS.exec(callback, "POSAlbums", "getImages", params);
}

/**
 * qrcode 에 관련된 기능들을 담당한다.
 */
DSPlugin.qrcode = {};

DSPlugin.qrcode.scan = function(callback, params) {
	DS.exec(callback, "POSQrCode", "scan", params);
}

/**
 * bcr 에 관련된 기능들을 담당한다.
 */
DSPlugin.bcr = {};

DSPlugin.bcr.scan = function(callback, params) {
	DS.exec(callback, "POSBcr", "scan", params);
}

/**
 * 로그인
 */
DSPlugin.auth = {};

DSPlugin.auth.login = function(callback, params) {
	DS.exec(callback, "POSIBKLogin", "startBoxLogin", params);
}

DSPlugin.auth.onLoaded = function(callback, params, method) {
	var methodNm = "POSIBKLogin";
	if(!isEmptyValue(method)){
		methodNm = method;
	}
	DS.exec(callback, methodNm, "onLoaded", params);
}


/**
 * refresh 토큰정보 가져오기
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.auth.getRefreshToken = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKLogin", "getRefreshToken", params);
}

/**
 * 회원가입 계정등록
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.auth.requestBoxLogin = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKLogin", "requestBoxLogin", params);
}

/**
 * 회원가입 완료후 박스앱 메인 호출
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.auth.requestBoxMain = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKLogin", "requestBoxMain", params);
}

/**
 * 기업회원인경우 
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.auth.requestCompanyRegistMain = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKLogin", "requestCompanyRegistMain", params);
}

/**
 * 정회원 인증후 
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.auth.startBoxLogout = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKLogin", "startBoxLogout", params);
}

/**
 * NFC 서류제출 개인회원가입 결과
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.auth.requestMemberDocument  = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKLogin", "requestMemberDocument ", params);
}

/**
 * 서류제출 무소속 스크래핑 요청결과
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.auth.requestCompanyRegistDocument   = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKLogin", "requestCompanyRegistDocument  ", params);
}

/**
 * 기업인터넷뱅킹 전자서명 nonce값 전달
 * @param {any} callback
 * @param {any} params
 * @param {any} singleton
 * @param {String} callerID
 */
DSPlugin.auth.cert = function(callback, params) {

	DS.exec(callback, "POSIBKLogin", "cert", params);
}

/**
 * 기업인터넷뱅킹 서명데이터 토큰 전달
 * @param {any} callback
 * @param {any} params
 * @param {any} singleton
 * @param {String} callerID
 */
DSPlugin.auth.certToken = function(callback, params) {

	DS.exec(callback, "POSIBKLogin", "certToken", params);
}

/**
 * 기업인터넷뱅킹 box가입 체크
 * @param {any} callback
 * @param {any} params
 * @param {any} singleton
 * @param {String} callerID
 */
DSPlugin.auth.certLoginChk = function(callback, params) {

	DS.exec(callback, "POSIBKLogin", "certLoginChk", params);
}


DSPlugin.auth.mobsso = function(callback, params, proc) {
	if (isEmptyValue(proc)) {
		DS.exec(callback, "POSIBKLogin", proc, params);
	}else{
		DS.exec(callback, proc, proc, params);
	}
}


/**
 * 공인인증서
 */
DSPlugin.cert = {};

DSPlugin.cert.startCertCenter = function(callback, params) {

	DS.exec(callback, "POSCertCenter", "startCertCenter", {});
}

DSPlugin.cert.getSign = function(callback, params) {

	DS.exec(callback, "POSCertCenter", "getSign", params);
}

DSPlugin.cert.getVIDCheck = function(callback, params) {

	DS.exec(callback, "POSCertCenter", "getVIDCheck", params);
}

DSPlugin.cert.getList = function(callback) {

	DS.exec(callback, "POSCertCenter", "getList", {});
}

DSPlugin.cert.getData = function(callback, params) {

	DS.exec(callback, "POSCertCenter", "getData", params);
}

DSPlugin.cert.getSignDetached = function(callback, params) {

	DS.exec(callback, "POSCertCenter", "getSignDetached", params);
}

/**
 * 키패드
 */
DSPlugin.keypad = {};

DSPlugin.keypad.getSecPad = function(callback, params) {

	DS.exec(callback, "POSKeySec", "getSecPad", params);
}

/**
 * 네비게이터, 툴바, 전체메뉴호출 유틸리티
 */
DSPlugin.menu = {};

DSPlugin.menu.callNavigator = function(callback, params) {

	DS.exec(callback, "POSIBKNavigator", "callNavigator", params);
}

/**
 * status bar 색상 변경
 * @param callback
 * @param params { "rgb" : "ffffff" }
 * @param singleton
 * @param callerID
 */
DSPlugin.menu.setStatusBarColor = function(callback, params) {

	DS.exec(callback, "POSIBKNavigator", "setStatusBarColor", params);
}

DSPlugin.menu.callGNB = function(callback, params) {

	DS.exec(callback, "POSIBKNavigator", "callGNB", params);
}

DSPlugin.menu.callToolbar = function(callback, params) {

	DS.exec(callback, "POSIBKToolbar", "callToolbar", params);
}

DSPlugin.menu.setToolbar = function(callback, params) {

	DS.exec(callback, "POSIBKToolbar", "setToolbar", params);
}

/**
 * util
 */
DSPlugin.util = {};

DSPlugin.util.callCardList = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "callCardList", params);
}

/**
 * 비밀번호 변경 화면 호출
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.resetPassword = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "resetPassword", params);
}

/**
 * 회원가입 화면 호출
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.joinMember = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "joinMember", params);
}

/**
 * 아이디 찾기 화면 호출
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.findId = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "findId", params);
}

/**
 * 파일 다운로드
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.fileDownload = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "fileDownload", params);
}

/**
 * 휴대폰 본인인증 처리결과 Native에 전달
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.callbackHpAuthorize = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "callbackHpAuthorize", params);
}

/**
 * 홈으로 이동 플러그인
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.goPage = function(params) {
	if (isEmptyValue(params)) {
		params = {};
		params.type = "1";	// 홈
	}

	DS.exec(DSPlugin.defaultCallback, "POSIBKUtil", "goPage", params);
}

/**
 * 파일다운로드
 * @param callback
 * @param params
 * {
 *		url : 다운url
 *      file_name : 파일명
 * }
 * @param singleton
 * @param callerID
 */
DSPlugin.util.download = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(DSPlugin.defaultCallback, "POSDownload", "download", params);
}


/**
 * 무소속일 경우 Native 인증 페이지로 이동
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.moveCompanyNumRegVc = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "moveCompanyNumRegVc", params);
}


/**
 * 이미지 뷰어
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.imageViewer = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "imageViewer", params);
}

/**
 * 주소 검색 닫기 콜백
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.addressPop = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "addressPop", params);
}


/**
 * Box WebView를 열수 있는 플러그인 제공 필요 (Box WebView를 닫고 다시 열기)
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.openBoxWeb = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "openBoxWeb", params);
}

/**
 * Box WebView를 열수 있는 플러그인 제공 필요 (기본 WebView 열기)
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.openDefaultWeb = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "openDefaultWeb", params);
}

/**
 * 사업자 개설 완료 플러그인
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.regCompany = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "regCompany", params);
}

/**
 * 파일 업로드 플러그인
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.util.attachFileUpload = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}

	DS.exec(callback, "POSIBKUtil", "attachFileUpload", params);
}


DSPlugin.scraping = {};

/**
 * 나이스 스크래핑 [ 사업장 인증, 대출 ] 플러그인
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
DSPlugin.scraping.startScraping = function(callback, params) {
    if (isEmptyValue(params)) {
        params = {};
    }

    DS.exec(callback, "POSScraping", "startScraping", params);
}

/**
 * 로그인페이지 로딩 완료
 * @param callback
 * @param singleton
 * @param callerID
 */
DSPlugin.auth.loadCompleted = function(callback, params) {
	if (isEmptyValue(params)) {
		params = {};
	}
	DS.exec(callback, "pageLoadCompleted", "loadCompleted", params);
}



// ---------------------------------------------------------------------- 대출 2.0 사용 ------------------------------------------------------------

DSPlugin.loan = {};

/**
 * 토큰정보 가져오기
 * @param {function} cb
 * @param {object} params
 */
DSPlugin.loan.getLrbToken = function(cb, params){
	if (isEmptyValue(params)) {
		params = {};
	}
	
	DS.exec(cb, "getLrbToken", false, params);
}


/**
 * OCR 촬용
 * @param {function} cb
 * @param {object} params
 */
DSPlugin.loan.startOcrCapture = function(cb, params){
	if (isEmptyValue(params)) {
		params = {};
	}
	
	DS.exec(cb, "startOcrCapture", false, params);
}


/**
 * OCR 촬용 업로드
 * @param {function} cb
 * @param {object} params
 */
DSPlugin.loan.uploadDoc = function(cb, params){
	if (isEmptyValue(params)) {
		params = {};
	}
	
	DS.exec(cb, "uploadDoc", false, params);
}


/**
 * 스크래핑 인증서 요청
 * @param {function} cb
 * @param {object} params
 */
DSPlugin.loan.getCertScraping = function(cb, params){
	if (isEmptyValue(params)) {
		params = {};
	}
	
	DS.exec(cb, "getCertScraping", false, params);
}

/**
 * 전자서명 요청(pdf서명)
 * @param {function} cb
 * @param {object} params
 */
DSPlugin.loan.getSignDetached = function(cb, params){
	if (isEmptyValue(params)) {
		params = {};
	}
	
	DS.exec(cb, "getSignDetached", false, params);
}


/**
 * 전자서명 로그인(일반서명)
 * @param {function} cb
 * @param {object} params
 */
DSPlugin.loan.getSign = function(cb, params){
	if (isEmptyValue(params)) {
		params = {};
	}
	
	DS.exec(cb, "getSign", false, params);
}


/**
 * 나이스 스크래핑 요청
 * @param {function} cb
 * @param {object} params
 */
DSPlugin.loan.startNiceScraping = function(cb, params){
	if (isEmptyValue(params)) {
		params = {};
	}
	
	DS.exec(cb, "startNiceScraping", false, params);
}


/**
 * 웹뷰 닫기
 * @param {function} cb
 * @param {object} params
 */
DSPlugin.loan.closeWebView = function(cb, params){
	if (isEmptyValue(params)) {
		params = {};
	}
	
	DS.exec(cb, "closeWebView", false, params);
}


/**
 * 모바일 키보드 보안 모듈 호출
 * @param {function} cb
 * @param {object} params
 */
DSPlugin.loan.getSecPad = function(cb, params){
	if (isEmptyValue(params)) {
		params = {};
	}
	
	DS.exec(cb, "getSecPad", false, params);
}