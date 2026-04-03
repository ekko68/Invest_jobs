var OFPlugin; 
if (!OFPlugin) OFPlugin = {};

OFPlugin.defaultCallback = function(){};

/**
 * native app 의 실행, 검색, 종료기능등을 담는다.
 */
OFPlugin.app = {};

/**
 * 앱 실행시키기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.app.start = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, 'OFAppManager', 'startApp', callerID, singleton, params);
};

/**
 * 앱 설치유무
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.app.search = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, 'OFAppManager', 'searchApp', callerID, singleton, params);
};

/**
 * 앱 종료
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.app.close = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, 'OFAppManager', 'appClose', callerID, singleton, params);
};

/**
 * 웹 실행시키기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.app.startWeb = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, 'OFAppManager', 'startWeb', callerID, singleton, params);
};

/**
 * 전역 데이타를 관리한다.
 */
OFPlugin.global = {};

/**
 * 전역 데이타의 일반 데이타(휘발유성) 관리한다.
 */
OFPlugin.global.variable = {};

/**
 * 전역데이터 저장
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.global.variable.setValue = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFGlobalVariables", "setValue", callerID, singleton, params);
}

/**
 * 전역데이터 관련 값 가져오기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.global.variable.get = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFGlobalVariables", "getValue", callerID, singleton, params);
}

/**
 * 전역데이터 해당 키에 대한 값 가져오기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.global.variable.getValue = function(callback, params, singleton, callerID) {
	var sendParam = {
		"type": "value",
		"params": params
	}

	OFPlugin.global.variable.get(callback, sendParam, singleton, callerID);
}

/**
 * 전역데이터 키 목록 가져오기
 * 
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.global.variable.getKeys = function(callback, singleton, callerID) {
	var sendParam = {
		"type": "key"
	}

	OFPlugin.global.variable.get(callback, sendParam, singleton, callerID);
}

/**
 * 전역데이터 데이타 가져오기
 * 
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.global.variable.getAll = function(callback, singleton, callerID) {
	var sendParam = {
		"type": "all"
	}

	OFPlugin.global.variable.get(callback, sendParam, singleton, callerID);
}

/**
 * 전역데이터 삭제
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.global.variable.remove = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFGlobalVariables", "remove", callerID, singleton, params);
}

/**
 * 전역 데이타의 Preference or KeyChain을 관리한다.
 */
OFPlugin.global.pref = {};

/**
 * Preference or KeyChain 저장
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.global.pref.setValue = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFUserPreference", "setValue", callerID, singleton, params);
}

/**
 * Preference or KeyChain 관련 값 가져오기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.global.pref.get = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFUserPreference", "getValue", callerID, singleton, params);
}

/**
 * Preference or KeyChain 가져오기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.global.pref.getValue = function(callback, params, singleton, callerID) {
	var sendParam = {
		"type": "value",
		"params": params
	}

	OFPlugin.global.pref.get(callback, sendParam, singleton, callerID);
}

/**
 * Preference or KeyChain 키 목록 가져오기
 * 
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.global.pref.getKeys = function(callback, singleton, callerID) {
	var sendParam = {
		"type": "key"
	}

	OFPlugin.global.pref.get(callback, sendParam, singleton, callerID);
}

/**
 * Preference or KeyChain 데이타 가져오기
 * 
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.global.pref.getAll = function(callback, singleton, callerID) {
	var sendParam = {
		"type": "all"
	}

	OFPlugin.global.pref.get(callback, sendParam, singleton, callerID);
}

/**
 * Preference or KeyChain 삭제
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.global.pref.remove = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFUserPreference", "remove", callerID, singleton, params);
}

/**
 * native device 정보들을 관리한다.
 */
OFPlugin.device = {};

/**
 * Get Device Info
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.device.getInfo = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	params = {};

	OF.exec(callback, "OFSystemInfoManager", "getSystemInfo", callerID, singleton, params);
}

/**
 * Clipboard 정보들을 관리한다.
 */
