"use client";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

type RichTextProps = {
  content: any;
};

export function FormatRichText(content: any) {
  if (!content) return null;

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        paragraph: ({ children }: any) => (
          <p className="text-start indent-3 text-lg mb-4">{children}</p>
        ),
        heading: ({ children, level }: any) => {
          switch (level) {
            case 1:
              return <h1 className="text-4xl font-bold mb-4">{children}</h1>;
            case 2:
              return (
                <h2 className="text-3xl font-semibold mb-3">{children}</h2>
              );
            case 3:
              return (
                <h3 className="text-2xl font-semibold mb-2">{children}</h3>
              );
            case 4:
              return <h4 className="text-xl font-medium mb-2">{children}</h4>;
            case 5:
              return <h5 className="text-lg font-medium mb-1">{children}</h5>;
            case 6:
              return <h6 className="text-base font-medium">{children}</h6>;
            default:
              return <h1 className="text-4xl font-bold mb-4">{children}</h1>;
          }
        },
        list: ({ children, type }: any) =>
          type === "ordered" ? (
            <ol className="list-decimal list-inside mb-4">{children}</ol>
          ) : (
            <ul className="list-disc list-inside mb-4">{children}</ul>
          ),
        "list-item": ({ children }: any) => (
          <li className="ml-6 mb-1">{children}</li>
        ),
        quote: ({ children }: any) => (
          <blockquote className="border-l-4 border-gray-400 pl-4 italic my-4">
            {children}
          </blockquote>
        ),
        link: ({ children, href }: any) => (
          <a
            href={href}
            className="text-blue-600 underline hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        code: ({ children }: any) => (
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
            <code>{children}</code>
          </pre>
        ),
        image: ({ image }: any) => {
          if (!image) return null;

          const imageUrl = image.formats?.large?.url || image.url;

          const src = imageUrl.startsWith("http")
            ? imageUrl
            : `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${imageUrl}`;

          return (
            <img
              src={src}
              alt={image.alternativeText || ""}
              className="rounded-lg my-4 max-w-full h-auto"
            />
          );
        },
      }}
    />
  );
}
