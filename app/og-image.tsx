import { ImageResponse } from "next/og";

export const alt =
  "Dime qu\u00E9 tomas y te dir\u00E9 qui\u00E9n eres | Dunkin' Colombia";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #f8f1ea 0%, #f7e6ef 42%, #ffd0b0 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 78% 18%, rgba(255,122,0,0.38) 0%, rgba(255,122,0,0) 28%), radial-gradient(circle at 86% 72%, rgba(243,74,167,0.3) 0%, rgba(243,74,167,0) 26%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 44,
          top: 0,
          bottom: 0,
          width: 84,
          background:
            "linear-gradient(180deg, #f34aa7 0%, #ef6f6c 50%, #f34aa7 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 56,
          top: 24,
          bottom: 24,
          width: 60,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#ff9a1f",
          fontSize: 34,
          fontWeight: 900,
          letterSpacing: "-0.08em",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}
      >
        <span>{"DUNKIN'"}</span>
        <span>{"DUNKIN'"}</span>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          height: "100%",
          width: "100%",
          padding: "68px 96px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 690,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              width: "fit-content",
              marginBottom: 28,
              padding: "12px 20px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.76)",
              border: "1px solid rgba(230,200,179,0.9)",
              color: "#b86b2c",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {"Campa\u00F1a Dunkin' Colombia"}
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#442214",
              fontSize: 86,
              lineHeight: 0.88,
              fontWeight: 900,
              letterSpacing: "-0.08em",
              textTransform: "uppercase",
            }}
          >
            <span>Dime qu\u00E9</span>
            <span>Tomas</span>
            <span style={{ color: "#ff7a00" }}>Y te dir\u00E9</span>
            <span>Qui\u00E9n eres</span>
          </div>
          <p
            style={{
              marginTop: 28,
              maxWidth: 620,
              color: "#5b4336",
              fontSize: 30,
              lineHeight: 1.35,
            }}
          >
            {"Descubre la bebida de Dunkin' Colombia que mejor conecta con tu"}
            personalidad en solo 4 preguntas.
          </p>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 320,
            height: 420,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: 999,
              background:
                "radial-gradient(circle, rgba(255,208,170,0.9) 0%, rgba(248,105,168,0.32) 44%, rgba(255,255,255,0) 72%)",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 238,
              height: 300,
              borderRadius: 42,
              background:
                "linear-gradient(180deg, #f8efe3 0%, #f1ddc6 36%, #ddd0c3 100%)",
              boxShadow: "0 28px 55px rgba(102,66,30,0.16)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -10,
                width: 186,
                height: 52,
                borderRadius: 999,
                background: "#fff8ef",
                border: "6px solid rgba(255,255,255,0.7)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 34,
                width: 180,
                height: 18,
                borderRadius: 999,
                background: "rgba(255,255,255,0.55)",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 10,
                height: 206,
                borderRadius: 999,
                background: "#ff7a00",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: 28,
                color: "#ff7a00",
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: "-0.08em",
                writingMode: "vertical-rl",
              }}
            >
              {"DUNKIN'"}
            </span>
          </div>
        </div>
      </div>
    </div>,
    size
  );
}
