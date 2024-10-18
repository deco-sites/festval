import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Alert from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import SingIn, { SingInProps } from "../../components/header/SignIn.tsx";
import Menu from "../../components/header/Menu.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import Searchbar, {
  type SearchbarProps,
} from "../../components/search/Searchbar/Form.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Modal from "../../components/ui/Modal.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT_MOBILE,
  SEARCHBAR_DRAWER_ID,
  SEARCHBAR_POPUP_ID,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import { useDevice } from "@deco/deco/hooks";
import WishListNav, {
  WishListNavProps,
} from "../../components/header/WishListNav.tsx";
import ModalSessionInit, {
  type ModalInitProps,
} from "../../components/modalSessionInit/ModalSessionInit.tsx";
import { type LoadingFallbackProps } from "@deco/deco";
export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}
export interface SectionProps {
  alerts?: HTMLWidget[];
  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: SiteNavigationElement[] | null;
  /**
   * @title Searchbar
   * @description Searchbar configuration
   */
  searchbar: SearchbarProps;
  /** @title Logo */
  logo: Logo;
  /**
   * @description Usefull for lazy loading hidden elements, like hamburguer menus etc
   * @hide true */
  loading?: "eager" | "lazy";
  /**
   *@title Sign In
   * @description Sign In configuration
   */
  variant?: SingInProps;
  /**
   * @title Wish List
   * @description Wish List configuration
   */
  icon: WishListNavProps;
  /**
   * @title Modal Cep
   * @description Modal Cep configuration
   */
  modalInitProps: ModalInitProps;
}
type Props = Omit<SectionProps, "alert">;
const Desktop = ({
  navItems,
  logo,
  searchbar,
  loading,
  variant,
  icon,
  modalInitProps,
}: Props) => (
  <>
    <ModalSessionInit modalInitProps={modalInitProps.modalInitProps} />
    <Modal id={SEARCHBAR_POPUP_ID}>
      <div
        class="absolute top-0 bg-base-100 container"
        style={{ marginTop: HEADER_HEIGHT_MOBILE }}
      >
        {loading === "lazy" ? (
          <div class="flex justify-center items-center">
            <span class="loading loading-spinner" />
          </div>
        ) : (
          <Searchbar {...searchbar} />
        )}
      </div>
    </Modal>

    <div class="flex flex-col gap-2 pt-5 border-b shadow">
      <div class="custom-container flex justify-between items-center w-full">
        <div class="flex flex-1">
          <a href="/" aria-label="Store logo">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 23}
            />
          </a>
        </div>

        <label
          for={SEARCHBAR_POPUP_ID}
          class="input input-bordered bg-gray-100 border-none rounded flex flex-1 justify-between items-center gap-2 w-full"
          aria-label="search icon button"
        >
          <span class="text-base-400 truncate">Buscar produtos</span>
          <Icon id="search" />
        </label>

        <div class="flex flex-1 justify-end">
          <WishListNav {...icon} />
          <SingIn {...variant} />
          <Bag />
        </div>
      </div>

      <div class="flex items-center bg-[#282828] ">
        <div class="custom-container w-full">
          <ul class="flex gap-2 items-center">
            <Icon id="burguer-white" />
            {navItems?.slice(0, 10).map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </ul>
        </div>

        {/* <div> ship to </div> */}
      </div>
    </div>
  </>
);
const Mobile = ({
  logo,
  searchbar,
  navItems,
  modalInitProps,
  loading,
}: Props) => (
  <>
    <ModalSessionInit modalInitProps={modalInitProps.modalInitProps} />
    <Drawer
      id={SEARCHBAR_DRAWER_ID}
      aside={
        <Drawer.Aside title="Search" drawer={SEARCHBAR_DRAWER_ID}>
          <div class="w-screen overflow-y-auto">
            {loading === "lazy" ? (
              <div class="h-full w-full flex items-center justify-center">
                <span class="loading loading-spinner" />
              </div>
            ) : (
              <Searchbar {...searchbar} />
            )}
          </div>
        </Drawer.Aside>
      }
    />
    <Drawer
      id={SIDEMENU_DRAWER_ID}
      aside={
        <Drawer.Aside title="Menu" drawer={SIDEMENU_DRAWER_ID}>
          {loading === "lazy" ? (
            <div
              id={SIDEMENU_CONTAINER_ID}
              class="h-full flex items-center justify-center"
              style={{ minWidth: "100vw" }}
            >
              <span class="loading loading-spinner" />
            </div>
          ) : (
            <Menu navItems={navItems ?? []} />
          )}
        </Drawer.Aside>
      }
    />

    <div
      class="grid place-items-center w-screen px-5 gap-4"
      style={{
        height: NAVBAR_HEIGHT_MOBILE,
        gridTemplateColumns:
          "min-content auto min-content min-content min-content",
      }}
    >
      <label
        for={SIDEMENU_DRAWER_ID}
        class="btn btn-square btn-sm btn-ghost"
        aria-label="open menu"
      >
        <Icon id="menu" />
      </label>

      {logo && (
        <a
          href="/"
          class="flex-grow inline-flex items-center justify-center"
          style={{ minHeight: NAVBAR_HEIGHT_MOBILE }}
          aria-label="Store logo"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width || 100}
            height={logo.height || 13}
          />
        </a>
      )}

      <label
        for={SEARCHBAR_DRAWER_ID}
        class="btn btn-square btn-sm btn-ghost"
        aria-label="search icon button"
      >
        <Icon id="search" />
      </label>
      <Bag />
    </div>
  </>
);
function Header({
  alerts = [],
  logo = {
    src: "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  ...props
}: Props) {
  const device = useDevice();
  return (
    <header
      style={{
        height:
          device === "desktop" ? HEADER_HEIGHT_DESKTOP : HEADER_HEIGHT_MOBILE,
      }}
    >
      <div class="bg-base-100 fixed w-full z-40">
        {alerts.length > 0 && <Alert alerts={alerts} />}
        {device === "desktop" ? (
          <Desktop logo={logo} {...props} />
        ) : (
          <Mobile logo={logo} {...props} />
        )}
      </div>
    </header>
  );
}
export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  // deno-lint-ignore no-explicit-any
  <Header {...(props as any)} loading="lazy" />
);
export default Header;
