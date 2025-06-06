import { SectionProps, type LoadingFallbackProps } from "@deco/deco";
import { useDevice, useScript } from "@deco/deco/hooks";
import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import type {
  ImageObject,
  SiteNavigationElement,
} from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { getCookies } from "std/http/cookie.ts";
import { AppContext } from "../../apps/site.ts";
import Alert from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import MegaMenu from "../../components/header/MegaMenu.tsx";
import Menu from "../../components/header/Menu.tsx";
import MyOrders from "../../components/header/MyOrders.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import SingIn, { SingInProps } from "../../components/header/SignIn.tsx";
import Topbar, { TopBarProps } from "../../components/header/Topbar.tsx";
import WishListNav, {
  WishListNavProps,
} from "../../components/header/WishListNav.tsx";
import ModalSessionInit, {
  type ModalInitProps,
} from "../../components/modalSessionInit/ModalSessionInit.tsx";
import Searchbar, {
  type SearchbarProps,
} from "../../components/search/Searchbar/Form.tsx";
import Icon from "../../components/ui/Icon.tsx";
import MenuMobileDrawer from "../../components/ui/MenuMobileDrawer.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import { useId } from "../../sdk/useId.ts";
export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}
export interface Props {
  alerts?: HTMLWidget[];
  /**
   * @title Navigation items
   * @description Navigation items used desktop menus
   */
  navItems?: SiteNavigationElement[] | null;
  /**
   * @title Navigation items Mobile
   * @description Navigation items used mobile menus
   */
  navItemsMobile?: SiteNavigationElement[] | null;
  /**
   * @title Navigation image mobile
   */
  imageBannerMobile?: ImageObject | null;
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
   * @title Sign In
   * @description Sign In configuration
   */
  variant?: SingInProps;
  /**
   * @title Wish List
   * @description Wish List configuration
   */
  icon: WishListNavProps;
  /**
   * @title Topbar
   * @description Topbar configuration
   */
  topBarProps?: TopBarProps;
  /**
   * @title Modal Cep
   * @description Modal Cep configuration
   */
  modalInitProps: ModalInitProps;

  /**
   * @hide
   */
  region?: string;
}
//type Props = Omit<SectionProps, "alert">;

export const loader = (
  {
    alerts,
    navItems,
    navItemsMobile,
    imageBannerMobile,
    searchbar,
    logo,
    loading,
    variant,
    icon,
    topBarProps,
    modalInitProps,
    region,
  }: Props,
  req: Request,
  _ctx: AppContext
) => {
  const cookies = getCookies(req.headers);
  const regionCookie = cookies["region"];

  region = regionCookie ?? "";

  return {
    alerts,
    navItems,
    navItemsMobile,
    imageBannerMobile,
    searchbar,
    logo,
    loading,
    variant,
    icon,
    topBarProps,
    modalInitProps,
    region,
  };
};

