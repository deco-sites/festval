import { type AppContext } from "../../apps/site.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { AppContext as AppContextVTEX } from "https://cdn.jsdelivr.net/gh/Suportewing/app-vtex-session/mod.ts";

interface Cep {
  public: {
    country: {
      value: string;
    };
    postalCode: {
      value: string;
    };
    geoCoordinates?: {
      value: string;
    };
  };
}

interface Props {
  data: Cep;
}

interface Session {
  id: string;
  namespaces: Namespaces;
}

interface Namespaces {
  account: Account;
  store: Store;
  public: Public;
}

interface Account {
  id: ID;
  accountName: AccountName;
}

interface AccountName {
  value: string;
}

interface ID {
  value: string;
  keepAlive: boolean;
}

export interface Public {}

export interface Store {
  channel: AccountName;
  countryCode: AccountName;
  cultureInfo: AccountName;
  currencyCode: AccountName;
  currencySymbol: AccountName;
  admin_cultureInfo: AccountName;
}

async function action(
  props: Props,
  _req: Request,
  ctx: AppContext
): Promise<Session | undefined> {
  const { data } = props;
  const platform = usePlatform();

  console.log("fez a action");

  if (platform === "vtex") {
    const vtex = ctx as unknown as AppContextVTEX;

    try {
      const response = await vtex.invoke(
        "app-vtex-session/actions/sessionInit.ts",
        {
          data: data,
        }
      );

      return response;
    } catch (e) {
      console.error("Error initializing session:", e);
      throw e;
    }
  }
}

export default action;
