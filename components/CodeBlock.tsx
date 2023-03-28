import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Props {
  language: string;
  value: string;
}

export const CodeBlock = (props: Props) => {
  const { language, value } = props;
  const [isCopied, setIsCopied] = useState<Boolean>(false);

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <div className="w-full relative font-sans text-[16px]">
      <div className="flex items-center justify-between py-1.5 px-4">
        <span className="text-xs text-white font-mono">{language}</span>
        <div className="flex items-center">
          <button
            className="flex items-center rounded bg-none py-0.5 px-2 text-xs text-white bg-gray-600 hover:opacity-80"
            onClick={copyToClipboard}
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <SyntaxHighlighter language={language.toLowerCase()} style={oneDark} customStyle={{ margin: 0 }}>
        {value}
      </SyntaxHighlighter>
    </div>
  );
};
