export function createHooks(callback) {
  let state = []; //useState
  let currentIndex = 0; //useState
  const index = currentIndex; //useState

  // 1. setTimeout으로 푸는 방법
  // let timeoutId;

  // const render = () => {
  //   resetContext(); //useState
  //   setTimeout(() => {
  //     //비동기 작업(예: setTimeout, promises, DOM 이벤트 등)은 이벤트 큐에 저장
  //     //콜 스택이 비워진 후, 이벤트 큐에 있는 작업들이 콜 스택으로 이동하여 실행
  //     callback();
  //   }, 0);
  // };

  // //set함수가 실행되어도 마지막 set함수일때만 render() 호출 되도록하기
  // const setState = (newValue) => {
  //   if (state[index === newValue]) return;

  //   state[index] = newValue;

  //   //clearTimeout의 동작 방식
  //   //동기 함수(timer phase에 대기 x): clearTimeout은 동기적으로 실행됨(즉, 호출 즉시 타이머를 취소함)
  //   //타이머 식별자: clearTimeout은 setTimeout이나 setInterval이 반환한 타이머 ID를 사용하여 특정 타이머를 취소함
  //
  //   clearTimeout(timeoutId); //

  //   //모든 동기적 코드가 실행될동안 setTimeout은 이벤트 루프의 Timers Phase에서 대기
  //
  //   timeoutId = setTimeout(render, 0);
  // };

  // 2. requestAnimationFrame으로 푸는 방법
  let animationFrameId;

  const render = () => {
    resetContext(); //useState
    callback();
  };

  //set함수가 실행되어도 마지막 set함수일때만 render() 호출 되도록하기
  const setState = (newValue) => {
    if (state[index === newValue]) return;

    state[index] = newValue;

    // cancelAnimationFrame의 동작 방식
    // 동기 함수: cancelAnimationFrame은 동기적으로 실행됨(즉, 호출 즉시 애니메이션 프레임 요청을 취소함)
    // 애니메이션 프레임 식별자: cancelAnimationFrame은 requestAnimationFrame이 반환한 ID를 사용하여 특정 애니메이션 프레임 요청을 취소함
    cancelAnimationFrame(animationFrameId);

    // 비동기 작업(예: requestAnimationFrame, promises, DOM 이벤트 등)은 이벤트 큐에 저장
    // 콜 스택이 비워진 후, 이벤트 큐에 있는 작업들이 콜 스택으로 이동하여 실행

    // 모든 동기적 코드가 실행될 동안 requestAnimationFrame은 이벤트 루프의 애니메이션 프레임 단계에서 대기
    animationFrameId = requestAnimationFrame(render);
  };

  /**
   * 왜 requestAnimationFrame을 사용해야 하는가?
      1. 부드러운 애니메이션: requestAnimationFrame은 브라우저의 리페인트 주기에 맞추어 콜백을 실행하므로, 애니메이션이 더 부드럽게 보인다.
      2. 성능 최적화: 브라우저가 최적의 시점에 렌더링을 수행하므로, CPU와 GPU 자원을 효율적으로 사용 가능하다. 
      3. 일관된 타이밍: requestAnimationFrame은 브라우저가 가능한 한 일정한 프레임 속도로 콜백을 실행하므로, 애니메이션 타이밍이 일관된다. 반면, setTimeout은 다른 작업에 의해 지연될 수 있어 타이밍이 불일치할 수 있다.
   */

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
