// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $$$$$$$$$0 from "./actions/minicart/submit.ts";
import * as $$$$$$$$$1 from "./actions/sessionInit/submit.ts";
import * as $$$$$$$$$2 from "./actions/wishlist/submit.ts";
import * as $$$$$$$$$$$0 from "./apps/deco/analytics.ts";
import * as $$$$$$$$$$$1 from "./apps/deco/htmx.ts";
import * as $$$$$$$$$$$2 from "./apps/deco/vtex.ts";
import * as $$$$$$$$$$$3 from "./apps/local/app-vtex-session.ts";
import * as $$$$$$$$$$$4 from "./apps/site.ts";
import * as $$$0 from "./loaders/availableIcons.ts";
import * as $$$1 from "./loaders/icons.ts";
import * as $$$2 from "./loaders/minicart.ts";
import * as $$$3 from "./loaders/user.ts";
import * as $$$4 from "./loaders/wishlist.ts";
import * as $$$$$$0 from "./sections/Animation/Animation.tsx";
import * as $$$$$$1 from "./sections/Category/CategoryBanner.tsx";
import * as $$$$$$2 from "./sections/Category/CategoryGrid.tsx";
import * as $$$$$$3 from "./sections/Category/categoryGridLp.tsx";
import * as $$$$$$4 from "./sections/Category/gridBanners.tsx";
import * as $$$$$$5 from "./sections/CategoryGridExtended.tsx";
import * as $$$$$$6 from "./sections/CategoryGridWithNavigation.tsx";
import * as $$$$$$7 from "./sections/Component.tsx";
import * as $$$$$$8 from "./sections/Content/Faq.tsx";
import * as $$$$$$9 from "./sections/Content/Hero.tsx";
import * as $$$$$$10 from "./sections/Content/Intro.tsx";
import * as $$$$$$11 from "./sections/Content/Logos.tsx";
import * as $$$$$$12 from "./sections/Footer/Footer.tsx";
import * as $$$$$$13 from "./sections/Header/Header.tsx";
import * as $$$$$$15 from "./sections/Images/Banner.tsx";
import * as $$$$$$16 from "./sections/Images/Carousel.tsx";
import * as $$$$$$17 from "./sections/Images/CarouselGeoLocation.tsx";
import * as $$$$$$18 from "./sections/Images/ImageGallery.tsx";
import * as $$$$$$19 from "./sections/Images/ShoppableBanner.tsx";
import * as $$$$$$20 from "./sections/Institucional/institutional-layout.tsx";
import * as $$$$$$14 from "./sections/IO/iframeIo.tsx";
import * as $$$$$$21 from "./sections/Links/LinkTree.tsx";
import * as $$$$$$22 from "./sections/Miscellaneous/CampaignTimer.tsx";
import * as $$$$$$23 from "./sections/Miscellaneous/CookieConsent.tsx";
import * as $$$$$$24 from "./sections/Newsletter/Newsletter.tsx";
import * as $$$$$$25 from "./sections/Product/ProductDetails.tsx";
import * as $$$$$$26 from "./sections/Product/ProductShelf.tsx";
import * as $$$$$$27 from "./sections/Product/ProductShelfBanner.tsx";
import * as $$$$$$28 from "./sections/Product/ProductShelfSimilar.tsx";
import * as $$$$$$29 from "./sections/Product/ProductShelfTabbed.tsx";
import * as $$$$$$30 from "./sections/Product/SearchResult.tsx";
import * as $$$$$$31 from "./sections/Product/ShelfWithImage.tsx";
import * as $$$$$$32 from "./sections/Product/Wishlist.tsx";
import * as $$$$$$37 from "./sections/recipe/recipe.tsx";
import * as $$$$$$38 from "./sections/separator.tsx";
import * as $$$$$$33 from "./sections/Session.tsx";
import * as $$$$$$34 from "./sections/Social/InstagramPosts.tsx";
import * as $$$$$$35 from "./sections/Social/WhatsApp.tsx";
import * as $$$$$$36 from "./sections/Theme/Theme.tsx";

