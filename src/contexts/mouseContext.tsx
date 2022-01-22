import React, { createContext, useState } from "react";

interface MouseContextProps {
  cursorType: string;
  progress?: number;
  cursorChangeHandler?: (value: string) => void;
  progressHandler?: (value: number) => void;
}

export const MouseContext = createContext<MouseContextProps>({
  cursorType: "",
  progress: 0,
  cursorChangeHandler: () => {},
  progressHandler: () => {},
});

export const MouseContextProvider: React.FC = ({ children }) => {
  const [cursorType, setCursorType] = useState<string>("");
  const [progressTime, setProgress] = useState<number>(0);

  const cursorChangeHandler = (cursorType: string) => {
    setCursorType(cursorType);
  };

  const progressHandler = (progressTime: number) => {
    setProgress(progressTime);
  };

  return (
    <MouseContext.Provider
      value={{
        cursorType: cursorType,
        progress: progressTime,
        cursorChangeHandler: cursorChangeHandler,
        progressHandler: progressHandler,
      }}
    >
      {children}
    </MouseContext.Provider>
  );
};
