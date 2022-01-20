import gsap from "gsap";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import charming from "charming";
import tw, { styled } from "twin.macro";
import { ProjectProps } from "~/pages/test2";
import { Content } from "./Content";

interface SizesProps {
  width: number;
  height: number;
}
interface TransformProps {
  x: number;
  y: number;
  scale?: number;
}

interface SlidePositionProps {
  isCurrent: boolean;
  isRight: boolean;
  isLeft: boolean;
}

export interface SlideRefProps extends HTMLDivElement {
  itemRef: HTMLDivElement;
  // current: {
  setCurrent: () => void;
  setRight: () => void;
  setLeft: () => void;
  isPositionedRight: () => boolean;
  isPositionedLeft: () => boolean;
  isPositionedCenter: () => boolean;
  moveToPosition: (settings: {
    from?: number | undefined;
    delay?: number;
    position?: number;
    resetImageScale?: boolean;
  }) => void;
  reset: () => void;
  hide: () => void;
  // };
}

interface SlideProps {
  data: ProjectProps;
  wrapperOnClick: () => void;
}

export const Slide = forwardRef<any, SlideProps>((props, ref) => {
  const { data, wrapperOnClick } = props;

  const slideRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLImageElement>(null);

  const headingOutlinedRef = useRef<HTMLHeadingElement>(null);
  const headingFilledRef = useRef<HTMLHeadingElement>(null);

  const [sizes, setSizes] = useState<SizesProps>({ width: 0, height: 0 });
  const [transforms, setTransforms] = useState<Array<TransformProps>>([]);

  const [slidePosition, toggleSlidePosition] = useState<SlidePositionProps>({
    isCurrent: false,
    isRight: false,
    isLeft: false,
  });

  function calcSizes(): void {
    if (wrapperRef.current) {
      setSizes({
        width: wrapperRef.current.offsetWidth,
        height: wrapperRef.current.offsetHeight,
      });
    }
  }

  function calcTransforms() {
    const sizes = {
      width: wrapperRef.current?.offsetWidth,
      height: wrapperRef.current?.offsetHeight,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      scale: 0.484375,
    };

    if (sizes.width && sizes.height) {
      const allTransforms: Array<TransformProps> = [
        {
          x: -sizes.windowWidth + sizes.width * sizes.scale + 16,
          y: sizes.windowHeight - sizes.height * sizes.scale - 16,
          scale: sizes.scale,
        },
        {
          x: -sizes.windowWidth / 2 + (sizes.width / 2) * sizes.scale + 16,
          y: sizes.windowHeight / 2 - (sizes.height / 2) * sizes.scale - 16,
          scale: sizes.scale,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
        },
        {
          x: sizes.windowWidth / 2 - (sizes.width / 2) * sizes.scale - 16,
          y: -sizes.windowHeight / 2 + (sizes.height / 2) * sizes.scale + 16,
          scale: sizes.scale,
        },
        {
          x: sizes.windowWidth - sizes.width * sizes.scale - 16,
          y: -sizes.windowHeight + sizes.height * sizes.scale + 16,
          scale: sizes.scale,
        },
      ];
      setTransforms(allTransforms);
    }
  }

  useEffect(() => {
    function handleResize() {
      calcSizes();
      calcTransforms();
    }

    window.addEventListener("resize", handleResize, false);
    if (wrapperRef.current) {
      handleResize();
    }

    return () => window.removeEventListener("resize", handleResize, false);
  }, []);

  useEffect(() => {
    if (headingOutlinedRef.current) {
      charming(headingOutlinedRef.current, {
        setClassName: (letterIndex: number, letter: string) => {
          return `headingOutlinedLetter index-${letterIndex} letter-${letter}`;
        },
      });
    }
    if (headingFilledRef.current) {
      charming(headingFilledRef.current, {
        setClassName: (letterIndex: number, letter: string) => {
          return `headingFilledLetter index-${letterIndex} letter-${letter}`;
        },
      });
    }
  }, []);

  function positionSlide(position: number) {
    if (wrapperRef.current && sizes.width) {
      gsap.set(wrapperRef.current, {
        x: transforms[position].x,
        y: transforms[position].y,
        scale: transforms[position].scale ? transforms[position].scale : 1,
        autoAlpha: 1,
      });
      gsap.set(".headingOutlinedLetter", {
        autoAlpha: 0,
        y: 50,
      });
      gsap.set(".headingFilledLetter", {
        autoAlpha: 0,
        y: 50,
      });
      // gsap.set(headingOutlinedRef.current, {
      //   autoAlpha: 0,
      //   y: 50,
      // });
      // gsap.set(headingFilledRef.current, {
      //   autoAlpha: 0,
      //   y: 50,
      // });
    }
  }

  function setCurrent() {
    if (slideRef.current) {
      toggleSlidePosition((prev) => ({
        isCurrent: true,
        isLeft: prev.isLeft,
        isRight: prev.isRight,
      }));
      slideRef.current.classList.add("slide--current", "slide--visible");

      const timeline = gsap.timeline();

      gsap.to(".headingOutlinedLetter", {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        delay: 0.1,
        ease: "power4.out",
        stagger: 0.1,
      });

      gsap.to(".headingFilledLetter", {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        delay: 0.1,
        ease: "power4.out",
        stagger: 0.1,
      });

      gsap.to([headingOutlinedRef.current, headingFilledRef.current], {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        delay: 0.125,
        ease: "power4.out",
        stagger: 0.1,
      });

      // set position to center
      positionSlide(2);
    }
  }
  function setLeft() {
    if (slideRef.current) {
      toggleSlidePosition({
        isCurrent: false,
        isLeft: true,
        isRight: false,
      });

      slideRef.current.classList.add("slide--visible");

      // set position to left
      positionSlide(1);
    }
  }
  function setRight() {
    if (slideRef.current) {
      toggleSlidePosition({
        isCurrent: false,
        isLeft: false,
        isRight: true,
      });

      slideRef.current.classList.add("slide--visible");

      // set position to left
      positionSlide(3);
    }
  }
  const isPositionedRight = () => slidePosition.isRight;
  const isPositionedLeft = () => slidePosition.isLeft;
  const isPositionedCenter = () => slidePosition.isCurrent;

  function reset() {
    if (slideRef.current) {
      toggleSlidePosition({ isCurrent: false, isLeft: false, isRight: false });
      slideRef.current.classList.remove("slide--visible", "slide--current");
    }
  }

  function hide() {
    if (wrapperRef.current) {
      gsap.set(wrapperRef.current, {
        x: 0,
        y: 0,
        autoAlpha: 0,
        scale: 1,
      });

      gsap.set([".headingFilledLetter, .headingOutlinedLetter"], {
        autoAlpha: 0,
        y: 50,
      });
      gsap.set([headingOutlinedRef.current, headingFilledRef.current], {
        autoAlpha: 0,
        y: 50,
      });
    }
  }

  function moveToPosition(settings: {
    from: number | undefined;
    delay: number;
    position: number;
    resetImageScale: boolean;
  }): Promise<any> {
    return new Promise((resolve) => {
      gsap.to([".headingFilledLetter, .headingOutlinedLetter"], {
        autoAlpha: 0,
        y: 50,
        duration: 1,
        ease: "power4.out",
      });
      gsap.to([headingOutlinedRef.current, headingFilledRef.current], {
        autoAlpha: 0,
        y: 50,
        duration: 1,
        ease: "power4.out",
      });
      gsap.to(wrapperRef.current, {
        duration: 1.662,
        ease: "power4.inOut",
        delay: settings.delay || 0,
        startAt:
          settings.from !== undefined
            ? {
                x: transforms[settings.from + 2].x,
                y: transforms[settings.from + 2].y,
                scale: transforms[settings.from + 2].scale ? transforms[settings.from + 2].scale : 1,
              }
            : {},
        x: transforms[settings.position + 2].x,
        y: transforms[settings.position + 2].y,
        scale: transforms[settings.position + 2].scale ? transforms[settings.position + 2].scale : 1,
        // @ts-ignore
        onStart: settings.from !== undefined ? () => gsap.set(wrapperRef.current, { autoAlpha: 1 }) : null,
        onComplete: resolve,
      });
    });
  }

  useImperativeHandle(ref, () => ({
    itemRef: slideRef.current,
    setCurrent,
    setRight,
    setLeft,
    isPositionedCenter,
    isPositionedRight,
    isPositionedLeft,
    reset,
    hide,
    moveToPosition,
  }));

  return (
    <Container ref={slideRef}>
      <Wrapper ref={wrapperRef} className="slide-wrapper" onClick={wrapperOnClick}>
        <OutlinedTitle ref={headingOutlinedRef}>{data.name}</OutlinedTitle>
        <SlideImage
          className="slide-image"
          ref={imageRef}
          width={248}
          height={330}
          src={`http://localhost:3000/${data.imageUrl}`}
          alt={data.name}
        />
      </Wrapper>
      <Content
        className="slide-content"
        contentRef={contentRef}
        wrapperRef={wrapperRef}
        headingRef={headingFilledRef}
        data={data}
      />
    </Container>
  );
});

