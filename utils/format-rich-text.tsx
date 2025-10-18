"use client";

import React from "react";

export function FormatRichText(content: any) {
  if (!content || !content.content) return null;

  const renderNode = (node: any, index: number): React.ReactNode => {
    switch (node.type) {
      case "paragraph":
        return (
          <p
            key={index}
            className="mb-2"
            style={{ textAlign: node.attrs?.textAlign || "left" }}
          >
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </p>
        );

      case "heading": {
        const level = node.attrs?.level || 1;
        const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;
        const headingClasses = {
          1: "text-4xl font-bold mb-4",
          2: "text-3xl font-semibold mb-3",
          3: "text-2xl font-semibold mb-2",
          4: "text-xl font-medium mb-2",
          5: "text-lg font-medium mb-1",
          6: "text-base font-medium",
        };

        return React.createElement(
          HeadingTag,
          {
            key: index,
            className: headingClasses[level as keyof typeof headingClasses],
            style: { textAlign: node.attrs?.textAlign || "left" },
          },
          node.content?.map((child: any, i: number) => renderNode(child, i))
        );
      }

      case "text":
        let text: React.ReactNode = node.text;
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            switch (mark.type) {
              case "bold":
                text = <strong key={index}>{text}</strong>;
                break;
              case "italic":
                text = <em key={index}>{text}</em>;
                break;
              case "strike":
                text = <s key={index}>{text}</s>;
                break;
              case "highlight":
                text = (
                  <mark key={index} className="bg-yellow-200 px-1 rounded">
                    {text}
                  </mark>
                );
                break;
              case "link":
                text = (
                  <a
                    key={index}
                    href={mark.attrs.href}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    {text}
                  </a>
                );
                break;
            }
          });
        }
        return <React.Fragment key={index}>{text}</React.Fragment>;

      case "image":
      case "resizableImage": {
        const width = node.attrs.width;
        const isSmall = width && width < 600;

        const wrapperStyles: React.CSSProperties = {
          margin: "1rem 0",
        };

        if (isSmall) {
          wrapperStyles.float = "left";
          wrapperStyles.margin = "4px 16px 8px 0";
          wrapperStyles.display = "inline-block";
        } else {
          wrapperStyles.display = "flex";
          wrapperStyles.justifyContent = "center";
          wrapperStyles.clear = "both";
        }

        return (
          <span key={index} style={wrapperStyles}>
            <img
              src={node.attrs.src}
              alt={node.attrs.alt || ""}
              className="max-w-full rounded-xl shadow-md"
              style={{
                width: width ? `${width}px` : "auto",
                height: "auto",
                display: "block",
              }}
            />
          </span>
        );
      }

      case "bulletList":
        return (
          <ul key={index} className="list-disc ml-6 mb-2">
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </ul>
        );

      case "orderedList":
        return (
          <ol key={index} className="list-decimal ml-6 mb-2">
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </ol>
        );

      case "listItem":
        return (
          <li key={index}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </li>
        );

      case "blockquote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-gray-400 pl-4 italic text-gray-700 my-3"
          >
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </blockquote>
        );

      case "codeBlock":
        return (
          <pre
            key={index}
            className="bg-gray-900 text-white p-3 rounded-md mb-3 overflow-x-auto"
          >
            <code>{node.content?.[0]?.text || ""}</code>
          </pre>
        );

      case "hardBreak":
        return <br key={index} />;

      default:
        return null;
    }
  };

  return (
    <div>
      {content.content.map((node: any, index: number) =>
        renderNode(node, index)
      )}
    </div>
  );
}
