import React, { useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
import { ProjectProps } from "~/pages/test2";

interface ContentProps {
  className: string;
  contentRef: React.RefObject<HTMLDivElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
  headingRef: React.RefObject<HTMLHeadingElement>;
  data: ProjectProps;
}

// interface ImageSizesProps {
//   bottom: number;
//   height: number;
//   left: number;
//   right: number;
//   top: number;
//   width: number;
//   x: number;
//   y: number;
// }

export function Content({ className, contentRef, wrapperRef, headingRef, data }: ContentProps) {
  const [wrapperHeight, setWrapperHeight] = useState<number>(0);

  useEffect(() => {
    if (wrapperRef.current) {
      setWrapperHeight(wrapperRef.current.getBoundingClientRect().height);
    }
  }, [wrapperRef]);

  return (
    <Container ref={contentRef} wrapperHeight={wrapperHeight} className={className}>
      <h2 ref={headingRef}>{data.name}</h2>
    </Container>
  );
}

const Container = styled.div<{ wrapperHeight: number }>`
  ${tw`absolute inset-0 overflow-hidden`}
  background: transparent;
  height: ${({ wrapperHeight }) => `${wrapperHeight}px`};

  h2 {
    /* opacity: 0; */
    -webkit-text-stroke: 2px white;
  }
`;
