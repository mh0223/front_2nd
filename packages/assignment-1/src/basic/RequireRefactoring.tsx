import { ComponentProps, memo, PropsWithChildren } from "react";

type Props = {
  countRendering?: () => void;
};

const PureComponent = memo(
  ({
    children,
    countRendering,
    ...props
  }: PropsWithChildren<ComponentProps<"div"> & Props>) => {
    countRendering?.();
    return <div {...props}>{children}</div>;
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let outerCount = 1;

const handleClick = () => {
  outerCount += 1;
};

// 최적화된 props 객체를 외부에서 정의
const staticProps = {
  style: { width: "100px", height: "100px" },
  onClick: handleClick,
};

export default function RequireRefactoring({ countRendering }: Props) {
  return (
    <PureComponent {...staticProps} countRendering={countRendering}>
      test component
    </PureComponent>
  );
}
