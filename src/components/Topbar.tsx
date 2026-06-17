import { Search, Aperture, MessageSquare, Bell, ChevronDown } from 'lucide-react';
import avatar from '../assets/avatar.png';

// Static top bar from the reference layout: search field, action icons and
// the signed-in user. Presentational only.
export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-6">
      {/* Search field */}
      <div className="relative max-w-md flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          placeholder="Search transactions, invoices or help"
          className="w-full rounded-md border border-transparent bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-600 outline-none focus:border-slate-200"
        />
      </div>

      {/* Action icons + signed-in user */}
      <div className="ml-auto flex items-center gap-4 text-slate-400">
        <Aperture size={20} />
        <MessageSquare size={20} />
        <Bell size={20} />
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="hidden sm:inline">John Doe</span>
          <ChevronDown size={16} className="text-slate-400" />
          <img
            src={avatar}
            alt="John Doe"
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
