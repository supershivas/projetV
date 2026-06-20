export function Header({ selectionCount, onViewComparison }) {
  return (
    <header className="bg-sidebar-bg border-b border-sidebar-border h-[52px] flex items-center px-4 gap-3 flex-shrink-0 z-40 sticky top-0">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
          <svg className="w-3.5 h-3.5" fill="white" viewBox="0 0 32 32">
            <path d="M6 20a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm16 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
            <path d="M28 18l-2-6a1 1 0 0 0-.9-.6H7.5l-1.8 4.4A2 2 0 0 0 4 18v3h2a3 3 0 0 1 6 0h8a3 3 0 0 1 6 0h2v-3z" opacity="0.95" />
            <path d="M9 14l1.2-3h11.6l1.2 3H9z" fill="#C0392B" />
          </svg>
        </div>
        <span className="font-semibold text-sidebar-fg text-sm">AutoCompare</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {selectionCount > 0 && (
          <button
            onClick={onViewComparison}
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          >
            Comparer ({selectionCount})
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}
