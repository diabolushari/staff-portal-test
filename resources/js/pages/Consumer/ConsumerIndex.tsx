import MainLayout from '@/layouts/main-layout'
import { connectionsNavItems } from '@/components/Navbar/navitems'

export default function ConsumerIndex() {
  return (
    <MainLayout navItems={connectionsNavItems}>
      <div>ConsumerIndex</div>
    </MainLayout>
  )
}
