'use client'

import { useState } from 'react'
import { Search, UserCog, CheckCircle2, ShieldAlert, X } from 'lucide-react'
import { updateUserAccess } from '@/app/(portal)/users/actions'

type UserData = {
  id: string
  email: string
  full_name: string
  role: string | null
  module_access: string[] | null
  created_at: string
}

export default function UserManagement({ initialUsers }: { initialUsers: UserData[] }) {
  const [users, setUsers] = useState<UserData[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  
  const [saving, setSaving] = useState(false)
  const [editRole, setEditRole] = useState('')
  const [editModules, setEditModules] = useState<string[]>([])

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const openEditor = (user: UserData) => {
    setSelectedUser(user)
    setEditRole(user.role || 'personel')
    setEditModules(user.module_access || [])
  }

  const toggleModule = (modId: string) => {
    setEditModules(prev => 
      prev.includes(modId) 
        ? prev.filter(m => m !== modId)
        : [...prev, modId]
    )
  }

  const saveChanges = async () => {
    if (!selectedUser) return
    setSaving(true)
    
    const res = await updateUserAccess(selectedUser.id, editRole, editModules)
    if (res.success) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: editRole, module_access: editModules } : u))
      setSelectedUser(null)
    } else {
      alert("Hata oluştu: " + res.error)
    }
    
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-8 w-full h-full animate-in fade-in zoom-in-95 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10 w-full">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <UserCog className="text-primary" size={32} /> Kullanıcı & Yetki Yönetimi
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm font-medium">Firmanızdaki kullanıcıları, rollerini ve sistem yetkilerini yönetin.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="İsim veya e-posta ile ara..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-card/40 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground w-64 backdrop-blur-md"
          />
        </div>
      </div>

      <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-6 lg:p-8 backdrop-blur-xl flex flex-col shadow-lg relative overflow-hidden w-full flex-1">
        <div className="w-full overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs font-black uppercase tracking-widest text-muted-foreground">
                <th className="pb-4 pl-2">Kullanıcı</th>
                <th className="pb-4">E-posta</th>
                <th className="pb-4">Mevcut Rol</th>
                <th className="pb-4">Yetki (Modüller)</th>
                <th className="pb-4 text-right pr-2">İşlem</th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold">
              {filteredUsers.map(u => {
                const isPending = !u.role || u.role === 'pending' || (!u.module_access || u.module_access.length === 0);
                
                return (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group">
                    <td className="py-4 pl-2 font-black text-foreground">{u.full_name || 'İsimsiz'}</td>
                    <td className="py-4 text-muted-foreground">{u.email}</td>
                    <td className="py-4">
                      {isPending && u.role !== 'admin' ? (
                         <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-max">
                           <ShieldAlert size={12} /> Onay Bekliyor
                         </span>
                      ) : (
                         <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-[10px] font-black uppercase tracking-wider">
                           {u.role}
                         </span>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.role === 'admin' ? (
                          <span className="text-[10px] text-muted-foreground">Tüm Modüller</span>
                        ) : u.module_access && u.module_access.length > 0 ? (
                          u.module_access.map(m => (
                            <span key={m} className="px-2 py-0.5 bg-background border border-border/50 rounded text-[10px] text-muted-foreground uppercase">{m}</span>
                          ))
                        ) : (
                          <span className="text-[10px] text-destructive">Erişim Yok</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-right pr-2">
                       <button onClick={() => openEditor(u)} className="px-4 py-1.5 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors border border-primary/20">
                         Yetkileri Düzenle
                       </button>
                    </td>
                  </tr>
                )
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">Kullanıcı bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Düzenleme Modalı */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-card w-full max-w-lg rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
              
              <div className="p-6 border-b border-border/50 flex items-start justify-between">
                 <div>
                   <h2 className="text-xl font-black text-foreground">Yetki & Rol Düzenle</h2>
                   <p className="text-sm text-muted-foreground mt-1">{selectedUser.full_name} ({selectedUser.email})</p>
                 </div>
                 <button onClick={() => setSelectedUser(null)} className="p-2 text-muted-foreground hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
              </div>

              <div className="p-6 flex flex-col gap-6">
                 <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Rol / Ünvan</label>
                    <select 
                      value={editRole} 
                      onChange={e => setEditRole(e.target.value)}
                      className="w-full bg-background border border-border/50 text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="pending">Onay Bekliyor (Erişimsiz)</option>
                      <option value="personel">Personel</option>
                      <option value="admin">Yönetici (Admin)</option>
                      <option value="musteri">Müşteri</option>
                      <option value="tedarikci">Tedarikçi</option>
                    </select>
                 </div>

                 {editRole !== 'admin' && (
                   <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Erişilebilecek Modüller</label>
                      <div className="grid grid-cols-2 gap-3">
                         {[
                           { id: 'dashboard', label: 'Genel Bakış' },
                           { id: 'production', label: 'Üretim Modülü' },
                           { id: 'inventory', label: 'Stok Yönetimi' },
                           { id: 'hr', label: 'PDKS & İK' },
                         ].map(mod => (
                           <div 
                             key={mod.id} 
                             onClick={() => toggleModule(mod.id)}
                             className={`cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-colors ${editModules.includes(mod.id) ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(62,207,142,0.1)]' : 'bg-background border-border/50 hover:border-white/20'}`}
                           >
                              <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${editModules.includes(mod.id) ? 'bg-primary text-background' : 'border border-muted-foreground/50'}`}>
                                {editModules.includes(mod.id) && <CheckCircle2 size={14} />}
                              </div>
                              <span className="text-sm font-bold text-foreground">{mod.label}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {editRole === 'admin' && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 text-primary text-sm font-bold">
                       <CheckCircle2 size={20} />
                       Yönetici (Admin) rolü otomatik olarak tüm modüllere erişebilir.
                    </div>
                 )}
              </div>

              <div className="p-6 border-t border-border/50 bg-black/20 flex justify-end gap-3">
                 <button onClick={() => setSelectedUser(null)} className="px-5 py-2.5 text-sm font-bold text-foreground bg-background hover:bg-white/5 border border-border/50 rounded-xl transition-colors">İptal</button>
                 <button 
                   onClick={saveChanges} 
                   disabled={saving}
                   className="px-5 py-2.5 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-50"
                 >
                   {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                 </button>
              </div>

           </div>
        </div>
      )}
    </div>
  )
}
