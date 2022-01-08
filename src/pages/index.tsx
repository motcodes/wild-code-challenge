import { NextPage } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";

import { DefaultPage } from "~/layouts/DefaultPage";

import image1 from "../assets/images/image01.jpg";
interface Props {}

const Index: NextPage<Props> = () => {
  return (
    <>
      <NextSeo title="Index" />
      <DefaultPage>
        <h1>Index</h1>
        <Image src={image1} alt="image 01" width={512} objectFit="cover" />
      </DefaultPage>
    </>
  );
};

export default Index;
