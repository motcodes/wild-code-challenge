import React from "react";

interface Props {}

export const DefaultPage: React.FC<Props> = ({ children }) => {
  return (
    <>
      <header>
        <h2>XYZ Photography</h2>
      </header>
      <main tw="flex-1">{children}</main>
      <footer>
        <p>footer</p>
      </footer>
    </>
  );
};
