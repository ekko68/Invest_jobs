/**********
 info : 지정한 날짜의 지난기간을 구하는 날짜계산기
 **********/

export const dateCalculation = (param) => {
  //return DatedData
  const objDate = {
    type:"",
    value:""
  }

  //전달받은값과 현재시간을 비교하여 +,-하는것이 목적
  const diff = param;

  //(2023),(07),(23) 필요한 그룹 단위로 분리
  const regex = /(\d{0,4})(\d{0,2})(\d{0,2})/g;
  const changeValue = diff.split(regex).filter(Boolean).join("-");

  //new Date().toISOString() 현재시간을 받아옴 => 2023-07-21T08:18:11.868Z
  //split("T")[0] T기준으로 0번째 배열을 사용
  //replaceAll("-","") -를 지워므로서 diff변수와 패턴을 동일시 함
  const nowDate = new Date().toISOString().split("T")[0].replaceAll("-","");

  //getTime으로 비교하기에 시/분/초 항목을 동일하게 맞춰줌
  const diffTimeInit = `${changeValue} 00:00:00`;
  const nowDateInit = `${new Date().toISOString().split("T")[0]} 00:00:00`;

  //비교하려는 날짜와 현재날짜에 대해서 초단위로 변환
  const diffTime = new Date(diffTimeInit).getTime();
  const nowTime = new Date(nowDateInit).getTime();

  try {
    if(diffTime > 0){
      //현재와 같은날인경우
      if(nowDate === diff){
        objDate.type = "now"
        objDate.value = 0

      }else{

        let d_day = diffTime-nowTime;
        d_day= Math.floor(d_day / (1000*60*60*24));

        //현재날짜가 더 크면 남을일수
        if(nowTime > diffTime){
          objDate.type = "plus"
          objDate.value = Math.abs(d_day)
          //현재날짜가 더 작으면 지난일수
        }
        if(nowTime < diffTime) {
          objDate.type = "minus"
          objDate.value = Math.abs(d_day)
        }
      }
    }else{
      throw {
        code : 1100,
        message : `${diff} 날짜형식 오류입니다`
      };
    }

    return objDate;

  }catch(e){
    console.log(e)
  }
};