
'use client';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, HeartHandshake, ChevronDown, LogOut, UserRound } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const user = session?.user;
  async function logout() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message || 'Could not sign out');
        return;
      }
      toast.success('You have signed out');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not sign out');
    }
  }
  return (
    <header style={{ borderBottom: '1px solid var(--line)', background: 'var(--bg)' }}>
      <nav className="container flex h-[76px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight">
          <span
            className="rounded-xl p-2"
            style={{ background: 'var(--lime)', color: 'var(--green)' }}
          >
            <HeartHandshake size={23} />
          </span>
          kindora<span style={{ color: 'var(--green)' }}>.</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
          <Link href="/events">Upcoming Events</Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full border p-2"
            style={{ borderColor: 'var(--line)' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <div className="group relative">
              <button
                className="flex items-center gap-2 rounded-full border p-1.5"
                style={{ borderColor: 'var(--line)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
                  }
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="hidden text-sm sm:block">{user.name}</span>
                <ChevronDown size={15} />
              </button>
              <div
                className="invisible absolute right-0 top-full z-30 mt-2 w-52 rounded-2xl border p-2 opacity-0 shadow-xl group-hover:visible group-hover:opacity-100"
                style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
              >
                <p className="px-3 py-2 text-xs muted">{user.email}</p>
                {[
                  ['Create Event', '/create-event'],
                  ['Manage Events', '/manage-events'],
                  ['Joined Events', '/joined-events'],
                  ['Profile', '/profile'],
                ].map(([n, u]) => (
                  <Link
                    key={u}
                    href={u}
                    className="block rounded-xl px-3 py-2 text-sm hover:bg-black/5"
                  >
                    {n}
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="btn text-sm">
              Login <UserRound size={16} />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
