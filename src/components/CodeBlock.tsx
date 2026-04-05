"use client";

import {
  SandpackCodeViewer,
  SandpackProvider,
} from "@codesandbox/sandpack-react";

interface CodeBlockProps {
  code: string;
  language?: "typescript" | "javascript" | "tsx" | "jsx" | "css" | "html";
}

export default function CodeBlock({
  code,
  language = "typescript",
}: CodeBlockProps) {
  return (
    <SandpackProvider
      files={{ [`/index.${language}`]: code }}
      theme="dark"
      options={{ visibleFiles: [`/index.${language}`] }}
    >
      <SandpackCodeViewer
        showLineNumbers
        wrapContent
      />
    </SandpackProvider>
  );
}
