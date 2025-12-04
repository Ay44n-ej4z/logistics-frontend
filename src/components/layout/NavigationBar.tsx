'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { UserRole } from '@/types';

interface SubMenuItem {
  name: string;
  href: string;
}

interface ModuleItem {
  name: string;
  href: string;
  icon: string;
  submenu: SubMenuItem[];
}

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  hasSubmenu: boolean;
  isMasterData?: boolean;
  isOperations?: boolean;
  isFinance?: boolean;
  submenu?: SubMenuItem[];
}

interface NavigationBarProps {
  userRole: UserRole;
}

export default function NavigationBar({ userRole }: NavigationBarProps) {
  const pathname = usePathname();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveSubmenu(null);
        setActiveModule(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 🔹 OPERATIONS MODULES
  const operationsModules: ModuleItem[] = [
    {
      name: 'Jobs',
      href: '/dashboard/jobs',
      icon: 'mdi:briefcase',
      submenu: [
        { name: 'View All', href: '/dashboard/jobs' },
        { name: 'Create New', href: '/dashboard/jobs/create' },
      ],
    },
    {
      name: 'Master AWB',
      href: '/dashboard/master-awbs',
      icon: 'mdi:file-document',
      submenu: [
        { name: 'View All', href: '/dashboard/master-awbs' },
        { name: 'Create New', href: '/dashboard/master-awbs/create' },
      ],
    },
    {
      name: 'House AWB',
      href: '/dashboard/house-awbs',
      icon: 'mdi:file-document-outline',
      submenu: [
        { name: 'View All', href: '/dashboard/house-awbs' },
        { name: 'Create New', href: '/dashboard/house-awbs/create' },
      ],
    },
    {
      name: 'Quick Actions',
      href: '/dashboard/quick-actions',
      icon: 'mdi:lightning-bolt',
      submenu: [
        // { name: 'Job + MAWB + HAWB', href: '/dashboard/quick-actions' },
      ],
    },
  ];

  // 🔹 MASTER DATA MODULES
  const masterDataModules: ModuleItem[] = [
    {
      name: 'Parties',
      href: '/dashboard/parties',
      icon: 'mdi:account-multiple',
      submenu: [
        { name: 'View All', href: '/dashboard/parties' },
        { name: 'Create New', href: '/dashboard/parties/create' },
      ],
    },
    {
      name: 'Users',
      href: '/dashboard/users',
      icon: 'mdi:account-group',
      submenu: [
        { name: 'View All', href: '/dashboard/users' },
        { name: 'Create New', href: '/dashboard/users/create' },
      ],
    },
    {
      name: 'Countries',
      href: '/dashboard/countries',
      icon: 'mdi:earth',
      submenu: [
        { name: 'View All', href: '/dashboard/countries' },
        { name: 'Create New', href: '/dashboard/countries/create' },
      ],
    },
    {
      name: 'Cities',
      href: '/dashboard/cities',
      icon: 'mdi:city',
      submenu: [
        { name: 'View All', href: '/dashboard/cities' },
        { name: 'Create New', href: '/dashboard/cities/create' },
      ],
    },
    {
      name: 'Ports/Airports',
      href: '/dashboard/ports-airports',
      icon: 'mdi:airplane',
      submenu: [
        { name: 'View All', href: '/dashboard/ports-airports' },
        { name: 'Create New', href: '/dashboard/ports-airports/create' },
      ],
    },
    {
      name: 'Carriers',
      href: '/dashboard/carriers',
      icon: 'mdi:truck-delivery',
      submenu: [
        { name: 'View All', href: '/dashboard/carriers' },
        { name: 'Create New', href: '/dashboard/carriers/create' },
      ],
    },
    {
      name: 'Commodities',
      href: '/dashboard/commodities',
      icon: 'mdi:package-variant',
      submenu: [
        { name: 'View All', href: '/dashboard/commodities' },
        { name: 'Create New', href: '/dashboard/commodities/create' },
      ],
    },
    {
      name: 'Items',
      href: '/dashboard/items',
      icon: 'mdi:cube',
      submenu: [
        { name: 'View All', href: '/dashboard/items' },
        { name: 'Create New', href: '/dashboard/items/create' },
      ],
    },
    {
      name: 'Mode of Transport',
      href: '/dashboard/mode-of-transport',
      icon: 'mdi:truck',
      submenu: [
        { name: 'View All', href: '/dashboard/mode-of-transport' },
        { name: 'Create New', href: '/dashboard/mode-of-transport?create=true' },
      ],
    },
    {
      name: 'Lists',
      href: '/dashboard/lists',
      icon: 'mdi:format-list-bulleted',
      submenu: [
        { name: 'View All', href: '/dashboard/lists' },
        { name: 'Create New', href: '/dashboard/lists/create' },
      ],
    },
    {
      name: 'Cost Centers',
      href: '/dashboard/cost-centers',
      icon: 'mdi:view-grid',
      submenu: [
        { name: 'View All', href: '/dashboard/cost-centers' },
        { name: 'Create New', href: '/dashboard/cost-centers/create' },
      ],
    },
  ];

  // 🔹 FINANCE MODULES (added)
  const financeModules: ModuleItem[] = [
    {
      name: "Invoices",
      href: "/dashboard/invoices",
      icon: "mdi:file-document",
      submenu: [
        { name: "View All", href: "/dashboard/invoices" },
        { name: "Create New", href: "/dashboard/invoices/create" },
      ],
    },
    {
      name: "Transactions",
      href: "/dashboard/transactions",
      icon: "mdi:currency-usd",
      submenu: [
        { name: "View All", href: "/dashboard/transactions" },
        { name: "Create New", href: "/dashboard/transactions/create" },
      ],
    },
    {
      name: "Reconcile",
      href: "/dashboard/reconcile",
      icon: "mdi:check",
      submenu: [
        { name: "View All", href: "/dashboard/reconcile" },
        { name: "Create New", href: "/dashboard/reconcile/create" },
      ],
    },
  ];

  // 🔹 TOP NAV ITEMS
  const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'mdi:view-dashboard',
      hasSubmenu: false,
    },
    {
      name: 'Operations',
      href: '#',
      icon: 'mdi:clipboard-flow',
      hasSubmenu: true,
      isOperations: true,
    },
    {
      name: 'Resources',
      href: '#',
      icon: 'mdi:database',
      hasSubmenu: true,
      isMasterData: true,
    },
    {
      name: "Finance",
      href: "#",
      icon: "mdi:currency-usd",
      hasSubmenu: true,
      isFinance: true,
    },
    {
      name: 'Approvals',
      href: '/dashboard/approvals',
      icon: 'mdi:check-circle',
      hasSubmenu: true,
      submenu: [
        { name: 'View All', href: '/dashboard/approvals' },
        { name: 'Create New', href: '/dashboard/approvals/create' },
      ],
    },
    {
      name: "Track / Reports",
      href: "#",
      icon: "mdi:package-variant",
      hasSubmenu: true,
      submenu: [
        { name: "Track Shipments", href: "/dashboard/track" },
        { name: "Reports", href: "/dashboard/reports" },
      ],
    },
  ];

  // 🔹 REUSABLE SUBMENU RENDERER
  const renderModuleMenu = (modules: ModuleItem[]) => (
    <div className="relative">
      {modules.map((module) => (
        <div
          key={module.name}
          className="relative group"
          onMouseEnter={() => setActiveModule(module.name)}
          onMouseLeave={() => setActiveModule(null)}
        >
          <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600">
            <div className="flex items-center gap-2">
              <Icon icon={module.icon} className="w-4 h-4" />
              <span>{module.name}</span>
            </div>
            <Icon icon="mdi:chevron-right" className="w-4 h-4" />
          </div>

          {activeModule === module.name && (
            <div className="absolute left-full top-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                {module.submenu.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    onClick={() => {
                      setActiveSubmenu(null);
                      setActiveModule(null);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // 🔹 MAIN NAVBAR UI
  return (
    <nav className="bg-white border-b border-gray-200" ref={navRef}>
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-center flex-wrap items-center gap-2 sm:gap-3 py-3">
          {navigationItems.map((item) => (
            <div key={item.name} className="relative flex-shrink-0">
              {item.hasSubmenu ? (
                <button
                  onClick={() =>
                    setActiveSubmenu(activeSubmenu === item.name ? null : item.name)
                  }
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                    ${
                      item.href !== '#' &&
                      ((item.href === '/dashboard' && pathname === '/dashboard') ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href)))
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                >
                  <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm">
                    <Icon icon={item.icon} className="w-5 h-5 text-current" />
                  </span>
                  <span className="hidden sm:inline">{item.name}</span>
                  <Icon
                    icon="mdi:chevron-down"
                    className={`hidden sm:inline w-4 h-4 transition-transform duration-200 ${
                      activeSubmenu === item.name ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                    ${
                      (item.href === '/dashboard' && pathname === '/dashboard') ||
                      (item.href !== '/dashboard' && pathname.startsWith(item.href))
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                >
                  <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm">
                    <Icon icon={item.icon} className="w-5 h-5 text-current" />
                  </span>
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              )}

              {/* Submenu dropdown */}
              {item.hasSubmenu && activeSubmenu === item.name && (
                <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {item.isOperations
                      ? renderModuleMenu(operationsModules)
                      : item.isMasterData
                      ? renderModuleMenu(masterDataModules)
                      : item.isFinance
                      ? renderModuleMenu(financeModules)
                      : item.submenu?.map((submenuItem) => (
                          <Link
                            key={submenuItem.href}
                            href={submenuItem.href}
                            onClick={() => setActiveSubmenu(null)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          >
                            {submenuItem.name}
                          </Link>
                        ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
