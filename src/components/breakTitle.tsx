import { Fragment } from "react";

export const breakTitle = (str: string) =>
  str.split("\n").map((item: string, idx: number) => {
    return (
      <Fragment key={idx}>
        {item}
        <br />
      </Fragment>
    );
  });
