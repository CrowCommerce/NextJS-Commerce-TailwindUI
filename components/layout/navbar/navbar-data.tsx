import { getNavigation } from "lib/shopify";
import NavbarClient from "./navbar-client";

export default async function NavbarData() {
  "use cache";
  const navigation = await getNavigation();
  return <NavbarClient navigation={navigation} />;
}
