import gsap from "gsap";
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import charming from "charming";
import tw, { styled } from "twin.macro";
import { SizesProps, SlidePositionProps, SlideProps, ImageTranslationProps, InfoPositionProps } from "types";
import { MouseContext } from "~/contexts/mouseContext";
import { Content } from "./slideContent";
import { breakTitle } from "./breakTitle";

export const Slide = forwardRef<any, SlideProps>((props, ref) => {
  const { data, wrapperOnClick, slideIndex, slidesTotal, onMouseEnter, onMouseLeave } = props;

  const { cursorChangeHandler } = useContext(MouseContext);

  const slideRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLImageElement>(null);

  const indicatorRef = useRef<HTMLImageElement>(null);
  const indicatorIndexRef = useRef<HTMLSpanElement>(null);

  const headingOutlinedRef = useRef<HTMLHeadingElement>(null);
  const headingFilledRef = useRef<HTMLHeadingElement>(null);

  const [wrapperSizes, setWrapperSizes] = useState<SizesProps>({ width: 0, height: 0 });
  const [infoPosition, setInfoPosition] = useState<InfoPositionProps>({ top: 0, left: 0 });
  const [imageTranslation, setImageTranslation] = useState<Array<ImageTranslationProps>>([]);

  const [slidePosition, toggleSlidePosition] = useState<SlidePositionProps>({
    isCurrent: false,
    isRight: false,
    isLeft: false,
  });

  function calcWrapperSizes(): void {
    if (wrapperRef.current) {
      setWrapperSizes({
        width: wrapperRef.current.offsetWidth,
        height: wrapperRef.current.offsetHeight,
      });
    }
  }

  function calcImageTranslation(): void {
    const sizes = {
      width: wrapperRef.current?.offsetWidth,
      height: wrapperRef.current?.offsetHeight,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      scale: 0.484375,
    };

    if (sizes.width && sizes.height) {
      const allTransforms: Array<ImageTranslationProps> = [
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

      if (wrapperRef.current && infoRef.current) {
        setInfoPosition({
          bottom: (sizes.height * sizes.scale) / 5 - 16,
          left: allTransforms[3].x + infoRef.current.offsetWidth - 12,
        });
      }
      setImageTranslation(allTransforms);
    }
  }

  // Window Resize Event
  useEffect(() => {
    function handleResize() {
      calcWrapperSizes();
      calcImageTranslation();
    }

    window.addEventListener("resize", handleResize, false);

    if (wrapperRef.current) {
      handleResize();
    }

    return () => window.removeEventListener("resize", handleResize, false);
  }, []);

  // Turning Heading Title into Letters
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
    if (wrapperRef.current && wrapperSizes.width) {
      gsap.set(wrapperRef.current, {
        x: imageTranslation[position].x,
        y: imageTranslation[position].y,
        scale: imageTranslation[position].scale ? imageTranslation[position].scale : 1,
        autoAlpha: 1,
      });

      // @ts-ignore
      gsap.set([headingOutlinedRef.current?.children, headingFilledRef.current?.children], {
        autoAlpha: 0,
        y: 80,
        skewY: 15,
      });

      // @ts-ignore
      gsap.set(infoRef.current?.children, {
        autoAlpha: 0,
        y: 30,
        skewY: 15,
      });
      // @ts-ignore
      gsap.set(indicatorIndexRef.current, {
        autoAlpha: 0,
        y: 10,
        skewY: 15,
      });
      // @ts-ignore
      gsap.to(indicatorRef.current, {
        backgroundColor: "transparent",
      });
    }
  }

  // set position to center
  function setCurrent() {
    if (slideRef.current) {
      toggleSlidePosition((prev) => ({
        isCurrent: true,
        isLeft: prev.isLeft,
        isRight: prev.isRight,
      }));
      slideRef.current.classList.add("slide--current", "slide--visible");

      const initialMotion = {
        autoAlpha: 1,
        y: 0,
        skewY: 0,
        duration: 1,
        delay: 0,
        ease: "power4.out",
        stagger: 0.07,
      };

      // @ts-ignore
      gsap.to(headingOutlinedRef.current?.children, initialMotion);
      // @ts-ignore
      gsap.to(headingFilledRef.current?.children, initialMotion);
      // @ts-ignore
      gsap.to(infoRef.current?.children, { ...initialMotion, delay: 0.5 });
      // @ts-ignore
      gsap.to(indicatorIndexRef.current, { ...initialMotion, delay: 1, stagger: undefined });
      // @ts-ignore
      gsap.to(indicatorRef.current, {
        backgroundColor: "rgba(255, 255, 255, 1)",
        duration: 0.667,
        ease: "power4.out",
      });

      positionSlide(2);
    }
  }

  // set position to left
  function setLeft() {
    if (slideRef.current) {
      toggleSlidePosition({
        isCurrent: false,
        isLeft: true,
        isRight: false,
      });

      slideRef.current.classList.add("slide--visible");

      positionSlide(1);
    }
  }

  // set position to left
  function setRight() {
    if (slideRef.current) {
      toggleSlidePosition({
        isCurrent: false,
        isLeft: false,
        isRight: true,
      });

      slideRef.current.classList.add("slide--visible");

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

      // @ts-ignore
      gsap.set([headingFilledRef.current?.children, headingOutlinedRef.current?.children], {
        autoAlpha: 1,
        y: 80,
        skewY: -15,
      });

      // @ts-ignore
      gsap.set(infoRef.current?.children, {
        autoAlpha: 1,
        y: 30,
        skewY: -15,
      });
      // @ts-ignore
      gsap.set(indicatorRef.current, {
        backgroundColor: "transparent",
      });
      // @ts-ignore
      gsap.set(indicatorIndexRef.current, {
        autoAlpha: 1,
        y: 10,
        skewY: -15,
      });
    }
  }

  function moveToPosition(settings: {
    from: number | undefined;
    delay: number;
    position: number;
    resetImageScale: boolean;
  }): Promise<unknown> {
    const letterAnimationProps = {
      autoAlpha: 0,
      y: -80,
      skewY: 15,
      duration: 1,
      ease: "power4.inOut",
      stagger: 0.07,
    };

    return new Promise((resolve) => {
      // @ts-ignore
      gsap.to(headingOutlinedRef.current?.children, letterAnimationProps);
      // @ts-ignore
      gsap.to(headingFilledRef.current?.children, letterAnimationProps);
      // @ts-ignore
      gsap.to(infoRef.current?.children, {
        ...letterAnimationProps,
        y: -30,
      });
      gsap.to(indicatorRef.current, {
        backgroundColor: "transparent",
        duration: 0.667,
        ease: "power4.inOut",
        // delay: 0.7,
      });
      // @ts-ignore
      gsap.to(indicatorIndexRef.current, {
        ...letterAnimationProps,
        y: -10,
        stagger: undefined,
        delay: 0.7,
      });

      gsap.to(wrapperRef.current, {
        duration: 1.662,
        ease: "power4.inOut",
        // @ts-ignore
        delay: (settings.delay || 0) + headingFilledRef.current?.children.length * 0.07,
        startAt:
          settings.from !== undefined
            ? {
                x: imageTranslation[settings.from + 2].x,
                y: imageTranslation[settings.from + 2].y,
                scale: imageTranslation[settings.from + 2].scale ? imageTranslation[settings.from + 2].scale : 1,
              }
            : {},
        x: imageTranslation[settings.position + 2].x,
        y: imageTranslation[settings.position + 2].y,
        scale: imageTranslation[settings.position + 2].scale ? imageTranslation[settings.position + 2].scale : 1,
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
      <Wrapper
        ref={wrapperRef}
        className="slide-wrapper"
        onClick={wrapperOnClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <OutlinedTitle className="slide-outlinedTitle" ref={headingOutlinedRef} onMouseEnter={onMouseLeave}>
          {breakTitle(data.name)}
        </OutlinedTitle>
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

      <Info
        ref={infoRef}
        className="slide-info helvetica-small"
        bottom={infoPosition.bottom || 0}
        left={infoPosition.left || 0}
      >
        <p>{data.description}</p>
        <p>{data.date}</p>
        <button
          onMouseEnter={() => {
            if (cursorChangeHandler) cursorChangeHandler("hovered difference");
          }}
          onMouseLeave={() => {
            if (cursorChangeHandler) cursorChangeHandler("");
          }}
          className="helvetica-small"
        >
          Have a look
        </button>
      </Info>
      <IndicatorContainer bottom={wrapperSizes.height || 0} className="slide-indicator helvetica-small">
        <p>
          <span tw="inline-block" ref={indicatorIndexRef}>
            {slideIndex + 1}
          </span>{" "}
          of 5
        </p>
        <IndicatorWrapper>
          {[...Array(slidesTotal)].map((_, index) => (
            <Indicator
              key={`Indicator-${index}`}
              ref={index === slideIndex ? indicatorRef : null}
              className={index === slideIndex ? "slide-indicator-filled" : ""}
            />
          ))}
        </IndicatorWrapper>
      </IndicatorContainer>
    </Container>
  );
});

const Container = styled.div`
  ${tw`relative w-full flex items-center pointer-events-none`}
  grid-area: slide;
  max-width: 512px;
  margin: 0 auto;

  &.slide--current {
    pointer-events: auto;
    z-index: 6;

    .slide-content,
    .slide-wrapper,
    .slide-info,
    .slide-indicator {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }
    .slide-outlinedTitle {
      opacity: 1;
      visibility: visible;
    }
    .slide-wrapper h2 {
      opacity: 1;
      visibility: visible;
      span {
        opacity: 0;
        visibility: hidden;
      }
    }
  }
  &.slide--visible {
    * {
      cursor: none;
    }
    .slide-wrapper {
      pointer-events: auto;
    }
    .slide-outlinedTitle {
      opacity: 0;
      visibility: hidden;
    }
  }
  .slide-content {
    opacity: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .slide-info,
  .slide-indicator {
    opacity: 0;
    visibility: hidden;
  }

  h2 {
    position: absolute;
    font-size: 20rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-style: normal;
    font-weight: normal;
    font-size: clamp(96px, 14vw, 220px);
    line-height: 80%;

    text-align: center;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    width: 60vw;
    pointer-events: auto;

    span {
      display: inline-block;
      opacity: 0;
      visibility: hidden;
      white-space: break-spaces;
    }
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
  color: transparent;
  -webkit-text-stroke: 2px white;
`;

const Info = styled.div<{ bottom: number; left: number }>`
  ${tw`absolute justify-self-start flex flex-col justify-center items-end uppercase `}
  row-gap: 16px;
  width: 110px;

  bottom: ${({ bottom }) => `${bottom}px`};
  left: ${({ left }) => `${left}px`};

  button {
    ${tw`relative flex flex-row items-start bg-white rounded-3xl font-bold uppercase select-none`}
    padding: 9px 16px 8px;
    color: #202020;
  }
`;

const IndicatorContainer = styled.div<{ bottom: number }>`
  position: absolute;
  bottom: ${({ bottom }) => `calc(50% - ${bottom / 3.5}px)`};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
`;

const IndicatorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`;

const Indicator = styled.span`
  width: 5px;
  height: 8px;
  border-radius: 2px;
  border: 1px solid white;
  background-color: rgba(255, 255, 255, 0);
  transition: all 1s ease;

  &.slide-indicator-filled {
    /* background-color: rgba(255, 255, 255, 1); */
  }
`;
