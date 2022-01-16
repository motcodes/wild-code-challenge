import React, { useEffect, useRef, useState } from "react";
import tw, { styled } from "twin.macro";
import gsap from "gsap";
import { ProjectProps } from "~/pages";
import { projects } from "~/pages/test";

export function CarouselItem({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <Item id={id} className="carousel-item">
      {children}
    </Item>
  );
}

export function Carousel({ data, ...rest }: { data: Array<ProjectProps> }) {
  const show: number = 3;
  const [currentIndex, setCurrentIndex] = useState<number>(show);
  const [prevIndex, setPrevIndex] = useState<number>(currentIndex);
  const [length, setLength] = useState<number>(data.length);

  const [paused, setPaused] = useState<boolean>(true);

  const [isRepeating, setIsRepeating] = useState<boolean>(data.length > show);
  const [transitionEnabled, setTransitionEnabled] = useState<boolean>(true);

  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (innerRef.current) {
      const prevItem = innerRef.current.childNodes[currentIndex];
      const middleItem = innerRef.current.childNodes[currentIndex + 1];
      const nextItem = innerRef.current.childNodes[currentIndex + 2];
      const middle2 = innerRef.current.childNodes[length + show + 1];

      gsap.fromTo(middleItem, { scale: 1 }, { scale: 1.5, duration: 1 });
      // gsap.fromTo(middle2, { scale: 1 }, { scale: 1.5, duration: 1 });
      if (prevIndex !== currentIndex) {
        gsap.to(prevItem, { scale: 1, duration: 1 });
        gsap.to(nextItem, { scale: 1, duration: 1 });
        setPrevIndex(currentIndex);
      }
    }
  }, [currentIndex, prevIndex]);

  // Set the length to match current children from props
  useEffect(() => {
    setLength(data.length);
    setIsRepeating(data.length > show);
  }, [data, show]);

  useEffect(() => {
    if (isRepeating) {
      if (currentIndex === show || currentIndex === length) {
        setTransitionEnabled(true);
      }
    }
  }, [currentIndex, isRepeating, show, length]);

  const next = () => {
    if (isRepeating || currentIndex < length - show) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const prev = () => {
    if (isRepeating || currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const handleTransitionEnd = () => {
    if (isRepeating) {
      if (currentIndex === 0) {
        if (innerRef.current) {
          const prevItem = innerRef.current.childNodes[currentIndex + 1];
          // console.log("prevItem :", prevItem.textContent);
          gsap.to(prevItem, { scale: 1, duration: 1 });
        }
        setTransitionEnabled(false);
        setCurrentIndex(length);
      } else if (currentIndex === length + show) {
        if (innerRef.current) {
          const prevItem = innerRef.current.childNodes[currentIndex + 1];
          // console.log("prevItem :", prevItem.textContent);
          // gsap.to(prevItem, { scale: 1, duration: 1 });
        }
        setTransitionEnabled(false);
        setCurrentIndex(show);
      }
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!paused) {
  //       setCurrentIndex(currentIndex + 1);
  //     }
  //   }, 5000);

  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // });

  const renderExtraPrev = () => {
    const output = [];
    for (let index = 0; index < show; index++) {
      output.push(data[length - 1 - index]);
    }
    output.reverse();
    return output.map((item: ProjectProps, index) => (
      <CarouselItem data-id={item.name.toLowerCase().replace(/\s/g, "-")} key={item.name + item.name}>
        {item.name} {index}
      </CarouselItem>
    ));
  };

  const renderExtraNext = () => {
    const output = [];
    for (let index = 0; index < show; index++) {
      output.push(data[index]);
    }
    return output.map((item: ProjectProps, index) => (
      <CarouselItem data-id={item.name.toLowerCase().replace(/\s/g, "-")} key={item.name + item.name}>
        {item.name} {index}
      </CarouselItem>
    ));
  };

  return (
    <Outer {...rest} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Inner
        style={{
          transform: `translateX(-${currentIndex * (100 / 3)}%)`,
          transition: !transitionEnabled ? "none" : undefined,
        }}
        onTransitionEnd={() => handleTransitionEnd()}
        ref={innerRef}
      >
        {length > show && isRepeating && renderExtraPrev()}
        {data.map((item: ProjectProps, index: number) => (
          <CarouselItem data-id={item.name.toLowerCase().replace(/\s/g, "-")} key={item.name}>
            {item.name}
          </CarouselItem>
        ))}
        {length > show && isRepeating && renderExtraNext()}
      </Inner>

      <Indicators>
        <button onClick={prev}>Prev</button>

        {data.map((item, index) => (
          <button
            key={item.name + "button"}
            className={`${index === currentIndex ? "active" : ""}`}
            onClick={() => {
              setCurrentIndex(index);
            }}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={next}>Next</button>
      </Indicators>
    </Outer>
  );
}

const Outer = styled.div`
  margin-top: 10rem;
  overflow: hidden;
  ${tw`text-black`}
`;

const Inner = styled.div`
  white-space: nowrap;
  transition: transform 0.3s;
`;

const Item = styled.div`
  width: calc(100% / 3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: green;
  color: #fff;
`;

const Indicators = styled.div`
  margin-top: 20rem;
  display: flex;
  justify-content: center;

  > button {
    margin: 1rem 0.5rem;
    padding: 1rem;
  }

  > button.active {
    background-color: green;
    color: #fff;
  }
`;