const manifest = {
  "loaders": {
    "site/loaders/availableIcons.ts": $$$0,
    "site/loaders/icons.ts": $$$1,
    "site/loaders/minicart.ts": $$$2,
    "site/loaders/user.ts": $$$3,
    "site/loaders/wishlist.ts": $$$4,
  },
  "sections": {
    "site/sections/Animation/Animation.tsx": $$$$$$0,
    "site/sections/Category/CategoryBanner.tsx": $$$$$$1,
    "site/sections/Category/CategoryGrid.tsx": $$$$$$2,
    "site/sections/Category/categoryGridLp.tsx": $$$$$$3,
    "site/sections/Category/gridBanners.tsx": $$$$$$4,
    "site/sections/CategoryGridExtended.tsx": $$$$$$5,
    "site/sections/CategoryGridWithNavigation.tsx": $$$$$$6,
    "site/sections/Component.tsx": $$$$$$7,
    "site/sections/Content/Faq.tsx": $$$$$$8,
    "site/sections/Content/Hero.tsx": $$$$$$9,
    "site/sections/Content/Intro.tsx": $$$$$$10,
    "site/sections/Content/Logos.tsx": $$$$$$11,
    "site/sections/Footer/Footer.tsx": $$$$$$12,
    "site/sections/Header/Header.tsx": $$$$$$13,
    "site/sections/Images/Banner.tsx": $$$$$$15,
    "site/sections/Images/Carousel.tsx": $$$$$$16,
    "site/sections/Images/CarouselGeoLocation.tsx": $$$$$$17,
    "site/sections/Images/ImageGallery.tsx": $$$$$$18,
    "site/sections/Images/ShoppableBanner.tsx": $$$$$$19,
    "site/sections/Institucional/institutional-layout.tsx": $$$$$$20,
    "site/sections/IO/iframeIo.tsx": $$$$$$14,
    "site/sections/Links/LinkTree.tsx": $$$$$$21,
    "site/sections/Miscellaneous/CampaignTimer.tsx": $$$$$$22,
    "site/sections/Miscellaneous/CookieConsent.tsx": $$$$$$23,
    "site/sections/Newsletter/Newsletter.tsx": $$$$$$24,
    "site/sections/Product/ProductDetails.tsx": $$$$$$25,
    "site/sections/Product/ProductShelf.tsx": $$$$$$26,
    "site/sections/Product/ProductShelfBanner.tsx": $$$$$$27,
    "site/sections/Product/ProductShelfSimilar.tsx": $$$$$$28,
    "site/sections/Product/ProductShelfTabbed.tsx": $$$$$$29,
    "site/sections/Product/SearchResult.tsx": $$$$$$30,
    "site/sections/Product/ShelfWithImage.tsx": $$$$$$31,
    "site/sections/Product/Wishlist.tsx": $$$$$$32,
    "site/sections/recipe/recipe.tsx": $$$$$$37,
    "site/sections/separator.tsx": $$$$$$38,
    "site/sections/Session.tsx": $$$$$$33,
    "site/sections/Social/InstagramPosts.tsx": $$$$$$34,
    "site/sections/Social/WhatsApp.tsx": $$$$$$35,
    "site/sections/Theme/Theme.tsx": $$$$$$36,
  },
  "actions": {
    "site/actions/minicart/submit.ts": $$$$$$$$$0,
    "site/actions/sessionInit/submit.ts": $$$$$$$$$1,
    "site/actions/wishlist/submit.ts": $$$$$$$$$2,
  },
  "apps": {
    "site/apps/deco/analytics.ts": $$$$$$$$$$$0,
    "site/apps/deco/htmx.ts": $$$$$$$$$$$1,
    "site/apps/deco/vtex.ts": $$$$$$$$$$$2,
    "site/apps/local/app-vtex-session.ts": $$$$$$$$$$$3,
    "site/apps/site.ts": $$$$$$$$$$$4,
  },
  "name": "site",
  "baseUrl": import.meta.url,
};

export type Manifest = typeof manifest;

export default manifest;
