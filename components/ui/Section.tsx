import { JSX } from "preact";
import Icon from "./Icon.tsx";
import { clx } from "../../sdk/clx.ts";

export interface Props {
  /** @description Section title */
  title?: string;

  /** @description See all link */
  cta?: string;
}

function Header({ title, cta }: Props) {
  if (!title) {
    return null;
  }

  return (
    <div class={clx("flex justify-between items-center gap-2", "px-5 sm:px-0")}>
      <span class="lg:text-xl text-base font-semibold">{title}</span>
      {cta && (
        <a class="text-sm flex gap-2 items-center hover:opacity-80 font-medium text-[#282828]" href={cta}>
          Veja mais
          <Icon class="w-1.5" id="chevron-right" />
        </a>
      )}
    </div>
  );
}

interface Tab {
  title: string;
}

function Tabbed({ children }: { children: JSX.Element }) {
  return <>{children}</>;
}

function Container({ class: _class, ...props }: JSX.IntrinsicElements["div"]) {
  return <div {...props} class={clx("container flex flex-col gap-4 sm:gap-6 w-full py-5 sm:py-10", _class?.toString())} />;
}

function Placeholder({ height, class: _class }: { height: string; class?: string }) {
  return (
    <div
      style={{
        height,
        containIntrinsicSize: height,
        contentVisibility: "auto",
      }}
      class={clx("flex justify-center items-center", _class)}
    >
      <span class="loading loading-spinner" />
    </div>
  );
}

function Section() {}

Section.Container = Container;
Section.Header = Header;
Section.Tabbed = Tabbed;
Section.Placeholder = Placeholder;

export default Section;
