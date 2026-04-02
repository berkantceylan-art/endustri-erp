import { getCustomers } from './actions'
import CurrentAccountsClient from './components/CurrentAccountsClient'

export const dynamic = 'force-dynamic'

export default async function CurrentAccountsPage() {
  const customers = await getCustomers()
  
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cari Hesaplar</h1>
          <p className="text-muted-foreground">
            Müşteri ve tedarikçilerinizi tek bir merkezden yönetin.
          </p>
        </div>
      </div>
      
      <CurrentAccountsClient initialData={customers} />
    </div>
  )
}
