import AdminSidebar from '@/components/admin/AdminSidebar'
import { SITE_NAME } from '@/lib/site-config'

export const metadata = { title: `Admin — ${SITE_NAME}` }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F7F6F3]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
