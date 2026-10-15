import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
export const dynamic = "force-static";
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#0d0f11",
        color: "#ecedef",
        padding: "64px 76px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
        }}
      >
        <span>{site.name}</span>
        <span style={{ color: "#a1a7ae", fontSize: 18 }}>
          SOFTWARE / SYSTEMS / INFRASTRUCTURE
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 68, letterSpacing: -3, lineHeight: 1.1 }}>
          Building software for
        </div>
        <div
          style={{
            fontSize: 68,
            letterSpacing: -3,
            lineHeight: 1.1,
            color: "#a1a7ae",
          }}
        >
          complex, real-world problems.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 26,
          borderTop: "1px solid #292d32",
          fontSize: 21,
          color: "#adc0d4",
        }}
      >
        <span>{site.role}</span>
        <span>{site.location}</span>
      </div>
    </div>,
    size,
  );
}
