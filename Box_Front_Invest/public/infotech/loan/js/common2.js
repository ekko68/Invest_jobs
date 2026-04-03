
function comboAcntList(obj, callback){
	$.ajax({
		type:"POST",
		contentType : "application/json",
		url 		: "/LOAN404/selectCusDepAcntCtlgInq",
		data        : JSON.stringify({}),
		dataType 	: "json",
		async		: false,
		success 	: function(data) {
			
			console.log("selectCusDepAcntCtlgInq ", data);
			
			// 계좌목록 출력
			for(var i = 0; i< data.dsCusDepAcntCtlgInqList.length;i++){
				
				var cusOtptInfrPdm = data.dsCusDepAcntCtlgInqList[i].cusOtptInfrPdm;
				var cusAcn = cusAcnFormatter(data.dsCusDepAcntCtlgInqList[i].cusAcn);
				var li = "<li><a onclick='changeAcnt("+i+")'>" +cusOtptInfrPdm+" "+cusAcn+"</li>"
				
				// 계좌 combo object에 셋팅
				obj.append(li);
			}
			
			//callback함수로 default 선택값 지정
			callback(data, 0);
		},
		error       : function(data, error) {
			console.log(data);
			alert(data);
		}
	});
}

function cusAcnFormatter(cusAcn){
	
	if(cusAcn.length == 16){
		cusAcn = cusAcn.replace(/(\d{3})(\d{6})(\d{2})(\d{5})/,"$1-$2-$3-$4");
	} else if(cusAcn.length == 14){
		cusAcn = cusAcn.replace(/(\d{3})(\d{6})(\d{2})(\d{3})/,"$1-$2-$3-$4");
	} else if(cusAcn.length == 11){
		cusAcn = cusAcn.replace(/(\d{3})(\d{4})(\d{4})/,"$1-$2-$3");
	}
	
	return cusAcn;
}

function onPwdKeyDown(e){

	if(e.keyCode >= 48 && e.keyCode <=57 || e.keyCode == 8){
		return true;
	}else{
		e.returnValue = false;
	}
}

function dateFormatter(date){
	
	if(date.length == 8){
		date = date.replace(/(\d{4})(\d{2})(\d{2})/,"$1.$2.$3");
	}
	
	return date;
}


function moveToAccountPage(){
	location.href="/loan/LB1003_1M"
}

