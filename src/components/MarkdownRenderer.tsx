import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  url: string;
}

function MarkdownRenderer(props: MarkdownRendererProps) {
  const [markdown, setMarkdown] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(props.url);
      const data = await response.text();
      setMarkdown(data);
    };
    fetchData();
  }, [props.url]);

  return (
    <ReactMarkdown
      className="w-auto max-w-full px-4 py-2 prose prose-neutral"
      components={{
        p: ({ children }) => <p style={{ color: "black" }}>{children}</p>,
        li: ({ children }) => <li style={{ color: "black" }}>{children}</li>,
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer;
