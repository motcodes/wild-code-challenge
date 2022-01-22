import { useContext, useEffect, useRef } from "react";
import gsap from "gsap";
import { styled } from "twin.macro";
import { MouseContext } from "~/contexts/mouseContext";
import { useMousePosition } from "~/hooks/useMousePosition";

export const Cursor = () => {
  const { cursorType } = useContext(MouseContext);
  const { x, y } = useMousePosition();
  const outerRef = useRef(null);

  useEffect(() => {
    if (outerRef.current) {
      gsap.to(outerRef.current, {
        left: x,
        top: y,
      });
    }
  }, [outerRef, x, y]);

  return (
    <>
      <Outer ref={outerRef} className={cursorType} />
      <Inner className={"dot " + cursorType} style={{ left: `${x}px`, top: `${y}px` }} />
    </>
  );
};

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
    width: 64px;
    height: 64px;
  }
  &.difference {
    mix-blend-mode: difference;
  }
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
