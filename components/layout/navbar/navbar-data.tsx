import { getNavigation } from 'lib/shopify'
import NavbarClient from './navbar-client'

export default async function NavbarData() {
  // Fetch on the server inside Suspense boundary (parent wraps this component)
  const navigation = await getNavigation()
  return <NavbarClient navigation={navigation} />
}


