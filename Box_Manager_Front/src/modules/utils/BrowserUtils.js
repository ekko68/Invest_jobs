/*
  Info : 브라우저 쿠키 삭제
  Param :
  1.name : 삭제 할 쿠키명
 */
const deleteBrowserCookie = (name) => {
    setBrowserCookie(name, "", -1);
}

/*
  Info : 브라우저 쿠키 읽기
  Param :
  1.key : 검색할 쿠키명
 */
const getBrowserCookie = (key) => {
    key = new RegExp(key + '=([^;]*)'); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
    return key.test(document.cookie) ? decodeURIComponent(atob(unescape(RegExp.$1))) : ''; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
}

/*
  Info : 브라우저 쿠키 설정
  Param :
  1.name : 등록할 쿠키명
  2.value : 등록할 쿠키값
  3.exp : 쿠키기간, int형으로 1=1일, 2=2일 ..
 */
const setBrowserCookie = (name, value, exp) => {
    let date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + btoa(encodeURIComponent(value)) + ';expires=' + date.toUTCString() + ';path=/; domain='+window.location.hostname;
}

export {
    deleteBrowserCookie,
    getBrowserCookie,
    setBrowserCookie
}