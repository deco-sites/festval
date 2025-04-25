import { type SectionProps } from "@deco/deco";
import { AppContext } from "apps/vtex/mod.ts";
import SearchResult, {
  Props as SearchResultProps,
} from "../search/SearchResult.tsx";
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
  return (
    <SearchResult {...props} isWishList searchTerm={props.searchTerm ?? ""} />
  );
}
export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  let productsId: string[] = [];
  if (props.page?.products) {
    productsId = props.page.products.map((product) => product.productID);
  }

  if (!productsId.length) {
    return {
      ...props,
      url: req.url,
    };
  } else {
    const response = await ctx.invoke(
      "vtex/loaders/intelligentSearch/productList.ts",
      { props: { ids: productsId } }
    );

    props.page = {
      ...props.page,
      "@type": "ProductListingPage",
      products: response ?? [],
    };

    return {
      ...props,
      url: req.url,
    };
  }
};
export default WishlistGallery;