const Desktop = ({
  navItems,
  logo,
  searchbar,
  variant,
  icon,
  modalInitProps,
  region,
}: Props) => (
  <>
    <ModalSessionInit modalInitProps={modalInitProps.modalInitProps} />
    {
      /* <Modal id={SEARCHBAR_POPUP_ID}>
      <div class="absolute top-0 bg-base-100 container" style={{ marginTop: HEADER_HEIGHT_MOBILE }}>
        {loading === "lazy" ? (
          <div class="flex justify-center items-center">
            <span class="loading loading-spinner" />
          </div>
        ) : (
          <Searchbar {...searchbar} />
        )}
      </div>
    </Modal> */
    }
    <div class="flex flex-col gap-2 pt-2 shadow">
      <div class="custom-container flex justify-between items-center w-full">
        <div class="flex flex-1">
          <h1>
            <a
              href={region === "Curitiba"
                ? "/cwb"
                : region === "Cascavel"
                ? "/cac"
                : "/"}
              aria-label="Store logo"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 100}
                height={logo.height || 23}
              />
            </a>
          </h1>
        </div>

        <div class="flex flex-auto">
          <Searchbar {...searchbar} />
        </div>

        {
          /* <label
          for={SEARCHBAR_POPUP_ID}
          class="input input-bordered bg-gray-100 border-none rounded flex flex-1 justify-between items-center gap-2 w-full"
          aria-label="search icon button"
        >
          <span class="text-base-400 truncate">Buscar produtos</span>
          <Icon id="search" />
        </label> */
        }

        <div class="flex flex-1 justify-end gap-4">
          <MyOrders />
          <WishListNav {...icon} />
          <SingIn {...variant} />
          <Bag />
        </div>
      </div>

      <div class="flex items-center bg-[#282828]">
        <div class="custom-container p-0 w-full">
          <ul class="flex gap-2 items-center">
            {navItems
              ?.slice(0, 10)
              .map((item, index) =>
                index === 0
                  ? <MegaMenu key={index} item={item} />
                  : <NavItem key={index} item={item} />
              )}
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
  navItemsMobile,
  imageBannerMobile,
  modalInitProps,
  loading,
}: Props) => (
  <>
    <ModalSessionInit modalInitProps={modalInitProps.modalInitProps} />

    <MenuMobileDrawer
      id={SIDEMENU_DRAWER_ID}
      aside={
        <MenuMobileDrawer.Aside
          drawer={SIDEMENU_DRAWER_ID}
          banner={imageBannerMobile ?? null}
        >
          {loading === "lazy"
            ? (
              <div
                id={SIDEMENU_CONTAINER_ID}
                class="h-full flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <span class="loading loading-spinner" />
              </div>
            )
            : <Menu navItems={navItemsMobile ?? []} />}
        </MenuMobileDrawer.Aside>
      }
    />

    <div
      class="grid w-full p-2 gap-2"
      style={{
        height: HEADER_HEIGHT_MOBILE,
      }}
    >
      <div className="flex w-full place-items-center">
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
            // style={{ minHeight: NAVBAR_HEIGHT_MOBILE }}
            aria-label="Store logo"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={logo.height || 13}
            />
          </a>
        )}

        <Bag />
      </div>

      <div class="flex place-items-center w-full">
        <Searchbar {...searchbar} />
      </div>
    </div>
  </>
);

const onLoad = (id: string) => {
  const header = document.getElementById(id);
  const topbar = document.getElementById("topbar");
  const navbar = header?.querySelector(".navbar-topbar-control");
  const overlayMegamenu = navbar?.querySelector(
    ".megamenu-overlay",
  ) as HTMLDivElement;

  if (!header || !navbar) return;

  if (topbar) {
    header.style.height = "174px";
    const handleScroll = () => {
      const scrollThreshold = 50;

      if (globalThis.scrollY > scrollThreshold) {
        navbar.classList.add("top-0");
        if (overlayMegamenu) overlayMegamenu.style.top = "124px";
      } else {
        navbar.classList.remove("top-0");
        if (overlayMegamenu) overlayMegamenu.style.top = "174px";
      }
    };

    globalThis.addEventListener("scroll", handleScroll);

    globalThis.addEventListener("unload", () => {
      globalThis.removeEventListener("scroll", handleScroll);
    });
  } else {
    header.style.height = "124px";
  }
};

function Header({
  alerts = [],
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  ...props
}: SectionProps<typeof loader>) {
  const id = useId();
  const device = useDevice();

  return (
    <header
      id={id}
      style={{
        height: device === "desktop"
          ? HEADER_HEIGHT_DESKTOP
          : HEADER_HEIGHT_MOBILE,
      }}
    >
      {props.topBarProps &&
        props.topBarProps.topBarProps &&
        props.topBarProps.topBarProps.desktop && (
        <Topbar topBarProps={props.topBarProps.topBarProps} />
      )}
      <div
        class="navbar-topbar-control bg-base-100 fixed w-screen z-40"
        style={{
          transition: "all 0.3s ease-in-out",
        }}
      >
        {alerts.length > 0 && <Alert alerts={alerts} />}
        {device === "desktop"
          ? <Desktop logo={logo} {...props} />
          : <Mobile logo={logo} {...props} />}
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </header>
  );
}
export const LoadingFallback = (
  props: LoadingFallbackProps<SectionProps<typeof loader>>,
) => (
  // deno-lint-ignore no-explicit-any
  <Header {...(props as any)} loading="lazy" />
);
export default Header;
