import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { MODAL_ADD_TO_CART_ID } from "../../constants.ts";
import Modal from "../ui/Modal.tsx";

export interface Props {
  product: Product;
  seller: string;
  item: AnalyticsItem;
}
function ModalAddToCart(props: Props) {
  return <Modal id={MODAL_ADD_TO_CART_ID}>{props.product.name}</Modal>;
}

export default ModalAddToCart;
