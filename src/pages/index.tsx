import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useCallback, useEffect, useRef, useState } from "react";
import tw, { styled } from "twin.macro";
import gsap from "gsap";

import { ProjectProps, SlideIndicesProps, SlideRefProps } from "types";
import { DefaultPage } from "~/layouts/DefaultPage";
import { Slide } from "~/components/slide";
import { siteUrl } from "~/utils/siteUrl";
interface Props {
  projects: Array<ProjectProps>;
}

const Index: NextPage<Props> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLDivElement>(null);
  const slideshowRef = useRef<HTMLDivElement>(null);
  const slidesRefs = useRef<Array<SlideRefProps>>([]);

  const [slidesTotal, setSlidesTotal] = useState<number>(0);

  const [slidesIndices, setSlidesIndices] = useState<SlideIndicesProps>({
    current: 0,
    next: 0,
    prev: 0,
  });

  const [slideBackgroundUrl, setSlideBackgroundUrl] = useState<string>(projects[slidesIndices.current].backgroundUrl);

  const renderSlides = useCallback(
    (renderSlides: number | undefined = undefined) => {
      if (slidesRefs.current) {
        const slidesLength = slidesRefs.current.length;
        const currentIndex = renderSlides === undefined ? slidesIndices.current : renderSlides;
        const nextIndex = currentIndex + 1 <= slidesLength - 1 ? currentIndex + 1 : 0;
        const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : slidesLength - 1;

        setSlidesIndices({
          current: currentIndex,
          next: nextIndex,
          prev: prevIndex,
        });

        slidesRefs.current[currentIndex].setCurrent();
        slidesRefs.current[nextIndex].setRight();
        slidesRefs.current[prevIndex].setLeft();
      }
    },
    [slidesIndices]
  );

  function handleClick(index: number) {
    // setNewCurrent(index);
    if (slidesRefs.current[index].isPositionedRight()) {
      navigate("next");
    } else if (slidesRefs.current[index].isPositionedLeft()) {
      navigate("prev");
    }
  }

  let animating = false;
  function navigate(direction: "next" | "prev") {
    if (animating) return;
    animating = true;

    const upcomingPosition =
      direction === "next"
        ? slidesIndices.current < slidesTotal - 2
          ? slidesIndices.current + 2
          : Math.abs(slidesTotal - 2 - slidesIndices.current)
        : slidesIndices.current >= 2
        ? slidesIndices.current - 2
        : Math.abs(slidesTotal - 2 + slidesIndices.current);

    const newCurrent =
      direction === "next"
        ? slidesIndices.current < slidesTotal - 1
          ? slidesIndices.current + 1
          : 0
        : slidesIndices.current > 0
        ? slidesIndices.current - 1
        : slidesTotal - 1;

    gsap.fromTo(
      backgroundImageRef.current,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        delay: 1.2,
        duration: 1.662,
        ease: "power4.inOut",
      }
    );

    setSlideBackgroundUrl(projects[slidesIndices.current].backgroundUrl);

    setSlidesIndices({
      current: newCurrent,
      next: slidesIndices.next,
      prev: slidesIndices.prev,
    });

    const currentSlide = slidesRefs.current[slidesIndices.current];
    const nextSlide = slidesRefs.current[slidesIndices.next];
    const prevSlide = slidesRefs.current[slidesIndices.prev];
    const upcomingSlide = slidesRefs.current[upcomingPosition];

    prevSlide
      .moveToPosition({
        position: direction === "next" ? -2 : 0,
        delay: direction === "next" ? 0 : 0.3,
      })
      // @ts-ignore
      .then(() => {
        if (direction === "next") {
          prevSlide.hide();
        }
      });

    currentSlide.moveToPosition({
      position: direction === "next" ? -1 : 1,
      delay: 0.07,
    });

    nextSlide
      .moveToPosition({
        position: direction === "next" ? 0 : 2,
        delay: direction === "next" ? 0.3 : 0,
      })
      // @ts-ignore
      .then(() => {
        if (direction === "prev") {
          nextSlide.hide();
        }
      });

    upcomingSlide
      .moveToPosition({
        position: direction === "next" ? 1 : -1,
        from: direction === "next" ? 2 : -2,
        delay: 0.21,
      })
      // @ts-ignore
      .then(() => {
        [nextSlide, currentSlide, prevSlide].forEach((slide) => slide.reset());
        renderSlides(newCurrent);
        animating = false;
      });
  }

  // initial Render
  useEffect(() => {
    if (slidesRefs.current) {
      slidesRefs.current = slidesRefs.current.slice(0, projects.length);
      setSlidesTotal(slidesRefs.current.length);
      renderSlides();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, slidesTotal, slidesRefs]);

  // slide rerender on window resize
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        slidesRefs.current.forEach((slide) => {
          slide.hide();
          slide.reset();
        });
        renderSlides();
      },
      false
    );

    if (slidesRefs.current) {
      renderSlides();
    }

    return () => window.removeEventListener("resize", () => renderSlides(), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NextSeo title="Code Challange" />
      <DefaultPage>
        <Container ref={containerRef}>
          <BackgroundImage imageUrl={slideBackgroundUrl} />
          <BackgroundImage ref={backgroundImageRef} imageUrl={projects[slidesIndices.current].backgroundUrl} />
          <Slideshow ref={slideshowRef}>
            {projects.map((project, index) => (
              <Slide
                ref={(el) => (slidesRefs.current[index] = el)}
                data={project}
                wrapperOnClick={() => handleClick(index)}
                key={project.name}
              />
            ))}
          </Slideshow>
        </Container>
      </DefaultPage>
    </>
  );
};

export default Index;

const Container = styled.div`
  ${tw`fixed bg-cover bg-no-repeat bg-center h-full w-full`}
`;

const BackgroundImage = styled.div<{ imageUrl: string }>`
  ${tw`absolute inset-0 w-full h-full`}
  background-image: ${({ imageUrl }) => `url('${imageUrl}')`};
`;

const Slideshow = styled.section`
  ${tw`relative grid h-full w-full`};
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 100%;
  grid-template-areas: "... slide ...";
  gap: 16px;
  padding: 16px;
  backdrop-filter: blur(200px);
  z-index: 5;
`;

export async function getServerSideProps() {
  const projects: Array<ProjectProps> = [
    {
      name: "Everyday\nFlowers",
      description: "Johanna Hobel for Vouge",
      date: "Jun 2019",
      imageUrl: "images/image01.jpg",
      backgroundUrl: siteUrl("images/image01@2x.jpg"),
    },
    {
      name: "The Wilder\nNight",
      description: "Johanna Hobel for Wild",
      date: "Dec 2019",
      imageUrl: "images/image02.jpg",
      backgroundUrl: siteUrl("images/image02@2x.jpg"),
    },
    {
      name: "Smooth\nMemories",
      description: "Johanna Hobel for Chanel",
      date: "Feb 2020",
      imageUrl: "images/image03.jpg",
      backgroundUrl: siteUrl("images/image03@2x.jpg"),
    },
    {
      name: "The Future\nUniverse",
      description: "Johanna Hobel for On",
      date: "Apr 2020",
      imageUrl: "images/image04.jpg",
      backgroundUrl: siteUrl("images/image04@2x.jpg"),
    },
    {
      name: "She was\nborn urban",
      description: "Johanna Hobel for S1",
      date: "Dec 2021",
      imageUrl: "images/image05.jpg",
      backgroundUrl: siteUrl("images/image05@2x.jpg"),
    },
  ];
  return {
    props: {
      projects,
    },
  };
}
