import {
  Home,
  LayoutDashboard,
  Inbox,
  Package,
  FileText,
  Users,
  MessageSquare,
  Calendar,
  HelpCircle,
  Settings,
  type LucideIcon,
} from 'lucide-react';

// Navigation items shown in the left sidebar (mirrors the mockup).
const navItems: { label: string; icon: LucideIcon }[] = [
  { label: 'Home', icon: Home },
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Inbox', icon: Inbox },
  { label: 'Products', icon: Package },
  { label: 'Invoices', icon: FileText },
  { label: 'Customers', icon: Users },
  { label: 'Chat Room', icon: MessageSquare },
  { label: 'Calendar', icon: Calendar },
  { label: 'Help Center', icon: HelpCircle },
  { label: 'Settings', icon: Settings },
];

// Calendar is the only active screen in this demo.
const activeItem = 'Calendar';

// Static dark sidebar from the reference layout. Presentational only.
export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-[#373a52] text-slate-300 md:flex">
      <div className="px-6 py-6 text-lg font-bold tracking-[0.2em] text-white">
        IMPEKABLE
      </div>
      <nav className="mt-2 flex flex-col">
        {navItems.map(({ label, icon: Icon }) => (
          <a
            key={label}
            href="#"
            aria-current={label === activeItem ? 'page' : undefined}
            className={`flex items-center gap-3 px-6 py-3 text-sm transition ${
              label === activeItem
                ? 'bg-black/20 font-medium text-white'
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon size={18} className="opacity-80" />
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
