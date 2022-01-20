import { useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
import { ContentProps } from "types";
import { breakTitle } from "./breakTitle";

export function Content({ className, contentRef, wrapperRef, headingRef, data }: ContentProps) {
  const [wrapperHeight, setWrapperHeight] = useState<number>(0);

  useEffect(() => {
    if (wrapperRef.current) {
      setWrapperHeight(wrapperRef.current.getBoundingClientRect().height);
    }
  }, [wrapperRef]);

  return (
    <Container ref={contentRef} wrapperHeight={wrapperHeight} className={className}>
      <h2 ref={headingRef}>{breakTitle(data.name)}</h2>
    </Container>
  );
}

const Container = styled.div<{ wrapperHeight: number }>`
  ${tw`absolute inset-0 overflow-hidden`}
  background: transparent;
  height: ${({ wrapperHeight }) => `${wrapperHeight}px`};

  h2 {
    -webkit-text-stroke: 2px white;
  }
`;
