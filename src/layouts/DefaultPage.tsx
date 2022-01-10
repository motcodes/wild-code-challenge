import React from "react";
import tw, { styled } from "twin.macro";

interface Props {}

export const DefaultPage: React.FC<Props> = ({ children }) => {
  return (
    <>
      <header tw="z-10">
        <Title>XYZ Photography</Title>
      </header>
      <main tw="flex-1">{children}</main>
    </>
  );
};

const Title = styled.h2`
  ${tw`text-base uppercase absolute`}
  top: 1.6rem;
  left: 1.6rem;
  letter-spacing: 0.08em;
`;
