import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decodeSession } from '@/lib/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = decodeSession(cookies().get('coffea_session')?.value)

  if (!session || session.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  return <>{children}</>
}
