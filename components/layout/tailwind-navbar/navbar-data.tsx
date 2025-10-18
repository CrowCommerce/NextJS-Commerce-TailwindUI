import { getNavigation } from 'lib/shopify'
import TailwindNavbarClient from './navbar-client'

export default async function NavbarData() {
  // Fetch on the server inside Suspense boundary (parent wraps this component)
  const navigation = await getNavigation()
  return <TailwindNavbarClient navigation={navigation} />
}


