export interface ProjectProps {
  name: string;
  description: string;
  date: string;
  imageUrl: string;
  backgroundUrl: string;
}

export interface SlideIndicesProps {
  current: number;
  next: number;
  prev: number;
}

export interface SizesProps {
  width: number;
  height: number;
}
export interface ImageTranslationProps {
  x: number;
  y: number;
  scale: number;
}

export interface SlidePositionProps {
  isCurrent: boolean;
  isRight: boolean;
  isLeft: boolean;
}

export interface SlideRefProps extends HTMLDivElement {
  itemRef: HTMLDivElement;
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
}

export interface SlideProps {
  data: ProjectProps;
  wrapperOnClick: () => void;
}

export interface ContentProps {
  className: string;
  contentRef: React.RefObject<HTMLDivElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
  headingRef: React.RefObject<HTMLHeadingElement>;
  data: ProjectProps;
}
