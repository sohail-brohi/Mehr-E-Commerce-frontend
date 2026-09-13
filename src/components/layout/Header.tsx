import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useShop } from "@/store/shop";
import { useLockBody } from "@/hooks/use-lock-body";
import { Logo } from "@/components/layout/Logo";

const NAV = [
  { to: "/women", label: "Women" },
  { to: "/kids", label: "Kids" },
  { to: "/shawls", label: "Shawls" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/collections", label: "Collections" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, wishlist, setCartOpen, setSearchOpen, user, isAdmin, signOut } = useShop();
  const pathname = useLocation().pathname;
  const overHero = pathname === "/";
  useLockBody(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const solid = scrolled || !overHero;
  const tone = solid ? "text-foreground" : "text-ivory";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-out ${
          solid
            ? "border-b border-border/60 bg-background/85 backdrop-blur-xl"
            : "border-b border-transparent"
        } ${tone}`}
      >
        <div
          className={`mx-auto flex max-w-[1600px] items-center px-4 transition-all duration-700 sm:px-6 lg:px-10 ${
            solid ? "h-16" : "h-20 md:h-24"
          }`}
        >
          <div className="flex min-w-0 flex-1 items-center justify-start">
            <button
              type="button"
              aria-label="Menu"
              className="flex h-8 w-8 shrink-0 items-center justify-center sm:h-9 sm:w-9 xl:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={1.2} />
            </button>
            <nav className="hidden min-w-0 items-center gap-3 xl:flex 2xl:gap-5">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rule-link shrink-0 whitespace-nowrap text-[0.625rem] uppercase tracking-[0.14em]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            to="/"
            aria-label="MEHR home"
            className="shrink-0 px-2 text-[1.15rem] sm:px-3 sm:text-[1.35rem] md:text-[1.55rem]"
          >
            <Logo />
          </Link>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-0 sm:gap-0.5">
            <button
              type="button"
              aria-label="Search"
              className="flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem]" strokeWidth={1.2} />
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9">
              <Heart className="h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem]" strokeWidth={1.2} />
              {wishlist.length > 0 && (
                <span className="absolute right-0 top-0.5 text-[0.55rem]">{wishlist.length}</span>
              )}
            </Link>
            <AccountMenu user={user} isAdmin={isAdmin} signOut={signOut} />
            <button type="button" aria-label="Cart" className="relative flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9" onClick={() => setCartOpen(true)}>
              <ShoppingBag className="h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem]" strokeWidth={1.2} />
              {count > 0 && (
                <span className="absolute right-0 top-0.5 text-[0.55rem]">{count}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 bg-charcoal/40" onClick={() => setMenuOpen(false)} />
            <motion.nav
              className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-background px-7 pb-10 pt-7"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between">
                <Link to="/" aria-label="MEHR home" className="text-xl" onClick={() => setMenuOpen(false)}>
                  <Logo />
                </Link>
                <button type="button" aria-label="Close menu" className="flex h-11 w-11 items-center justify-center" onClick={() => setMenuOpen(false)}>
                  <X className="h-5 w-5" strokeWidth={1.2} />
                </button>
              </div>
              <div className="mt-12 flex flex-col">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.06, duration: 0.6 }}
                  >
                    <Link to={item.to} className="font-display block border-b py-5 text-3xl">
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="label-xs mt-auto flex flex-col gap-4 pt-10 text-muted-foreground">
                {user ? (
                  <>
                    <Link to="/account">Account</Link>
                    <Link to="/track">Track order</Link>
                    <Link to="/wishlist">Wishlist</Link>
                    <Link to="/try-on">Try on</Link>
                    {isAdmin && <Link to="/admin">Studio dashboard</Link>}
                    <button type="button" className="w-fit text-left" onClick={() => void signOut()}>
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/account/login">Sign in</Link>
                    <Link to="/account/login?mode=register">Create account</Link>
                    <Link to="/account">My orders</Link>
                    <Link to="/wishlist">Wishlist</Link>
                    <Link to="/track">Track order</Link>
                  </>
                )}
                <Link to="/contact">Contact</Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AccountMenu({
  user,
  isAdmin,
  signOut,
}: {
  user: { name: string; email: string } | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const pathname = useLocation().pathname;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9"
        onClick={() => setOpen((v) => !v)}
      >
        <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.2} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-[70] w-56 border border-border bg-ivory py-3 text-charcoal shadow-editorial"
          >
            {user ? (
              <>
                <div className="border-b px-4 pb-3">
                  <p className="truncate text-sm">{user.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <nav className="label-xs mt-2 flex flex-col">
                  <Link to="/account" role="menuitem" className="px-4 py-2.5 hover:bg-cream" onClick={() => setOpen(false)}>
                    Account
                  </Link>
                  <Link to="/track" role="menuitem" className="px-4 py-2.5 hover:bg-cream" onClick={() => setOpen(false)}>
                    Track order
                  </Link>
                  <Link to="/wishlist" role="menuitem" className="px-4 py-2.5 hover:bg-cream" onClick={() => setOpen(false)}>
                    Wishlist
                  </Link>
                  <Link to="/try-on" role="menuitem" className="px-4 py-2.5 hover:bg-cream" onClick={() => setOpen(false)}>
                    Try on
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" role="menuitem" className="px-4 py-2.5 hover:bg-cream" onClick={() => setOpen(false)}>
                      Studio
                    </Link>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    className="px-4 py-2.5 text-left hover:bg-cream"
                    onClick={() => {
                      setOpen(false);
                      void signOut();
                    }}
                  >
                    Sign out
                  </button>
                </nav>
              </>
            ) : (
              <nav className="label-xs flex flex-col">
                <Link to="/account/login" role="menuitem" className="px-4 py-2.5 hover:bg-cream" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link
                  to="/account/login?mode=register"
                  role="menuitem"
                  className="px-4 py-2.5 hover:bg-cream"
                  onClick={() => setOpen(false)}
                >
                  Create account
                </Link>
                <Link to="/account" role="menuitem" className="px-4 py-2.5 hover:bg-cream" onClick={() => setOpen(false)}>
                  My orders
                </Link>
                <Link to="/wishlist" role="menuitem" className="px-4 py-2.5 hover:bg-cream" onClick={() => setOpen(false)}>
                  Wishlist
                </Link>
              </nav>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
