import { useEffect, useState } from "react";

interface MousePositionProps {
  x: number;
  y: number;
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<MousePositionProps>({ x: 0, y: 0 });

  useEffect(() => {
    const mouseMoveHandler = ({ clientX, clientY }: { clientX: number; clientY: number }) => {
      setMousePosition({ x: clientX, y: clientY });
    };
    document.addEventListener("mousemove", ({ clientX, clientY }: { clientX: number; clientY: number }) =>
      mouseMoveHandler({ clientX, clientY })
    );

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return mousePosition;
}
