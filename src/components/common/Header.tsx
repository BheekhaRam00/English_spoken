"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
};

export default function Header({
  title,
  subtitle,
  backHref = "/"
}: HeaderProps) {
  return (
    <header
      className="fade-in"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "28px"
      }}
    >
      <Link href={backHref}>
        <button
          className="secondary-button"
          style={{
            width: "54px",
            height: "54px",
            padding: 0,
            borderRadius: "18px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ArrowLeft size={22} />
        </button>
      </Link>

      <div>
        <h1
          className="page-title"
          style={{
            marginBottom: subtitle ? "4px" : 0,
            fontSize: "34px"
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.6
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
