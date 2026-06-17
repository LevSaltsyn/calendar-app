import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { CalendarView } from './components/CalendarView';

/**
 * App shell: dark sidebar + top bar + the calendar screen, reproducing the
 * Impekable reference layout.
 */
export function App() {
  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto px-8 py-6">
          <h1 className="mb-6 text-3xl font-light text-slate-700">Calendar</h1>
          <CalendarView />
        </main>
      </div>
    </div>
  );
}
