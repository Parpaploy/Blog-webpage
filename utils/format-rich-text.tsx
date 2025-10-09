"use client";
import React from "react";

export function FormatRichText(content: any) {
  if (!content || !content.content) return null;

  const renderNode = (node: any, index: number): React.ReactNode => {
    switch (node.type) {
      case "paragraph":
        return (
          <p key={index} className="text-start indent-3 text-lg mb-4">
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </p>
        );

      case "heading":
        const level = node.attrs?.level || 1;
        const HeadingTag = `h${level}` as
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6";
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
          },
          node.content?.map((child: any, i: number) => renderNode(child, i))
        );

      case "text":
        let text: React.ReactNode = node.text;
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            switch (mark.type) {
              case "bold":
                text = <strong>{text}</strong>;
                break;
              case "italic":
                text = <em>{text}</em>;
                break;
              case "strike":
                text = <s>{text}</s>;
                break;
              case "code":
                text = <code className="bg-gray-900 px-1 rounded">{text}</code>;
                break;
              case "underline":
                text = <u>{text}</u>;
                break;
              case "link":
                text = (
                  <a
                    href={mark.attrs?.href}
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {text}
                  </a>
                );
                break;
            }
          });
        }
        return <React.Fragment key={index}>{text}</React.Fragment>;

      case "bulletList":
        return (
          <ul key={index} className="list-disc list-inside mb-4">
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </ul>
        );

      case "orderedList":
        return (
          <ol key={index} className="list-decimal list-inside mb-4">
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </ol>
        );

      case "listItem":
        return (
          <li key={index} className="ml-6 mb-1">
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </li>
        );

      case "blockquote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-gray-400 pl-4 italic my-4"
          >
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </blockquote>
        );

      case "codeBlock":
        return (
          <pre
            key={index}
            className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"
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