OFPlugin.clipboard = {};

/**
 * 클립보드 데이터 저장하기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.clipboard.setText = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFClipboard", "setText", callerID, singleton, params);
}

/**
 * 클립보드 데이터 가져오기
 * 
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.clipboard.getText = function(callback, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFClipboard", "getText", callerID, singleton, []);
}

/**
 * sms 정보들을 관리한다.
 */
OFPlugin.sms = {};

/**
 * SMS 검색하기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.sms.search = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFSMS", "search", callerID, singleton, params);
}

/**
 * SMS 보내기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.sms.send = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFSMS", "sendSMS", callerID, singleton, params);
}

/**
 * SMS 보내기
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.sms.sendUI = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFSMS", "sendSMSUI", callerID, singleton, params);
}

/**
 * SMS startReceiver
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.sms.startReceiver = function(callback, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFSMS", "startSMSReceiver", callerID, singleton, {});
}

/**
 * SMS stopReceiver
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.sms.stopReceiver = function(callback, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFSMS", "stopSMSReceiver", callerID, singleton, {});
}

OFPlugin.mainurl = {};

OFPlugin.mainurl.modiUrl = function(callback, params, singleton, callerID) {

	if (getUserAgent() != "else") {
		if (isEmptyValue(callerID)) {
			callerID = 0;
		}
		if (isEmptyValue(singleton)) {
			singleton = false;
		}
		OF.exec(callback, "OFUrl", "SetatefaultMainURL", callerID, singleton, params);
	} else {
		alert("NOT SUPPORTED ON PC BROWSER");
	}
}

OFPlugin.mainurl.getDomain = function(callback, params, singleton, callerID) {

	if (getUserAgent() != "else") {

		if (isEmptyValue(callerID)) {
			callerID = 0;
		}
		if (isEmptyValue(singleton)) {
			singleton = false;
		}

		OF.exec(callback, "OFUrl", "GetdefaultDomain", callerID, params);
	} else {
		alert("NOT SUPPORTED ON PC BROWSER");
	}
}

/*
OFPlugin.mainurl.deleteHistory = function(callback, params, singleton, callerID) {
	
	
    if (getUserAgent() != "else") {
	    
        if (isEmptyValue(callerID)){
            callerID = 0;
        }
        if (isEmptyValue(singleton)){
            singleton = false;
        }
        
       
        
        OF.exec(callback, "OFUrl", "DeleteAllHistory", callerID,  params  );
    } else {
        alert("NOT SUPPORTED ON PC BROWSER");
    }
}
*/

/**
 * camera 에 관련된 기능들을 담당한다.
 */
OFPlugin.camera = {};

/**
 * Get Picture
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.camera.getPicture = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFCamera", "getPicture", callerID, singleton, params);
}

/**
 * Get Business Card Info
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.camera.getBusinessCardInfo = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}
	if (isEmptyValue(params)) {
		params = {};
	}

	OF.exec(callback, "OFBusinessCard", "getInfo", callerID, singleton, params);
}

/**
 * 이미지업로드(N)
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.camera.getImages = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFAlbums", "getImages", callerID, singleton, params);
}

/**
 * qrcode 에 관련된 기능들을 담당한다.
 */
OFPlugin.qrcode = {};

OFPlugin.qrcode.scan = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFQrCode", "scan", callerID, singleton, params);
}

/**
 * bcr 에 관련된 기능들을 담당한다.
 */
OFPlugin.bcr = {};

OFPlugin.bcr.scan = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFBcr", "scan", callerID, singleton, params);
}

/**
 * 로그인
 */
OFPlugin.auth = {};

OFPlugin.auth.login = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKLogin", "startBoxLogin", callerID, singleton, params);
}

OFPlugin.auth.onLoaded = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKLogin", "onLoaded", callerID, singleton, params);
}

