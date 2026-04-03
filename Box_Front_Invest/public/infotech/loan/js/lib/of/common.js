

/********************************************************************
 * @업무명		: 	공통
 * @설명			:	공통스크립트 작성
 * @파일명		:	common.js
 * @기존명		:
 *********************************************************************
 * 번호	작업자	작업일		변경내용
 *--------------------------------------------------------------------
 * 1    박현일	2018-08-24	최초작성
 *********************************************************************/
var contextRoot = "/orchestra_sample"

function backPressed(){
	OFHistory.go(-1);
}

function ofBackPressed() {
//	alert("onBackPressed");
	OFHistory.go(-1);
}

function ofMovePage(param) {

    var movePage = param.url;
//    if(movePage.indexOf("index") != -1 || movePage.indexOf("pages/") != -1){
//        movePage = "../../"+movePage;
//    }

    window.location = movePage;
}

function openBox(menuid, url) {
	var param = {
		 "id" : "popup"
		,"url" : url
		,"isBoxStore" : 1
		,"parameter" : {
			 "data" : ""
			,"id" : menuid
		}
	};
	
	OFPopup.openPopup(param);
}