import { createContext, useContext, useState } from "react";

//함수가 사용하는 캐시 객체를 Map 객체를 사용해서 설정
const memo1Cache = new Map();
export const memo1 = (fn) => {
  //캐시 객체에 fn 함수의 결과가 이미 저장되어 있는지 확인
  if (memo1Cache.has(fn)) {
    //있다면 캐시에서 fn 함수의 결과를 가져와 반환
    return memo1Cache.get(fn);
  }

  //fn 함수 실행하여 결과를 얻음
  const result = fn();

  //fn 함수 결과를 캐시에 저장
  memo1Cache.set(fn, result);

  // fn 함수 결과를 반환
  return result;
};

const memo2Cache = new Map();
export const memo2 = (fn, array) => {
  //인수 배열을 JSON 문자열로 변환하여 고유한 키로 사용
  //인수가 [a] 배열이므로 배열의 참조가 다르면 같은 배열 내용이라도 다른 키로 인식
  //JSON.stringify(args)와 같은 문자열 변환을 통해 키를 만드는 것이 필요
  const key = JSON.stringify(array);

  //캐시에서 해당 키가 있는지 확인
  if (memo2Cache.has(key)) {
    //캐시에 저장된 결과가 있으면 반환
    return memo2Cache.get(key);
  }

  //없다면 함수 실행 결과 result에 담기 (바뀐 값 반영) //이렇게 하는게 맞을까요..
  const result = fn(...array);

  //결과를 캐시에 저장
  memo2Cache.set(key, result);

  return result;
};

export const useCustomState = (initValue) => {
  return useState(initValue);
};

const textContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

export const TestContext = createContext({
  value: textContextDefaultValue,
  setValue: () => null,
});

export const TestContextProvider = ({ children }) => {
  const [value, setValue] = useState(textContextDefaultValue);

  return (
    <TestContext.Provider value={{ value, setValue }}>
      {children}
    </TestContext.Provider>
  );
};

const useTestContext = () => {
  return useContext(TestContext);
};

export const useUser = () => {
  const { value, setValue } = useTestContext();

  return [value.user, (user) => setValue({ ...value, user })];
};

export const useCounter = () => {
  const { value, setValue } = useTestContext();

  return [value.count, (count) => setValue({ ...value, count })];
};

export const useTodoItems = () => {
  const { value, setValue } = useTestContext();

  return [value.todoItems, (todoItems) => setValue({ ...value, todoItems })];
};