const Container = styled.div`
  ${tw`relative w-full flex items-center pointer-events-none`}
  grid-area: slide;

  &.slide--current {
    pointer-events: auto;

    .slide-content,
    .slide-wrapper {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }
    .slide-wrapper h2 {
      /* opacity: 0; */
      /* visibility: hidden; */
      cursor: default;
    }
  }
  &.slide--visible {
    .slide-wrapper {
      pointer-events: auto;
    }
  }
  .slide-content {
    opacity: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  h2 {
    position: absolute;
    font-size: 20rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-style: normal;
    font-weight: normal;
    font-size: 14vw;
    line-height: 80%;

    text-align: center;
    letter-spacing: 0.04em;
    text-transform: uppercase;

    /* width: 170%; */
    width: 60vw;
    pointer-events: auto;
  }
`;

const Wrapper = styled.div`
  ${tw`relative  w-full flex flex-col items-center cursor-pointer opacity-0`}
  height: fit-content;
`;

const SlideImage = styled.img`
  ${tw`relative rounded-2xl border border-black w-full pointer-events-none`}
  height: max-content;
`;

const OutlinedTitle = styled.h2`
  /* opacity: 0; */
  /* visibility: hidden; */
  color: transparent;
  -webkit-text-stroke: 2px white;
`;
