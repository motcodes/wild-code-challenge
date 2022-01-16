import React, { useState, useRef, useEffect, ReactElement, ReactNode } from "react";
import tw, { styled } from "twin.macro";
import useInView from "react-cool-inview";

import { ProjectProps } from "~/pages";

interface ItemProps {
  itemSize?: number;
}

const Item = styled.div<ItemProps>`
  width: calc(100% / 3);
  width: 250px;
  width: ${({ itemSize }) => `${itemSize}px`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: green;
  color: #fff;
  height: fit-content;
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
  height: 100%;
  overflow: hidden;
  /* padding: 0 5px; */
`;

interface ButtonProps {
  left?: boolean;
  right?: boolean;
}

const Button = styled.button<ButtonProps>`
  /* position: absolute;
  bottom: 12px; */
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

interface CarouselItemProps {
  data: ProjectProps;
  children: React.ReactNode;
  id?: string;
  itemSize?: number;
}
interface CarouselProps {
  data: Array<ProjectProps>;
}

interface PreviousProps {
  [key: string]: number | string | {} | [] | ((value: number) => void);
}

export function CarouselItem({ data, children, id, itemSize }: CarouselItemProps) {
  return (
    <Item id={id} itemSize={itemSize} className="carousel-item">
      {children}
    </Item>
  );
}

export function Carousel({ data }: CarouselProps) {
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
    const count = data.length;
    animating.current = false;

    if (cursor - data.length - 1 >= count) {
      setJump(true);
      setCursor(2);
      return;
    }

    if (cursor <= -1) {
      setJump(true);
      setCursor(count - cursor + 1);
      return;
    }
  }

  function changeCursor(amount: number) {
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
    const allData = [...data, ...data, ...data];
    return allData.map((child: ProjectProps, index: number) => (
      <CarouselItem data={child} key={child.name + index} itemSize={itemSize}>
        {child.name} {index}
        <img src={child.imageUrl} alt={child.name} />
      </CarouselItem>
    ));
  }

  function handleItemSize() {
    setItemSize(Math.round(window.innerWidth / data.length - 10));
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
  }, [setItemSize, data]);

  useEffect(() => {
    handleItemSize();
  }, [setItemSize, data]);

  return (
    <Wrapper>
      <SlidesContainer>
        <div
          style={{
            display: "flex",
            transition: jump ? "none" : "all 500ms ease",
            gap: itemSize,
            transform: `translateX(-${(data.length + cursor) * itemSize - itemSize}px)`,
          }}
          ref={ref}
        >
          {renderChildren()}
        </div>
      </SlidesContainer>
      <div tw="flex absolute bottom-10 left-5 gap-10">
        <Button left onClick={() => changeCursor(-2)}>
          prev
        </Button>
        <Button right onClick={() => changeCursor(2)}>
          next
        </Button>
      </div>
    </Wrapper>
  );
}
