export function createHooks(callback) {
  let state = []; //useState
  let currentIndex = 0; //useState
  const index = currentIndex; //useState
  let timeoutId;

  const render = () => {
    resetContext(); //useState
    setTimeout(() => {
      //비동기 작업(예: setTimeout, promises, DOM 이벤트 등)은 이벤트 큐에 저장
      //콜 스택이 비워진 후, 이벤트 큐에 있는 작업들이 콜 스택으로 이동하여 실행
      callback();
    }, 0);
  };

  //set함수가 실행되어도 마지막 set함수일때만 render() 호출 되도록하기
  const setState = (newValue) => {
    if (state[index === newValue]) return;

    state[index] = newValue;

    //clearTimeout의 동작 방식
    //동기 함수(timer phase에 대기 x): clearTimeout은 동기적으로 실행됨(즉, 호출 즉시 타이머를 취소함)
    //타이머 식별자: clearTimeout은 setTimeout이나 setInterval이
    // 반환한 타이머 ID를 사용하여 특정 타이머를 취소함
    clearTimeout(timeoutId); //

    //모든 동기적 코드가 실행될동안
    //setTimeout은 이벤트 루프의 Timers Phase에서 대기
    timeoutId = setTimeout(render, 0);
  };

  const useState = (initState) => {
    currentIndex++;

    if (state[index] === undefined) {
      state[index] = initState;
    }

    return [state[index], setState];
  };

  const useMemo = (fn, refs) => {};

  const resetContext = () => {
    currentIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