/**
 * 토큰정보 가져오기
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.auth.getLoaded = function(callback, singleton, callerID, params) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}
	if (isEmptyValue(params)) {
		params = {};
	}
	
	setTimeout(function(){
		OF.exec(callback, "OFIBKLogin", "getLoaded", callerID, singleton, params);
	}, 0);
	
}

/**
 * 로그인페이지 로딩 완료
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.auth.loadCompleted = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}
	if (isEmptyValue(params)) {
		params = {};
	}
	
	OF.exec(callback, "OFIBKLogin", "loadCompleted", callerID, singleton, params);
}


/**
 * refresh 토큰정보 가져오기
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.auth.getRefreshToken = function(callback, singleton, callerID, params) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}
	if (isEmptyValue(params)) {
		params = {};
	}

	OF.exec(callback, "OFIBKLogin", "getRefreshToken", callerID, singleton, params);
}

/**
 * 회원가입 계정등록
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.auth.requestBoxLogin = function(callback, singleton, callerID, params) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}
	if (isEmptyValue(params)) {
		params = {};
	}

	OF.exec(callback, "OFIBKLogin", "requestBoxLogin", callerID, singleton, params);
}

/**
 * 회원가입 완료후 박스앱 메인 호출
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.auth.requestBoxMain = function(callback, singleton, callerID, params) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}
	if (isEmptyValue(params)) {
		params = {};
	}

	OF.exec(callback, "OFIBKLogin", "requestBoxMain", callerID, singleton, params);
}

/**
 * 기업회원인경우 
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.auth.requestCompanyRegistMain = function(callback, singleton, callerID, params) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}
	if (isEmptyValue(params)) {
		params = {};
	}

	OF.exec(callback, "OFIBKLogin", "requestCompanyRegistMain", callerID, singleton, params);
}

/**
 * 정회원 인증후 
 * @param callback
 * @param singleton
 * @param callerID
 */
OFPlugin.auth.startBoxLogout = function(callback, singleton, callerID, params) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}
	if (isEmptyValue(params)) {
		params = {};
	}

	OF.exec(callback, "OFIBKLogin", "startBoxLogout", callerID, singleton, params);
}

/**
 * 공동인증서
 */
OFPlugin.cert = {};

OFPlugin.cert.startCertCenter = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFCertCenter", "startCertCenter", callerID, singleton, {});
}

OFPlugin.cert.getSign = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFCertCenter", "getSign", callerID, singleton, params);
}

OFPlugin.cert.getVIDCheck = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFCertCenter", "getVIDCheck", callerID, singleton, params);
}

OFPlugin.cert.getList = function(callback, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFCertCenter", "getList", callerID, singleton, {});
}

OFPlugin.cert.getData = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFCertCenter", "getData", callerID, singleton, params);
}

OFPlugin.cert.getSignDetached = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFCertCenter", "getSignDetached", callerID, singleton, params);
}

/**
 * 키패드
 */
OFPlugin.keypad = {};

OFPlugin.keypad.getSecPad = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFKeySec", "getSecPad", callerID, singleton, params);
}

/**
 * 네비게이터, 툴바, 전체메뉴호출 유틸리티
 */
OFPlugin.menu = {};

OFPlugin.menu.callNavigator = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKNavigator", "callNavigator", callerID, singleton, params);
}

/**
 * status bar 색상 변경
 * @param callback
 * @param params { "rgb" : "ffffff" }
 * @param singleton
 * @param callerID
 */
OFPlugin.menu.setStatusBarColor = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKNavigator", "setStatusBarColor", callerID, singleton, params);
}

OFPlugin.menu.callGNB = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKNavigator", "callGNB", callerID, singleton, params);
}

OFPlugin.menu.callToolbar = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKToolbar", "callToolbar", callerID, singleton, params);
}

OFPlugin.menu.setToolbar = function(callback, params, singleton, callerID) {
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKToolbar", "setToolbar", callerID, singleton, params);
}

/**
 * util
 */
OFPlugin.util = {};

OFPlugin.util.callCardList = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "callCardList", callerID, singleton, params);
}

