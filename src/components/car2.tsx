import React, { useState, useRef, useEffect, ReactElement, ReactNode } from "react";
import { styled } from "twin.macro";
import { isClient } from "~/utils/common";

interface ItemProps {
  itemSize?: number;
}

const Item = styled.div<ItemProps>`
  width: calc(100% / 3);
  width: 250px;
  width: ${({ itemSize }) => `${itemSize}px`};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: green;
  color: #fff;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(242, 242, 242, 1);
  padding: 24px;
  width: 100%;
  height: 100vh;
`;

const SlidesContainer = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  padding: 0 5px;
`;

interface ButtonProps {
  left?: boolean;
  right?: boolean;
}

const Button = styled.button<ButtonProps>`
  color: rgba(17, 17, 17, 0.4);
  background-color: transparent;
  padding: 0 10px;
  border: 0;
  display: block;
  align-self: stretch;

  ${(props) => {
    if (props.left) {
      return "border-right: 1px solid rgba(17,17,17,0.4);";
    }
    return "border-left: 1px solid rgba(17,17,17,0.4);";
  }}
`;

interface CarouselProps {
  children: React.ReactNode;
  id?: string;
  itemSize?: number;
}

interface PreviousProps {
  [key: string]: number | string | {} | [] | ((value: number) => void);
}

export function CarouselItem({ children, id, itemSize }: CarouselProps) {
  return (
    <Item id={id} itemSize={itemSize} className="carousel-item">
      {children}
    </Item>
  );
}

export function Carousel({ children }: { children: ReactNode }) {
  const [cursor, setCursor] = useState(0);
  const prevCursor = usePrevious({ cursor, setCursor });
  const [jump, setJump] = useState(false);

  const [itemSize, setItemSize] = useState<number>(0);

  const ref = useRef<HTMLDivElement>(null);
  const animating = useRef<boolean | null>(null);
  animating.current = false;

  useEffect(() => {
    const container = ref.current;
    container?.addEventListener("transitionend", onTransitionEnd);

    return () => {
      container?.removeEventListener("transitionend", onTransitionEnd);
    };
  });

  useEffect(() => {
    if (prevCursor?.cursor && cursor !== prevCursor.cursor) {
      animating.current = true;
    }

    if (jump) {
      setTimeout(() => {
        animating.current = false;
        setJump(false);
      }, 1);
    }
  }, [prevCursor, cursor, jump]);

  function onTransitionEnd() {
    const count = React.Children.count(children);

    animating.current = false;

    if (cursor >= count) {
      setJump(true);
      setCursor(0);

      return;
    }

    if (cursor <= -1) {
      setJump(true);
      setCursor(count - 1);

      return;
    }
  }

  function changeCursor(amount: number) {
    // console.log(animating.current);

    if (animating.current) return;

    setCursor(cursor + amount);
  }

  function usePrevious(value: PreviousProps) {
    const ref = useRef<PreviousProps>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  function renderChildren() {
    let allChildren: React.ReactNodeArray = React.Children.toArray(children);
    allChildren = [...allChildren, ...allChildren, ...allChildren];
    return allChildren.map((child, index: number) =>
      React.cloneElement(child as ReactElement<React.ReactNode>, { key: index })
    );
  }

  function handleItemSize() {
    setItemSize(window.innerWidth / React.Children.count(children));
  }

  useEffect(() => {
    window.addEventListener("resize", () => {
      handleItemSize();
    });

    return () => {
      window.removeEventListener("resize", () => {
        handleItemSize();
      });
    };
  }, [setItemSize, children]);

  useEffect(() => {
    handleItemSize();
  }, [setItemSize, children]);

  return (
    <Wrapper>
      {/* <Button left onClick={() => changeCursor(-1)}>
        prev
      </Button> */}
      <SlidesContainer>
        <div
          style={{
            display: "flex",
            transition: jump ? "none" : "all 500ms ease",
            gap: itemSize,
            transform: `translateX(-${(React.Children.count(children) + cursor) * itemSize}px)`,
          }}
          ref={ref}
        >
          {renderChildren()}
        </div>
      </SlidesContainer>
      {/* <Button right onClick={() => changeCursor(1)}>
        next
      </Button> */}
    </Wrapper>
  );
}
