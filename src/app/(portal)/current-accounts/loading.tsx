import React from 'react'

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-muted/60 rounded animate-pulse" />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="h-10 w-[400px] bg-muted rounded-md animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-4 bg-muted/20 rounded-xl p-4 border shadow-sm h-[600px]">
            <div className="flex items-center justify-between px-2">
               <div className="h-5 w-24 bg-muted rounded animate-pulse" />
               <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="space-y-4 pt-4">
              {[1, 2].map((j) => (
                <div key={j} className="h-32 w-full bg-muted/40 rounded-xl border animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
