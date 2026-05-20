"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  House,
  BookOpen,
  Mic,
  ChartColumn,
  Settings
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: House
  },

  {
    label: "Learn",
    href: "/learn",
    icon: BookOpen
  },

  {
    label: "Practice",
    href: "/practice",
    icon: Mic
  },

  {
    label: "Progress",
    href: "/progress",
    icon: ChartColumn
  },

  {
    label: "Settings",
    href: "/settings",
    icon: Settings
  }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: "18px",
        left: "50%",

        transform: "translateX(-50%)",

        width: "calc(100% - 24px)",
        maxWidth: "720px",

        zIndex: 999
      }}
    >
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          padding: "10px",

          borderRadius: "28px",

          background:
            "rgba(15,23,42,0.88)",

          backdropFilter: "blur(18px)",

          WebkitBackdropFilter:
            "blur(18px)",

          boxShadow:
            "0 10px 40px rgba(0,0,0,0.32)"
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1
              }}
            >
              <button
                style={{
                  width: "100%",

                  display: "flex",
                  flexDirection: "column",

                  alignItems: "center",
                  justifyContent: "center",

                  gap: "6px",

                  padding:
                    "12px 6px",

                  borderRadius: "20px",

                  background: active
                    ? "linear-gradient(90deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))"
                    : "transparent",

                  color: active
                    ? "#ffffff"
                    : "rgba(255,255,255,0.68)",

                  transition:
                    "all 0.2s ease"
                }}
              >
                <Icon size={22} />

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: active
                      ? 700
                      : 500
                  }}
                >
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
