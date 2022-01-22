import React, { createContext, useState } from "react";

interface MouseContextProps {
  cursorType: string;
  cursorChangeHandler: (value: string) => void;
}

export const MouseContext = createContext<MouseContextProps>({
  cursorType: "",
  cursorChangeHandler: () => {},
});

export const MouseContextProvider: React.FC = ({ children }) => {
  const [cursorType, setCursorType] = useState<string>("");

  const cursorChangeHandler = (cursorType: string) => {
    setCursorType(cursorType);
  };

  return (
    <MouseContext.Provider
      value={{
        cursorType: cursorType,
        cursorChangeHandler: cursorChangeHandler,
      }}
    >
      {children}
    </MouseContext.Provider>
  );
};
