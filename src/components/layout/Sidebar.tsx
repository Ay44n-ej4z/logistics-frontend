"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useAppSelector } from "@/hooks/redux";
import { UserRole } from "@/types";
import { canAccessModule, canCreate } from "@/lib/permissions";

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  hasSubmenu: boolean;
  submenu?: Array<{
    name: string;
    href: string;
  }>;
}

// Role-based navigation items
const getNavigationItems = (userRole: UserRole): NavigationItem[] => {
  const baseItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "mdi:view-dashboard",
      hasSubmenu: false,
    },
  ];

  const roleSpecificItems = {
    [UserRole.ADMIN]: [
      // Operations modules
      {
        name: "Jobs",
        href: "/dashboard/jobs",
        icon: "mdi:briefcase",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/jobs" },
          { name: "Create New", href: "/dashboard/jobs/create" },
        ],
      },
      {
        name: "Mode of Transport",
        href: "/dashboard/mode-of-transport",
        icon: "mdi:truck-fast",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/mode-of-transport" },
          { name: "Create New", href: "/dashboard/mode-of-transport?create=true" },
        ],
      },
      {
        name: "Master AWB",
        href: "/dashboard/master-awbs",
        icon: "mdi:file-document",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/master-awbs" },
          { name: "Create New", href: "/dashboard/master-awbs/create" },
        ],
      },
      {
        name: "House AWB",
        href: "/dashboard/house-awbs",
        icon: "mdi:file-document-outline",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/house-awbs" },
          { name: "Create New", href: "/dashboard/house-awbs/create" },
        ],
      },
      {
        name: "Quick Actions",
        href: "/dashboard/quick-actions",
        icon: "mdi:lightning-bolt",
        hasSubmenu: false,
      },
      {
        name: "Items",
        href: "/dashboard/items",
        icon: "mdi:cube",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/items" },
          { name: "Create New", href: "/dashboard/items/create" },
        ],
      },
      {
        name: "Cost Centers",
        href: "/dashboard/cost-centers",
        icon: "mdi:view-grid",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/cost-centers" },
          { name: "Create New", href: "/dashboard/cost-centers/create" },
        ],
      },
      // Accounts modules
      {
        name: "Invoices",
        href: "/dashboard/invoices",
        icon: "mdi:file-document",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/invoices" },
          { name: "Create New", href: "/dashboard/invoices/create" },
        ],
      },
      {
        name: "Approvals",
        href: "/dashboard/approvals",
        icon: "mdi:check-circle",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/approvals" },
          { name: "Create New", href: "/dashboard/approvals/create" },
        ],
      },
      {
        name: "Lists",
        href: "/dashboard/lists",
        icon: "mdi:format-list-bulleted",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/lists" },
          { name: "Create New", href: "/dashboard/lists/create" },
        ],
      },
      // Finance modules
      {
        name: "Transactions",
        href: "/dashboard/transactions",
        icon: "mdi:currency-usd",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/transactions" },
          { name: "Create New", href: "/dashboard/transactions/create" },
        ],
      },
      {
        name: "Reconcile",
        href: "/dashboard/reconcile",
        icon: "mdi:check",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/reconcile" },
          { name: "Create New", href: "/dashboard/reconcile/create" },
        ],
      },
      // Customer modules
      {
        name: "Track",
        href: "/dashboard/track",
        icon: "mdi:package-variant",
        hasSubmenu: false,
      },
      // System modules
      {
        name: "Users",
        href: "/dashboard/users",
        icon: "mdi:account-multiple",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/users" },
          { name: "Create New", href: "/dashboard/users/create" },
        ],
      },
      // Master Data modules
      {
        name: "Parties",
        href: "/dashboard/parties",
        icon: "mdi:account-group",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/parties" },
          { name: "Create New", href: "/dashboard/parties/create" },
        ],
      },
      {
        name: "Countries",
        href: "/dashboard/countries",
        icon: "mdi:map-marker",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/countries" },
          { name: "Create New", href: "/dashboard/countries/create" },
        ],
      },
      {
        name: "Cities",
        href: "/dashboard/cities",
        icon: "mdi:city",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/cities" },
          { name: "Create New", href: "/dashboard/cities/create" },
        ],
      },
      {
        name: "Ports/Airports",
        href: "/dashboard/ports-airports",
        icon: "mdi:airplane",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/ports-airports" },
          { name: "Create New", href: "/dashboard/ports-airports/create" },
        ],
      },
      {
        name: "Carriers",
        href: "/dashboard/carriers",
        icon: "mdi:truck",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/carriers" },
          { name: "Create New", href: "/dashboard/carriers/create" },
        ],
      },
      {
        name: "Commodities",
        href: "/dashboard/commodities",
        icon: "mdi:package-variant",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/commodities" },
          { name: "Create New", href: "/dashboard/commodities/create" },
        ],
      },
    ],
    [UserRole.OPERATIONS]: [
      {
        name: "Jobs",
        href: "/dashboard/jobs",
        icon: "mdi:briefcase",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/jobs" },
          { name: "Create New", href: "/dashboard/jobs/create" },
        ],
      },
      {
        name: "Master AWB",
        href: "/dashboard/master-awbs",
        icon: "mdi:file-document",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/master-awbs" },
          { name: "Create New", href: "/dashboard/master-awbs/create" },
        ],
      },
      {
        name: "House AWB",
        href: "/dashboard/house-awbs",
        icon: "mdi:file-document-outline",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/house-awbs" },
          { name: "Create New", href: "/dashboard/house-awbs/create" },
        ],
      },
      {
        name: "Quick Actions",
        href: "/dashboard/quick-actions",
        icon: "mdi:lightning-bolt",
        hasSubmenu: false,
      },
      {
        name: "Items",
        href: "/dashboard/items",
        icon: "mdi:cube",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/items" },
          { name: "Create New", href: "/dashboard/items/create" },
        ],
      },
      {
        name: "Cost Centers",
        href: "/dashboard/cost-centers",
        icon: "mdi:view-grid",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/cost-centers" },
          { name: "Create New", href: "/dashboard/cost-centers/create" },
        ],
      },
    ],
    [UserRole.ACCOUNTS]: [
      {
        name: "Invoices",
        href: "/dashboard/invoices",
        icon: "mdi:file-document",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/invoices" },
          { name: "Create New", href: "/dashboard/invoices/create" },
        ],
      },
      {
        name: "Approvals",
        href: "/dashboard/approvals",
        icon: "mdi:check-circle",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/approvals" },
          { name: "Create New", href: "/dashboard/approvals/create" },
        ],
      },
      {
        name: "Lists",
        href: "/dashboard/lists",
        icon: "mdi:format-list-bulleted",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/lists" },
          { name: "Create New", href: "/dashboard/lists/create" },
        ],
      },
    ],
    [UserRole.FINANCE]: [
      {
        name: "Transactions",
        href: "/dashboard/transactions",
        icon: "mdi:currency-usd",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/transactions" },
          { name: "Create New", href: "/dashboard/transactions/create" },
        ],
      },
      {
        name: "Reconcile",
        href: "/dashboard/reconcile",
        icon: "mdi:check",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/reconcile" },
          { name: "Create New", href: "/dashboard/reconcile/create" },
        ],
      },
      {
        name: "Help",
        href: "/dashboard/help",
        icon: "mdi:help-circle",
        hasSubmenu: false,
      },
    ],
    [UserRole.MANAGEMENT]: [
      {
        name: "Jobs",
        href: "/dashboard/jobs",
        icon: "mdi:briefcase",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/jobs" },
          { name: "Create New", href: "/dashboard/jobs/create" },
        ],
      },
      {
        name: "Invoices",
        href: "/dashboard/invoices",
        icon: "mdi:file-document",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/invoices" },
          { name: "Create New", href: "/dashboard/invoices/create" },
        ],
      },
      {
        name: "Approvals",
        href: "/dashboard/approvals",
        icon: "mdi:check-circle",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/approvals" },
          { name: "Create New", href: "/dashboard/approvals/create" },
        ],
      },
      {
        name: "Transactions",
        href: "/dashboard/transactions",
        icon: "mdi:currency-usd",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/transactions" },
          { name: "Create New", href: "/dashboard/transactions/create" },
        ],
      },
      {
        name: "Users",
        href: "/dashboard/users",
        icon: "mdi:account-multiple",
        hasSubmenu: true,
        submenu: [
          { name: "View All", href: "/dashboard/users" },
          { name: "Create New", href: "/dashboard/users/create" },
        ],
      },
    ],
    [UserRole.CUSTOMER]: [
      {
        name: "Track",
        href: "/dashboard/track",
        icon: "mdi:package-variant",
        hasSubmenu: false,
      },
      {
        name: "Invoices",
        href: "/dashboard/invoices",
        icon: "mdi:file-document",
        hasSubmenu: false,
      },
    ],
  };

  return [...baseItems, ...(roleSpecificItems[userRole] || [])];
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Debug logging
  useEffect(() => {
    console.log("Sidebar - User state changed:", user);
  }, [user]);

  // Close submenu when clicking outside (only when collapsed)
  useEffect(() => {
    if (!isCollapsed) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".sidebar-submenu") &&
        !target.closest(".sidebar-item")
      ) {
        setExpandedItems([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollapsed]);

  // Get role-based navigation items
  const navigationItems = getNavigationItems(user?.role || UserRole.ADMIN);
  
  const handleItemClick = useCallback(
    (
      e: React.MouseEvent,
      item: NavigationItem
    ) => {
      e.preventDefault();
      e.stopPropagation();

      if (item.hasSubmenu) {
        setExpandedItems((prev) =>
          prev.includes(item.name)
            ? prev.filter((name) => name !== item.name)
            : [...prev, item.name]
        );
      }
      // Removed else block with router.replace - now handled by Link component
    },
    []
  );
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border-r border-gray-200 min-h-screen transition-all duration-300 flex-shrink-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className={`${isCollapsed ? "p-2" : "p-6"}`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`mb-6 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            isCollapsed ? "w-full flex justify-center" : ""
          }`}
          aria-label="Toggle sidebar"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon
            icon={isCollapsed ? "mdi:menu" : "mdi:menu-open"}
            className="w-6 h-6 text-gray-700"
          />
        </button>

        {/* Navigation */}
        <nav className="space-y-2">
          <div className="mb-4">
            <h2
              className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                isCollapsed ? "hidden" : "block"
              }`}
            >
              {user?.role || "ADMIN"}
            </h2>
          </div>

          {navigationItems.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(item.href + "/");
            const isExpanded = expandedItems.includes(item.name);
            const hasActiveSubmenu = item.submenu?.some(
              (sub) => pathname === sub.href
            );

            return (
              <div key={item.name} className="relative group">
                {item.hasSubmenu ? (
                  <div
                    onClick={(e) => handleItemClick(e, item)}
                    className={`sidebar-item cursor-pointer ${
                      isActive || hasActiveSubmenu
                        ? "sidebar-item-active"
                        : "sidebar-item-inactive"
                    } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? item.name : ""}
                  >
                    <Icon
                      icon={item.icon}
                      className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} ${
                        isActive || hasActiveSubmenu
                          ? "text-primary-600"
                          : "text-gray-400"
                      }`}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 flex-1">{item.name}</span>
                        <Icon
                          icon="mdi:chevron-down"
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`sidebar-item ${
                      isActive || hasActiveSubmenu
                        ? "sidebar-item-active"
                        : "sidebar-item-inactive"
                    } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? item.name : ""}
                  >
                    <Icon
                      icon={item.icon}
                      className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} ${
                        isActive || hasActiveSubmenu
                          ? "text-primary-600"
                          : "text-gray-400"
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="ml-3 flex-1">{item.name}</span>
                    )}
                  </Link>
                )}

                {/* Tooltip on hover when collapsed */}
                {isCollapsed && !isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}

                {/* Submenu */}
                {item.hasSubmenu && (
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={
                          isCollapsed
                            ? { opacity: 0, x: -10 }
                            : { height: 0, opacity: 0 }
                        }
                        animate={
                          isCollapsed
                            ? { opacity: 1, x: 0 }
                            : { height: "auto", opacity: 1 }
                        }
                        exit={
                          isCollapsed
                            ? { opacity: 0, x: -10 }
                            : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.2 }}
                        className={
                          isCollapsed
                            ? "sidebar-submenu absolute left-full top-0 ml-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50"
                            : "overflow-hidden"
                        }
                      >
                        <div
                          className={
                            isCollapsed ? "space-y-1" : "ml-6 mt-1 space-y-1"
                          }
                        >
                          {isCollapsed && (
                            <div className="px-4 py-2 border-b border-gray-100">
                              <p className="text-xs font-semibold text-gray-500 uppercase">
                                {item.name}
                              </p>
                            </div>
                          )}
                          {item.submenu
                            ?.filter((subItem) => {
                              if (subItem.name === "View All") return true;
                              return canCreate(
                                user?.role || UserRole.ADMIN,
                                item.href
                                  .replace("/dashboard/", "")
                                  .replace("/", "")
                              );
                            })
                            .map((subItem) => {
                              const isSubActive = pathname === subItem.href;
                              return (
                                <Link key={subItem.href} href={subItem.href}>
                                  <div
                                    className={`${
                                      isCollapsed ? "px-4 py-2" : "px-3 py-2"
                                    } text-sm rounded-lg transition-colors duration-200 ${
                                      isSubActive
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                                    onClick={() => setExpandedItems([])}
                                  >
                                    {subItem.name}
                                  </div>
                                </Link>
                              );
                            })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}
