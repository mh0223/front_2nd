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

export const memo2 = (fn) => fn();

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
