import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 34,
          fontWeight: 800,
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "16px",
          fontFamily: "sans-serif",
          letterSpacing: "-0.05em",
        }}
      >
        TF
      </div>
    ),
    {
      ...size,
    }
  );
}
