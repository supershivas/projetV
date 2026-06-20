import { useState, useEffect, useRef } from 'react'

const OTHER_APPS = [
  { name: 'Idée', url: 'https://idee-neon.vercel.app/', favicon: 'https://idee-neon.vercel.app/favicon.ico' },
  { name: 'Source', url: 'https://source-sigma-kohl.vercel.app/app', favicon: 'https://source-sigma-kohl.vercel.app/favicon.ico' },
  { name: 'Portfolio', url: 'https://stockportfolio-five.vercel.app/', favicon: 'https://stockportfolio-five.vercel.app/favicon.ico' },
]

export function SettingsModal({ selectionCount, onViewComparison }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-6 h-6 flex items-center justify-center rounded-md text-sidebar-muted hover:text-sidebar-fg hover:bg-sidebar-hover transition-colors"
        title="Paramètres"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 w-52 bg-[#2a2a2e] border border-sidebar-border rounded-lg shadow-xl py-2">
          <p className="px-3 pb-1 text-[10px] font-semibold text-sidebar-muted uppercase tracking-wider">Autres apps</p>
          {OTHER_APPS.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-sidebar-fg hover:bg-sidebar-hover transition-colors"
              onClick={() => setOpen(false)}
            >
              <img
                src={app.favicon}
                alt={app.name}
                width={14}
                height={14}
                className="rounded-sm flex-shrink-0"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              {app.name}
            </a>
          ))}

          {selectionCount > 0 && (
            <>
              <div className="my-1.5 border-t border-sidebar-border" />
              <div className="px-2">
                <button
                  onClick={() => { onViewComparison(); setOpen(false) }}
                  className="w-full flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                >
                  Comparer ({selectionCount})
                  <svg className="w-3.5 h-3.5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