/**
 * 비밀번호 변경 화면 호출
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.resetPassword = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "resetPassword", callerID, singleton, params);
}

/**
 * 회원가입 화면 호출
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.joinMember = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "joinMember", callerID, singleton, params);
}

/**
 * 아이디 찾기 화면 호출
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.findId = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "findId", callerID, singleton, params);
}

/**
 * 파일 다운로드
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.fileDownload = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "fileDownload", callerID, singleton, params);
}

/**
 * 휴대폰 본인인증 처리결과 Native에 전달
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.callbackHpAuthorize = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "callbackHpAuthorize", callerID, singleton, params);
}

/**
 * 홈으로 이동 플러그인
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.goPage = function(params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
		params.type = "1";	// 홈
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(OFPlugin.defaultCallback, "OFIBKUtil", "goPage", callerID, singleton, params);
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
OFPlugin.util.download = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(OFPlugin.defaultCallback, "OFDownload", "download", callerID, singleton, params);
}


/**
 * 무소속일 경우 Native 인증 페이지로 이동
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.moveCompanyNumRegVc = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "moveCompanyNumRegVc", callerID, singleton, params);
}


/**
 * 이미지 뷰어
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.imageViewer = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "imageViewer", callerID, singleton, params);
}

/**
 * 주소 검색 닫기 콜백
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.addressPop = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "addressPop", callerID, singleton, params);
}


/**
 * Box WebView를 열수 있는 플러그인 제공 필요 (Box WebView를 닫고 다시 열기)
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.openBoxWeb = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "openBoxWeb", callerID, singleton, params);
}

/**
 * Box WebView를 열수 있는 플러그인 제공 필요 (기본 WebView 열기)
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.openDefaultWeb = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "openDefaultWeb", callerID, singleton, params);
}

/**
 * 사업자 개설 완료 플러그인
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.regCompany = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "regCompany", callerID, singleton, params);
}

/**
 * 파일 업로드 플러그인
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.attachFileUpload = function(callback, params, singleton, callerID) {
	if (isEmptyValue(params)) {
		params = {};
	}
	if (isEmptyValue(callerID)) {
		callerID = 0;
	}
	if (isEmptyValue(singleton)) {
		singleton = false;
	}

	OF.exec(callback, "OFIBKUtil", "attachFileUpload", callerID, singleton, params);
}


OFPlugin.scraping = {};

/**
 * 나이스 스크래핑 [ 사업장 인증, 대출 ] 플러그인
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.scraping.startScraping = function(callback, params, singleton, callerID) {
    if (isEmptyValue(params)) {
        params = {};
    }
    if (isEmptyValue(callerID)) {
        callerID = 0;
    }
    if (isEmptyValue(singleton)) {
        singleton = false;
    }

    OF.exec(callback, "OFScraping", "startScraping", callerID, singleton, params);
}

/**
 * 2020-11-09 예비창업자추가에 따른 나이스 스크래핑 추가
 * 나이스 스크래핑 [ 사업장 인증, 대출 ] 플러그인[]
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.scraping.bizStartScraping = function(callback, params, singleton, callerID) {
    if (isEmptyValue(params)) {
        params = {};
    }
    if (isEmptyValue(callerID)) {
        callerID = 0;
    }
    if (isEmptyValue(singleton)) {
        singleton = false;
    }
									  		 
    OF.exec(callback, "OFScraping", "bizStartScraping", callerID, singleton, params);
}

/**
 * 2020-12-11 예비창업자추가에 따른 사업장등록 플러그인 변경 (asis - moveCompanyNumRegVc)
 * 
 * @param callback
 * @param params
 * @param singleton
 * @param callerID
 */
OFPlugin.util.copRegNumVc = function(callback, params, singleton, callerID) {
    if (isEmptyValue(params)) {
        params = {};
    }
    if (isEmptyValue(callerID)) {
        callerID = 0;
    }
    if (isEmptyValue(singleton)) {
        singleton = false;
    }
	
    OF.exec(callback, "OFIBKUtil", "copRegNumVc", callerID, singleton, params);
}