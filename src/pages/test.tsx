import React from "react";
// import { Carousel } from "~/components/carousel";
import { Carousel, CarouselItem } from "~/components/car3";
import { DefaultPage } from "~/layouts/DefaultPage";
import { isClient } from "~/utils/common";
import { ProjectProps } from ".";

export default function Test() {
  return (
    <DefaultPage>
      {/* <Carousel data={projects} /> */}
      {isClient && <Carousel data={projects} />}
    </DefaultPage>
  );
}

export const projects: Array<ProjectProps> = [
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
    imageUrl: "images/image05.jpg",
    backgroundUrl: "images/image05@2x.jpg",
  },
];
