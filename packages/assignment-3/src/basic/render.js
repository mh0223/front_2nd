export function jsx(type, props, ...children) {
  return { type, props, children: children.flat() };
}

export function createElement(node) {
  // jsx(node)를 dom(element)으로 변환
  // 1.Virtual DOM의 type에 맞는 실제 돔을 생성
  // 1)node가 null이나 undefined일 경우
  if (node === null || node === undefined) {
    return document.createDocumentFragment(); //새로운 documnetFragment 생성
  }

  // 2)문자열이나 number일때
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(String(node));
    // createTextNode 메서드를 사용하면 HTML 문법에 영향을 받지 않는 텍스트를 추가할 수 있음
    // 이는 사용자가 입력한 내용을 그대로 화면에 출력하고자 할 때 유용함
  }

  //3) 그 외
  const element = document.createElement(node.type);

  // 2.props 있다면 적용
  if (node.props) {
    Object.keys(node.props).forEach((key) => {
      element.setAttribute(key, node.props[key]);
    });
  }

  // 3.Virtual DOM의 children을 재귀적으로 순회하면서 부모요소에 appendChild를 이용하여 부착
  node.children.forEach((child) => element.appendChild(createElement(child)));

  return element;
}

function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인
  for (const prop in newProps) {
    //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
    //     다음 속성으로 넘어감 (변경 불필요)

    //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
    if (oldProps[prop] !== newProps[prop]) {
      //   target에 해당 속성을 새 값으로 설정
      target.setAttribute(prop, newProps[prop]);
    }
  }

  // oldProps을 반복하여 각 속성 확인
  for (const prop in oldProps) {
    //   만약 newProps들에 해당 속성이 존재한다면
    //     다음 속성으로 넘어감 (속성 유지 필요)

    //   만약 newProps들에 해당 속성이 존재하지 않는다면
    if (!(prop in newProps)) {
      //     target에서 해당 속성을 제거
      target.removeAttribute(prop);
    }
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  if (!newNode && oldNode) {
    //   parent에서 oldNode를 제거
    parent.removeChild(parent.childNodes[index]);
    //   종료
    return;
  }

  // 2. 만약 newNode가 있고 oldNode가 없다면
  if (newNode && !oldNode) {
    //   newNode를 생성하여 parent에 추가
    parent.appendChild(createElement(newNode));
    //   종료
    return;
  }

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  if (typeof newNode === "string" && typeof oldNode === "string") {
    //   oldNode를 newNode로 교체
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    //   종료
    return;
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  if (newNode.type !== oldNode.type) {
    //   oldNode를 newNode로 교체
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    //   종료
    return;
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(
    parent.childNodes[index],
    newNode.props || {},
    oldNode.props || {}
  );

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  const newLength = newNode.children.length;
  const oldLength = oldNode.children.length;

  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  for (let i = 0; i < newLength || i < oldLength; i++) {
    render(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i
    );
  }
}
