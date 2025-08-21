"use client";
import React, { RefObject, useRef, useState } from "react";
import Quill from "quill";
import { createContext } from "use-context-selector";

// Define QuillContextType explicitly without extending ModalState
export interface QuillContextType {
  quillRef: RefObject<Quill | null> | null;
  handleFocus: () => void;
  setQuillState: React.Dispatch<React.SetStateAction<Quill | null>>;
  containerState: HTMLDivElement | null;
  quillState: Quill | null;
  setContainerState: React.Dispatch<
    React.SetStateAction<HTMLDivElement | null>
  >;
}

// Create the QuillContext
const initialValue: QuillContextType = {
  handleFocus: () => {},
  quillRef: null,
  setQuillState: () => {},
  quillState: null,
  containerState: null,
  setContainerState: () => {},
};

export const QuillContext = createContext<QuillContextType>(initialValue);

// provider component
export const QuillProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const quillRef = useRef<Quill | null>(null);
  const [quillState, setQuillState] = useState<Quill | null>(null);
  const [containerState, setContainerState] = useState<HTMLDivElement | null>(
    null
  );

  const handleFocus = () => {
    console.log("handleFocus triggered");

    if (quillState) {
      console.log("quillState is defined:", quillState);

      setTimeout(() => {
        const editor = quillState;
        if (editor) {
          editor.focus();
        }
      }, 100); // Delay of 100ms (adjust as needed)
    } else {
      console.log("quillState is not defined");
    }
  };

  return (
    <QuillContext.Provider
      value={{
        quillRef,
        handleFocus,
        quillState,
        setQuillState,
        containerState,
        setContainerState,
      }}
    >
      {children}
    </QuillContext.Provider>
  );
};
