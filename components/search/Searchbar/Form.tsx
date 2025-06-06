/**
 * We use a custom route at /s?q= to perform the search. This component
 * redirects the user to /s?q={term} when the user either clicks on the
 * button or submits the form. Make sure this page exists in deco.cx/admin
 * of yout site. If not, create a new page on this route and add the appropriate
 * loader.
 *
 * Note that this is the most performatic way to perform a search, since
 * no JavaScript is shipped to the browser!
 */
import { Suggestion } from "apps/commerce/types.ts";
import {
  SEARCHBAR_INPUT_FORM_ID,
  SEARCHBAR_POPUP_ID,
} from "../../../constants.ts";
import { useId } from "../../../sdk/useId.ts";
import { useComponent } from "../../../sections/Component.tsx";
import Icon from "../../ui/Icon.tsx";
import { Props as SuggestionProps } from "./Suggestions.tsx";
import { useScript } from "@deco/deco/hooks";
import { asResolved } from "@deco/deco";
import { type Resolved } from "@deco/deco";
// When user clicks on the search button, navigate it to
export const ACTION = "/s";
// Querystring param used when navigating the user
export const NAME = "q";
export interface SearchbarProps {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;
  /** @description Loader to run when suggesting new elements */
  loader: Resolved<Suggestion | null>;
}
const script = (formId: string, name: string, popupId: string) => {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const input = form?.elements.namedItem(name) as HTMLInputElement | null;
  form?.addEventListener("submit", () => {
    const search_term = input?.value;
    if (search_term) {
      window.DECO.events.dispatch({
        name: "search",
        params: { search_term },
      });
    }
  });
  // Keyboard event listeners
  addEventListener("keydown", (e: KeyboardEvent) => {
    const isK = e.key === "k" || e.key === "K" || e.keyCode === 75;
    // Open Searchbar on meta+k
    if (e.metaKey === true && isK) {
      const input = document.getElementById(popupId) as HTMLInputElement | null;
      if (input) {
        input.checked = true;
        document.getElementById(formId)?.focus();
      }
    }
  });
};
const onClick = (suggestionId: string, formId: string) => {
  document.addEventListener("click", (event: Event) => {
    const form = document.getElementById(formId);
    const suggestions = document.getElementById(suggestionId);
    if (
      suggestions &&
      form &&
      !form.contains(event.target as Node) &&
      !suggestions.contains(event.target as Node)
    ) {
      suggestions.innerHTML = "";
    }
  });
};

const onInputHandler = (suggestionId: string, formId: string) => {
  const input = event?.currentTarget as HTMLInputElement;
  const suggestions = document.getElementById(suggestionId);

  if (input && input.value.length === 0 && suggestions) {
    suggestions.innerHTML = "";
  }
};

const Suggestions = import.meta.resolve("./Suggestions.tsx");
export default function Searchbar({
  placeholder = "Buscar produtos",
  loader,
}: SearchbarProps) {
  const slot = useId();
  return (
    <div class="w-full grid relative">
      <form id={SEARCHBAR_INPUT_FORM_ID} action={ACTION} class="join">
        <input
          autoFocus
          tabIndex={0}
          class="input !bg-[#F8F8F8] text-[#646072] border-none outline-none shadow-inherit rounded-l flex-grow justify-between items-center gap-2 w-full join-item focus:outline-none "
          name={NAME}
          placeholder={placeholder}
          autocomplete="off"
          hx-target={`#${slot}`}
          hx-post={
            loader &&
            useComponent<SuggestionProps>(Suggestions, {
              loader: asResolved(loader),
            })
          }
          hx-trigger={`input changed delay:300ms, ${NAME}`}
          hx-indicator={`#${SEARCHBAR_INPUT_FORM_ID}`}
          hx-swap="innerHTML"
          hx-on:input={useScript(onInputHandler, slot, SEARCHBAR_INPUT_FORM_ID)}
        />
        {/* <label type="button" class="join-item btn btn-ghost btn-square hidden sm:inline-flex no-animation" for={SEARCHBAR_POPUP_ID} aria-label="Toggle searchbar">
          <Icon id="close"/>
        </label> */}
        <button
          type="submit"
          class="btn bg-[#F8F8F8] shadow-inherit border-none rounded-r join-item no-animation hover:bg-[#F8F8F8]"
          aria-label="Search"
          for={SEARCHBAR_INPUT_FORM_ID}
          tabIndex={-1}
        >
          <span class="loading loading-spinner loading-xs hidden [.htmx-request_&]:inline" />
          <Icon id="search" class="inline [.htmx-request_&]:hidden" />
        </button>
      </form>

      {/* Suggestions slot */}
      <div id={slot} class="absolute top-[50px] w-full" />

      {/* Send search events as the user types */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            script,
            SEARCHBAR_INPUT_FORM_ID,
            NAME,
            SEARCHBAR_POPUP_ID
          ),
        }}
      />
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onClick, slot, SEARCHBAR_INPUT_FORM_ID),
        }}
      />
    </div>
  );
}
