import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-relaxed">{children}</p>,
    h3: ({ children }) => <h3 className="font-serif text-navy text-xl mt-6 mb-2">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-gold pl-4 italic text-muted-foreground">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 space-y-2 list-disc pl-5">{children}</ul>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="link-underline text-navy" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export function PortableTextBlock({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return (
    <div className="space-y-4 text-foreground/85">
      <PortableText value={value} components={components} />
    </div>
  );
}