function wonToHan(strWon) {

    var strHan = "";

    if (strWon == "" || strWon == "0")
        return "영원";

    var len = strWon.length;
    if (len == 0)
        return "영원";

    strWon = transMoney(strWon); // 콤마 제거

    var arrNum = new Array("", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"); // 숫자
    var arrSmallUnit = new Array("", "십", "백", "천"); // 작은단위
    var arrBigUnit = new Array("", "만", "억", "조", "경", "해", "자", "양", "구", "간",
        "정", "재", "극"); // 큰단위

    var strLen = strWon.length;
    var smallUnit, bigUnit;
    var nowNum, nowUnit; // 현재숫자, 현재 단위

    var i;
    var num = "";
    var nowHan = "";
    for (i = 0; i < strLen; i++) {

        nowNum = strWon.substring(i, i + 1);
        nowUnit = strLen - i;

        smallUnit = parseInt((nowUnit - 1) % 4, 10);
        bigUnit = parseInt((nowUnit - 1) / 4, 10);

        strHan += arrNum[parseInt(nowNum, 10)]; // 숫자

        if (nowNum != "0") {
            strHan += arrSmallUnit[smallUnit]; // 작은단위
        }

        if ((nowUnit - 1) % 4 == 0) {
            num += nowNum;
            if (parseInt(num, 10) > 0) {
                strHan += arrBigUnit[bigUnit]; // 큰단위는 값이 존재할때 삽입한다.
            }
            num = "";
        } else {
            num += nowNum;
        }
    }

    strHan = strHan + "원";

    return strHan;
};

function wonToHanUnit(strWon) {

    var strHan = "";

    if (strWon == "" || strWon == "0")
        return "0원";

    var len = strWon.length;
    if (len == 0)
        return "0원";

    strWon = transMoney(strWon); // 콤마 제거

    if(Number(strWon) == 0){
        return "0원";
    }

    var arrBigUnit = new Array("", "만", "억", "조", "경", "해", "자", "양", "구", "간", "정", "재", "극"); // 큰단위

    var nWonLen = strWon.length;
    var aWonfour = [];
    var nCnt = 0;

    if(nWonLen > 4){

        var iModWonLen = parseInt(nWonLen % 4 ,10);

        var iModWonLen2 = parseInt(nWonLen / 4 ,10);


        var sRemoveWon = strWon;
        for(var i=1; i<iModWonLen2+1; i++){
            var nRemoveWonLen = sRemoveWon.length;
            var sFourWon = sRemoveWon.substr(nRemoveWonLen - 4 ,nRemoveWonLen);
            sRemoveWon = sRemoveWon.substr(0,nRemoveWonLen - 4);
            aWonfour[nCnt] = sFourWon;
            nCnt++;
        }

        if(iModWonLen > 0){
            aWonfour[nCnt] = strWon.substr(0,iModWonLen);
        }
    }else{
        aWonfour[nCnt] = strWon;
    }

    var sTotalWonAmt = "";
    if(aWonfour.length > 1){
        for(var i=0; i<aWonfour.length; i++){
            var sFourModWon = String(Number(aWonfour[i]));

            if(sFourModWon.length > 3){
                sFourModWon = sFourModWon.substr(0,1) +","+ sFourModWon.substr(1,4);
            }

            if(i<1){
                if(Number(aWonfour[i]) > 0){
                    sTotalWonAmt += sFourModWon;
                }
                //alert("sTotalWonAmt0>>>>>>>"+sTotalWonAmt);
            }else{
                if(Number(aWonfour[i]) > 0){
                    if(isNull(sTotalWonAmt)){
                        sTotalWonAmt = sFourModWon + arrBigUnit[i];
                    }else{
                        sTotalWonAmt = sFourModWon + arrBigUnit[i] +" "+ sTotalWonAmt;
                    }

                }
            }
        }
    }else{
        var sFourModWon = String(Number(aWonfour[0]));

        if(sFourModWon.length > 3){
            sFourModWon = sFourModWon.substr(0,1) +","+ sFourModWon.substr(1,4);
        }

        sTotalWonAmt += sFourModWon;
    }


    sTotalWonAmt += "원";


    return sTotalWonAmt;

    //alert("sTotalWonAmtEnd>>>>>>>"+sTotalWonAmt);
};


function transMoney(strMoney) {

    var money;
    if (strMoney == "") {
        money = "0";
    } else {
        money = replaceAll(strMoney, ",", "");
    }

    return money;
};


function replaceAll(target, from, to) {
        return target.split(from).join(to);
};

function isNull(value) {
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
};

function errorDialog(data, msg){
	if ( data.responseJSON != undefined ){
	
		var msgCd = data.responseJSON.msgCd;
		var message = data.responseJSON.MESSAGE;
		
		console.log("data.responseJSON.msgCd",msgCd);
		console.log("data.responseJSON.MESSAGE", message);
		
		if( !isNull(msgCd) || !isNull(message)){
			alert( isNull(msgCd)?message:msgCd );
		}else{
			alert(msg);
		}
	
	}else{
		alert(msg);
	}
	
}

function numberMaxLength(obj){
	if(obj.value.length > obj.maxLength){
		obj.value = obj.value.slice(0, obj.maxLength);
	}
}
	
function moveToAgree(div, seq){
	location.href = "/loan/LB1900_1M?&dcffStplId="+div+"&dcffStplDtlSqn="+seq;
}

function doLpad(psVal, pnWidth) {
	psVal = psVal + '';
	
	return psVal.length >= pnWidth ? psVal : 0 + psVal;
};

function moveToPageByJsonPost(url, jsonParamStr){
	var f = document.createElement("form");
	
	document.body.appendChild(f);
	
	f.action = url;
	f.method = "post";
	
	var input = document.createElement("input");
	input.setAttribute("type","hidden");
	input.setAttribute("name","jsonParam");
	input.setAttribute("value",encodeURI(jsonParamStr));
	
	f.appendChild(input);
	f.submit();
	
}

function getJsonParam(paramDataStr){

	var url_info = window.location;
	
	var cur_url = url_info.href;
	
	if( cur_url != '' ){
		cur_url = cur_url.substring(cur_url.lastIndexOf('/'));
	}
	
	if( isNull(paramDataStr) ){
	
		alert('잘못된 접근입니다.');
		moveToAccountPage();
	}else{

		var paramData = JSON.parse(decodeURI(paramDataStr));
		
		// 테스트 시작-----------------------------------
		/*if( cur_url.indexOf("LB1403_1M") != -1 ){
			
			// 테스트 LB1403_1M 에 존재하는 데이터로 셋팅
			var paramDataTest = JSON.parse('{"cusAcn":"0980887813200032"}');
			Object.assign(paramData, paramDataTest);
		}else if( cur_url.indexOf("LB1401_2M") != -1 ){
			
			// 테스트- LB1401_1M 오류발생 0000 아님
			var obj = new Object();
           	obj.icn = '111111111111';
           	obj.loanAcn = '1234567890123456';
           	obj.drotIcn = '111111111111';
           	obj.drotAcn = '1234567890123456';
           	obj.ttalAmt = '1234567890';
           	obj.ttalAmt = '1234567890';
           	obj.intAmt = '234567890';
           	obj.prncAmt = '1234567890';
           	obj.dpsrNm = '1234567890';
           	obj.nextItpmYmd = '20220709';
           	obj.aftrBal = '234567890';
           	obj.rpitAmt = '234567890';
           	obj.odinAmt = '1234567890';
           	obj.agrmInt = '34567890';
           	obj.aftrLoanBal = '34567890';
           	obj.attrAcn = '1234567890123456';
           	obj.tlacAbnmNm = '중소기업자금대출';
           	obj.prwyKcd = '01';
           	
           	Object.assign(paramData, obj);
		}else if( cur_url.indexOf("LB1402_2M") != -1 ){
			
			// 테스트- LB1401_1M 오류발생 0000 아님
			var obj = new Object();
           	obj.loanAcn = '0740303983200615';
           	obj.drotAcn = '07403039801021';
           	obj.drotAmt = '1000000';
           	obj.rpmnAmt = '1000000';
           	
			obj.hlrpFee = '1000000';
			obj.loirAmt = '1000000';
			obj.rpafBal = '1000000';
			obj.rpmtInt = '1000000';
           	
           	obj.prwyKcd = '01';
           	obj.piaRcmpYn = 'Y';
           	//obj.hid_key_data = '7792d3a9a70d4be7602f6f3eadc31eb17e2de93e9fd6be8c792e1455ebf2d557e7dcdd5896340df519568e2a0b7e23fde7f21dea9c520208138bdc59d12903530567174cebacbe03df66a66e3c4f9715af6adb273d379fad48ba991e65381fe5e257e0780639242a581dfaaee25e1415fb2eb1957bd102ee817163b5709055a2e6feb62bedb71f8f101d9f3cb41102bc008f25b1b44dd4c0c150e996166dd7937a604874469123122bae220e361231be7e781bd060ae1d4f3d1962c3b7ff629e3f4bb2bea1b89ddf08485f7efe1d654d394b6690140a710df9d47f7be2de07bf60304fd6117b6a09a167e5e821e23bbbad507dcf0549ec0db7759aa8b82bf43c';
           	//obj.E2E_pwd = '6d3aeab008e8edfd9322d14674afce77db8eaa00021345116e1d4f0929ca5df859c8c4653aacf22b737263eab53cb4d52955dc81dc9b5b9ff1585f75b91880aa';
           	
           	Object.assign(paramData, obj);
		}else if( cur_url.indexOf("LB1402_6M") != -1 ){
			
			var obj = new Object();
           	obj.loanAcn = '0740303983200615';
		    obj.rpmnAmt = '1000000';
		    obj.drotAmt = '1000000';
		    obj.hlrpFee = '1000000';
			obj.prwyKcd = '01';
			obj.tlacAbnmNm = '중소기업자금대출';
			obj.drotAcn = '07403039801021';
           	
           	Object.assign(paramData, obj);
		}else if( cur_url.indexOf("LB1404_2M") != -1 ){
			
			var obj = new Object();
           	
            obj.trnYmd = "20210813";
            obj.trnDcd = "1";
            obj.pdm = "BOX개인사업자신용대출";
            obj.acn = "4950399423200031";
            obj.arrAmt = "15000000.000";
            obj.newYmd = "20190905";
            obj.expiYmd = "20210903";
            obj.larvAgrmIrt = "4.0710000";
            obj.mngmBrm = "정관";
            obj.dbtoDcd = "3";
            obj.bprIdxNo = "0120500495SYSTEM2021080600282344";
            //obj.edpsCsn = "40689196";
            obj.icn = "049500000161576";
            obj.mngmBrcd = "0495";
            obj.elcrDdcnMngmNo = "202108130000434";
            
           	Object.assign(paramData, obj);
		}else if( cur_url.indexOf("LB1403_2M") != -1 ){
			
			var obj = new Object();
           	
            obj.trnYmd = "20210813";
            obj.trnDcd = "1";
            obj.pdm = "BOX개인사업자신용대출";
            obj.acn = "4950399423200031";
            obj.arrAmt = "35000000.000";
            obj.tlbzBal = "15000000.000";
            obj.newYmd = "20190905";
            obj.expiYmd = "20210903";
            obj.larvAgrmIrt = "4.0710000";
            obj.mngmBrm = "정관";
            obj.dbtoDcd = "3";
            obj.bprIdxNo = "0120500495SYSTEM2021080600282344";
            //obj.edpsCsn = "40689196";
            obj.icn = "049500000161576";
            obj.mngmBrcd = "0495";
            obj.itpmSpcfDd = "1";
            obj.elcrDdcnMngmNo = "202108130000434";
            
           	Object.assign(paramData, obj);
		}else if( cur_url.indexOf("LB1403_3M") != -1 ){
			
			var obj = new Object();
           	
            obj.trnYmd = "20210813";
            obj.trnDcd = "1";
            obj.pdm = "BOX개인사업자신용대출";
            obj.acn = "4950399423200031";
            obj.arrAmt = "35000000.000";
            obj.tlbzBal = "15000000.000";
            obj.newYmd = "20190905";
            obj.expiYmd = "20210903";
            obj.larvAgrmIrt = "4.0710000";
            obj.mngmBrm = "정관";
            obj.dbtoDcd = "3";
            obj.bprIdxNo = "0120500495SYSTEM2021080600282344";
            //obj.edpsCsn = "40689196";
            obj.icn = "049500000161576";
            obj.mngmBrcd = "0495";
            obj.itpmSpcfDd = "1";
            obj.elcrDdcnMngmNo = "202108130000434";
            obj.plrpYn = 'Y'
            
           	Object.assign(paramData, obj);
		}else if( cur_url.indexOf("LB1403_7M") != -1 ){
			
			var obj = new Object();
           	
            obj.trnYmd = "20210813";
            obj.trnDcd = "1";
            obj.pdm = "BOX개인사업자신용대출";
            obj.acn = "4950399423200031";
            obj.arrAmt = "35000000.000";
            obj.tlbzBal = "15000000.000";
            obj.newYmd = "20190905";
            obj.expiYmd = "20210903";
            obj.larvAgrmIrt = "4.0710000";
    		obj.mngmBrcd = "0522";
    		obj.apinKcdNm = "기간별시장금리";
            obj.mngmBrm = "정관";
            obj.dbtoDcd = "3";
            obj.bprIdxNo = "0120500495SYSTEM2021080600282344";
            //obj.edpsCsn = "40689196";
            obj.icn = "049500000161576";
            obj.mngmBrcd = "0495";
            obj.itpmSpcfDd = "1";
            obj.elcrDdcnMngmNo = "202108130000434";
            obj.lonDdcnHashList = [
            	{lonDdcnKcd : "8001",
				lonDdcnHashVl : "4b189449e99a127b4064059fb860b89fa1308ff56f9463dd14e118a157c76d14",
				lonDdcnElsgVl :""},
				{lonDdcnKcd : "8002",
				lonDdcnHashVl : "4b189449e99a127b4064059fb860b89fa1308ff56f9463dd14e118a157c76d13",
				lonDdcnElsgVl :""}
            ]
            
           	Object.assign(paramData, obj);
		}else if( cur_url.indexOf("LB1403_8M") != -1 ){
			
			var obj = new Object();
           	
            obj.cusAcn = "0740303983200615";
			obj.pdm = "BOX개인사업자신용대출";
			obj.bfmExpiYmd = "20210903";
			obj.afmArrAmt = "1234560";
			obj.adinIrt = "0.2345";
			obj.afmExpiYmd = "20210903";
			obj.itpmSpcfDd = "3";
			obj.limitFee = "12345";
			obj.email = "123@test.com";
            
           	Object.assign(paramData, obj);
		}else if( cur_url.indexOf("LB1403_4M") != -1 ){
			
			var obj = new Object();
           	
            obj.cusAcn = "0740303983200615";
            obj.month = "3";
            obj.adinIrt = "0.25";
            obj.limitFee = "12340";
            obj.afmArrAmt = "567890";
            
           	Object.assign(paramData, obj);
		}else if( cur_url.indexOf("LB1405_3M") != -1 ){
			
			var obj = new Object();
           	
            obj.cusAcn = "0740303983200615";
            obj.tlacAbnmNm = '중소기업자금대출';
            obj.drotAcn = '07403039801021';
            obj.arrAmt = '1234567890';
            
            obj.tlbzBal = "1234567890";
            obj.trnAmt = "1000000";
            obj.rdctAmt = "1234567890";
            obj.withDrawAmt = "234567890";
            
           	Object.assign(paramData, obj);
		}else if( cur_url.indexOf("LB1406_2M") != -1 ){
			
			var obj = new Object();
           	
            obj.cusAcn = "0740303983200615";
            obj.pdm = '기타중소운전자금대출';
            obj.drotAcn = '07403039801021';
            obj.arrAmt = '1234567890';
            
            obj.tlbzBal = "1234567890";
            obj.ipinAmt = "1000000";
            
           	Object.assign(paramData, obj);
		}*/
		// 테스트 끝-----------------------------------
		
		console.log(cur_url, paramData);	
		
		return paramData;
	}
}

$(document).ready(function(){
	// 좌상단 이전 버튼 클릭
	//$('.btnArrow').on('click', function(){
	//	moveToPageByJsonPost($('#prevPage').val(), JSON.stringify(paramData));
	//});
	
	// 우상단 닫기 버튼 클릭
	//$('.btnClose').on('click', moveToAccountPage);
})

function preSetModule(req_device){
	
	// 웹에서만 실행
	if( req_device == 'PC' ){
		
		//라온시큐어 실행
		if(TouchEnNxConfig.onload){
	        TouchEnNx.init();
	        TK_Rescan();
	    }
	
		// 공인인증서 모듈
		/*$.ajax({
			type:"POST",
			contentType : "application/json",
			url 		: "/wizvera/onLoad.do",
			data        : JSON.stringify({}),
			dataType 	: "json",
			async		: false,
			success 	: function(data) {
				
				console.log("/wizvera/onLoad success", data);
				
				var dmReq = data.dmReq;
				
				_SITE_SystemMode = dmReq.systemMode;
				_SITE_SystemLang = dmReq.systemLang;
				_SITE_SiteName = dmReq.siteName;
				_SITE_ModuleType = dmReq.moduleType;
			},
			error       : function(data) {
				
				console.log("/wizvera/onLoad error", data);
				errorDialog(data, '공인인증서 처리중 오류가 발생하였습니다.')
			}
		});*/
	}
}

function getCodeName(groupCodeId, cmmnCodeId){
	var codeName = "";
	
	var param = {
			groupCodeId : groupCodeId,
			cmmnCodeId : cmmnCodeId
		};
	
	$.ajax({
		type : "POST",
		url : "/LOAN400/searchCmmnCodeIdscd",
		contentType : "application/json",
		data : JSON.stringify(param),
		async : false,
		success : function(data){
			console.log("/LOAN400/searchCmmnCodeIdscd success data", data)
			
			if( data.STATUS == "0000" ){
			
				if( data.RSLT_DATA.useAt == "Y"){
					codeName = data.RSLT_DATA.cmmnCodeNm;
				}else{
					codeName = "";
				}
			}else{
				codeName = "";
			}
		},
		error : function(data){
			console.log("/LOAN400/searchCmmnCodeIdscd error data", data)
			codeName = "";
		}
	})
	
	return codeName;
}

function formatterWon(value){
	value = replaceAll(value, ',', '');
	
	var regexp = /^[0-9]*$/;
	if( !regexp.test(value) ){
		alert('숫자만 입력가능합니다.');
		value = value.replace(/[^0-9]/g,'');
	}
	
	return Number(value).toLocaleString();
}

function onlyNumber(value){
	
	var regexp = /^[0-9]*$/;
	if( !regexp.test(value) ){
		value = value.replace(/[^0-9]/g,'');
	}
	
	return value;
}

var bodyHeight = parseInt($('body').css('height').replace('px',''));
function onIpbPwClick(callback,length,modifyHeight){
	try{
		
		var sendParam = {
			callback : callback,
			type : 0,
			title: "계좌 비밀번호 입력",
			min  : length,
			max  : length
		};
		
		if( isMobile() ){
			var resultHeight = modifyHeight + bodyHeight 
			$('body').css('height', modifyHeight + bodyHeight);
			
			if( length == 6){
				window.scrollTo(0,resultHeight);
			}
		}
		
		DSPlugin.loan.getSecPad( callbackSecureKeypad, sendParam);
	}catch(e){
		alert(e);
	}
}

/**
 * 보안키패드 콜백 함수변 변경 시 네이티브 협의 필요
 * @param result
 */
function callbackSecureKeypad(result){
	try{
		//alert("callbackSecureKeypad");
		//alert(JSON.stringify(result));
		
		if( result.result.callback == 'pwd' ){
			
			localData.dractPwd = "";
			if( localData.dractOtp == ''){

				$('#otp').val('');
			}
			
			$('#pwd').val(result.result.dummy);
			if( !isNull(result.result.enc) ) {
				localData.dractPwd = result.result.enc;
			}
		}else if( result.result.callback == 'otp' ){
			
			localData.dractOtp = "";	
			if( localData.dractPwd == '' ){

				$('#pwd').val('');
			}
			
			$('#otp').val(result.result.dummy);
			if( !isNull(result.result.enc) ) {
				localData.dractOtp = result.result.enc;
			}
		}
		
		checkNext();
	}catch(e){
		alert(e);
	}
}