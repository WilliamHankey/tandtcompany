import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { BreadcrumbSchema } from "./JsonLd";

export type BreadcrumbItem = { name: string; url: string };

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <>
    <BreadcrumbSchema items={items} />
    <nav aria-label="Breadcrumb" className="container-prose pt-28 pb-2">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {isLast ? (
                <span className="text-foreground/60" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link to={item.url} className="hover:text-gold transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  </>
);

export default Breadcrumbs;
