import SearchResult, {
  Props as SearchResultProps,
} from "../search/SearchResult.tsx";
import { type SectionProps } from "@deco/deco";
export type Props = SearchResultProps;
function WishlistGallery(props: SectionProps<typeof loader>) {
  const isEmpty = !props.page || props.page.products.length === 0;
  if (isEmpty) {
    return (
      <div class="container mx-4 sm:mx-auto">
        <div class="mx-10 my-20 flex flex-col gap-4 justify-center items-center">
          <span class="font-medium text-2xl">
            Sua lista de favoritos está vazia
          </span>
          <span>
            Faça login e adicione itens à sua lista de favoritos para mais
            tarde. Eles vão aparecer aqui
          </span>
        </div>
      </div>
    );
  }
  return <SearchResult {...props} searchTerm={props.searchTerm ?? ""} />;
}
export const loader = (props: Props, req: Request) => {
  return {
    ...props,
    url: req.url,
  };
};
export default WishlistGallery;
