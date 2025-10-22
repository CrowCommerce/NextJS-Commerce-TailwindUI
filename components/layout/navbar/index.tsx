import { Suspense } from "react";
import NavbarData from "./navbar-data";
import NavbarSkeleton from "./navbar-skeleton";

export default async function Navbar() {
  "use cache";
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <NavbarData />
    </Suspense>
  );
}
