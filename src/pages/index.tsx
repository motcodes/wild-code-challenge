import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRef, useState } from "react";
import tw, { css, styled } from "twin.macro";

import { DefaultPage } from "~/layouts/DefaultPage";

interface Props {}

interface ContainerProps {
  imageUrl: string;
}
interface HeadingProps {
  imageBounds?: {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
  };
}

const Index: NextPage<Props> = () => {
  const [projectCounter, setProjectCounter] = useState<number>(0);

  const imageRef = useRef<HTMLImageElement>(null);

  // eslint-disable-next-line no-console
  const imageLeft = projects[projects.length - projectCounter - 1];
  const imageCenter = projects[projectCounter];
  const imageRight = projects[projectCounter === 4 ? projects.length - projectCounter : projectCounter + 1];

  const loader = ({ src }: { src: string }) => `http://localhost:3000/${src}`;

  console.log(imageRef.current?.getBoundingClientRect());

  return (
    <>
      <NextSeo title="Index" />
      <DefaultPage>
        <Container imageUrl={`http://localhost:3000/${imageCenter.backgroundUrl}`}>
          <Grid>
            <ImageLeft
              width={248}
              height={330}
              src={`http://localhost:3000/${imageLeft.imageUrl}`}
              alt={imageLeft.name}
            />
            <div className="center">
              <div tw="absolute inset-0 flex justify-center items-center">
                {imageRef.current && (
                  <Heading
                    imageBounds={imageRef.current.getBoundingClientRect()}
                    data-content={projects[projectCounter].name}
                  >
                    {projects[projectCounter].name}
                  </Heading>
                )}
              </div>
              <ImageCenter
                ref={imageRef}
                width={512}
                height={680}
                src={`http://localhost:3000/${imageCenter.imageUrl}`}
                alt={imageCenter.name}
              />
            </div>
            <ImageRight
              width={248}
              height={330}
              src={`http://localhost:3000/${imageRight.imageUrl}`}
              alt={imageRight.name}
            />
          </Grid>
        </Container>
        {/* <Image src={image1} alt="image 01" width={512} objectFit="cover" /> */}
      </DefaultPage>
    </>
  );
};

export default Index;

const Container = styled.div<ContainerProps>`
  ${tw`fixed bg-cover bg-no-repeat bg-center h-full w-full`}
  background-image: ${({ imageUrl }) => `url('${imageUrl}')`};
  /* inset: -256px; */
  /* filter: blur(200px); */
`;

const Grid = styled.section`
  ${tw`grid grid-cols-6 grid-rows-2 h-full w-full`};
  padding: 16px;
  gap: 8px;
  backdrop-filter: blur(200px);

  img {
    ${tw`rounded-2xl border border-black w-full`}
  }
  .center {
    align-self: center;
    grid-column: 3 / 5;
    grid-row: 1 / 3;
  }
`;

const Heading = styled.h1<HeadingProps>`
  ${tw`uppercase text-center`}

  font-size: 240px;
  max-width: 50%;
  line-height: 0.8;
  letter-spacing: 0.04em;
  background-clip: text;
  -webkit-text-stroke: 1px white;
  -webkit-text-fill-color: transparent;

  &::before {
    content: attr(data-content);
    position: absolute;
    z-index: 10;
    background-clip: unset;
    -webkit-text-fill-color: white;
    text-overflow: clip;

    ${({ imageBounds }) => {
      return css`
        width: ${imageBounds?.width}px;
        height: ${imageBounds?.height}px;
        /* top: ${imageBounds?.top}px;
        right: ${imageBounds?.right}px;
        bottom: ${imageBounds?.bottom}px;
        left: ${imageBounds?.left}px; */
      `;
    }}

    overflow: hidden;
  }
`;

const ImageLeft = styled.img`
  align-self: end;
  grid-column: 1;
  grid-row: 2;
`;
const ImageCenter = styled.img`
  align-self: center;
  grid-column: 3 / 5;
  grid-row: 1 / 3;
`;
const ImageRight = styled.img`
  align-self: start;
  grid-column: 6;
  grid-row: 1;
`;

const projects = [
  {
    name: "Everyday Flowers",
    description: "Johanna Hobel for Vouge",
    date: "Jun 2019",
    imageUrl: "images/image01.jpg",
    backgroundUrl: "images/image01@2x.jpg",
  },
  {
    name: "The Wilder Night",
    description: "Johanna Hobel for Wild",
    date: "Dec 2019",
    imageUrl: "images/image02.jpg",
    backgroundUrl: "images/image02@2x.jpg",
  },
  {
    name: "Smooth Memories",
    description: "Johanna Hobel for Chanel",
    date: "Feb 2020",
    imageUrl: "images/image03.jpg",
    backgroundUrl: "images/image03@2x.jpg",
  },
  {
    name: "The Future Universe",
    description: "Johanna Hobel for On",
    date: "Apr 2020",
    imageUrl: "images/image04.jpg",
    backgroundUrl: "images/image04@2x.jpg",
  },
  {
    name: "She was born urban",
    description: "Johanna Hobel for S1",
    date: "Dec 2021",
    imageUrl: "images/image04.jpg",
    backgroundUrl: "images/image05@2x.jpg",
  },
];
