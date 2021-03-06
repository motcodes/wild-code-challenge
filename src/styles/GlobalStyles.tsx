import { createGlobalStyle } from "styled-components";
import tw, { GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle`
  // normal
  @font-face {
    font-family: "Tungsten";
    src: url("/fonts/Tungsten-Semibold.woff2") format("woff2"), url("/fonts/Tungsten-Semibold.woff") format("woff");
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  // bold
  @font-face {
    font-family: "Tungsten";
    src: url("/fonts/Tungsten-Bold.woff2") format("woff2"), url("/fonts/Tungsten-Bold.woff") format("woff");
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  * {
    cursor: none;
  }

  html {
    ${tw`bg-white text-white cursor-default leading-none min-h-full`}
  }

  body {
    ${tw`font-sans text-base antialiased`}
  }

  html,
  body,
  #__next {
    ${tw`flex flex-col flex-1`}
  }

  .helvetica-small {
    font-family: Helvetica;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 120%;
    letter-spacing: 0.08em;
    text-transform: uppercase;  
  }
`;

export const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);
