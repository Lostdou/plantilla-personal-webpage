import type { ReactNode } from "react";

const titleVariants = {
  solid: "bg-(--home-primary-dark) px-1.5",
  striped: "blue-stripe-bg pl-1.5 pr-2",
};

type Props = {
  title?: ReactNode;
  titleAside?: ReactNode;
  titleVariant?: keyof typeof titleVariants;
  className?: string;
  children?: ReactNode;
};

/** Bordered box with an optional pixel-font title bar — the base of every home widget. */
export default function Panel({ title, titleAside, titleVariant = "solid", className = "", children }: Props) {
  return (
    <div className={`bg-(--home-primary)/90 border border-(--home-accent) ${className}`}>
      {title && (
        <div className={`flex items-center justify-between shrink-0 text-[8px] font-pixel ${titleVariants[titleVariant]}`}>
          <h1 className="text-(--home-text)">{title}</h1>
          {titleAside}
        </div>
      )}
      {children}
    </div>
  );
}
