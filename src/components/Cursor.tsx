import React, { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { styled } from "twin.macro";
import { MouseContext } from "~/contexts/mouseContext";
import { useMousePosition } from "~/hooks/useMousePosition";
import { useInterval } from "~/hooks/useTimeout";

const easeOutQuad = (t: number) => t * (2 - t);
const frameDuration = 1000 / 60;

export const Cursor = () => {
  const { cursorType } = useContext(MouseContext);
  const [progress, setProgress] = useState<number>(0);
  console.log("progress :", progress);
  const { x, y } = useMousePosition();
  const outerBackgroundRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef(null);

  useEffect(() => {
    if (outerBackgroundRef.current) {
      gsap.to(outerBackgroundRef.current, {
        left: x,
        top: y,
      });
    }
  }, [outerBackgroundRef, outerRef, x, y]);

  return (
    <>
      <ProgressContainer ref={outerBackgroundRef} progress={progress || 0} className={cursorType}>
        <svg width="40" height="40">
          <circle cx="20" cy="20" r="19" stroke="1.5" className="back" fill="none" />
          <circle cx="20" cy="20" r="19" stroke="1.5" className="front" fill="none" />
        </svg>
      </ProgressContainer>
      <Inner className={"dot " + cursorType} style={{ left: `${x}px`, top: `${y}px` }} />
    </>
  );
};

const ProgressContainer = styled.div<{ progress: number }>`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%) rotate(-90deg);
  transition-duration: 100ms;
  transition-timing-function: ease-out;
  will-change: width, height, transform, border;
  z-index: 999;
  pointer-events: none;

  svg {
    .back {
      stroke: rgba(255, 255, 255, 0.15);
    }

    .front {
      stroke: rgba(255, 255, 255, 1);
      stroke-linecap: round;
      stroke-dasharray: ${({ progress }) => 116.2355 * progress + 0.001};
      transform-origin: center;
    }
  }
`;

const Outer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 1.5px solid white;
  border-radius: 100%;
  transform: translate(-50%, -50%);
  transition-duration: 100ms;
  transition-timing-function: ease-out;
  will-change: width, height, transform, border;
  z-index: 999;
  pointer-events: none;

  &.hovered {
    width: 50px;
    height: 50px;
    border-width: 3px;
    border-color: lightgray;
  }
`;

const OuterBackground = styled(Outer)`
  border-color: rgba(255, 255, 255, 0.1);
`;

const Inner = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background-color: white;
  border-radius: 100%;
  transform: translate(-50%, -50%);
  z-index: 999;
  pointer-events: none;

  &.hovered {
    display: none;
  }
`;
