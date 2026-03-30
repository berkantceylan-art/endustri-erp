import { getCustomers, getParentCustomers } from './actions'
import { CurrentAccountsClient } from './components/CurrentAccountsClient'

// Opt out of static generation because data is based on authenticated user's tenant_id
export const dynamic = 'force-dynamic'

export default async function CurrentAccountsPage() {
  // SSR ile Data Fetching
  const customers = await getCustomers()
  const parentCustomers = await getParentCustomers()

  // Veriyi Client tarafındaki etkileşimli (Edit, Delete, Dialog) UI bloğuna aktarıyoruz
  return <CurrentAccountsClient customers={customers || []} parentCustomers={parentCustomers || []} />
}
