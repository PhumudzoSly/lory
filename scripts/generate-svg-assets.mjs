import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const files = {
  "src-tauri/icons/icon.svg": buildAppIconSvg({ size: 1024, emotion: "idle" }),
  "public/favicon.svg": buildAppIconSvg({ size: 256, emotion: "happy" }),
  "public/brand/buddy-idle.svg": buildBuddySvg({ emotion: "idle" }),
  "public/brand/buddy-happy.svg": buildBuddySvg({ emotion: "happy" }),
  "public/brand/buddy-sleeping.svg": buildBuddySvg({ emotion: "sleeping" }),
  "public/brand/lory-wordmark.svg": buildWordmarkSvg(),
};

await Promise.all(
  Object.entries(files).map(async ([relativePath, content]) => {
    const outputPath = resolve(process.cwd(), relativePath);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, content, "utf8");
    console.log(`wrote ${relativePath}`);
  }),
);

function buildAppIconSvg({ size, emotion }) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n${buildBuddySvg({
    size,
    padding: Math.round(size * 0.08),
    emotion,
  })}`;
}

function buildBuddySvg({ size = 256, padding = 20, emotion = "idle" }) {
  const board = size;
  const face = board - padding * 2;
  const radius = Math.round(face * 0.24);
  const origin = padding;
  const eyeW = Math.round(face * 0.11);
  const eyeH = emotion === "sleeping" ? Math.round(face * 0.04) : Math.round(face * 0.16);
  const eyeY = Math.round(origin + face * (emotion === "sleeping" ? 0.5 : 0.34));
  const eyeLeftX = Math.round(origin + face * 0.28);
  const eyeRightX = Math.round(origin + face * 0.61);
  const blushY = Math.round(origin + face * 0.62);
  const blushW = Math.round(face * 0.16);
  const blushH = Math.round(face * 0.08);
  const mouthY = Math.round(origin + face * 0.68);

  const mouth =
    emotion === "happy"
      ? `<path d="M ${origin + face * 0.38} ${mouthY - face * 0.03} C ${origin + face * 0.42} ${mouthY + face * 0.1}, ${origin + face * 0.58} ${mouthY + face * 0.1}, ${origin + face * 0.62} ${mouthY - face * 0.03}" stroke="#27272a" stroke-width="${Math.max(4, Math.round(face * 0.035))}" stroke-linecap="round" fill="none" />`
      : emotion === "sleeping"
        ? `<circle cx="${origin + face * 0.5}" cy="${mouthY}" r="${Math.round(face * 0.045)}" fill="#27272a" />`
        : `<path d="M ${origin + face * 0.36} ${mouthY} Q ${origin + face * 0.5} ${mouthY + face * 0.11} ${origin + face * 0.64} ${mouthY}" stroke="#27272a" stroke-width="${Math.max(4, Math.round(face * 0.03))}" stroke-linecap="round" fill="none" />`;

  const sleepingEyes =
    emotion === "sleeping"
      ? `
    <path d="M ${eyeLeftX} ${eyeY} Q ${eyeLeftX + eyeW * 0.5} ${eyeY + eyeH} ${eyeLeftX + eyeW} ${eyeY}" stroke="#27272a" stroke-width="${Math.max(4, Math.round(face * 0.03))}" stroke-linecap="round" fill="none" />
    <path d="M ${eyeRightX} ${eyeY} Q ${eyeRightX + eyeW * 0.5} ${eyeY + eyeH} ${eyeRightX + eyeW} ${eyeY}" stroke="#27272a" stroke-width="${Math.max(4, Math.round(face * 0.03))}" stroke-linecap="round" fill="none" />`
      : `
    <ellipse cx="${eyeLeftX + eyeW * 0.5}" cy="${eyeY + eyeH * 0.5}" rx="${eyeW * 0.5}" ry="${eyeH * 0.5}" fill="#27272a" />
    <ellipse cx="${eyeRightX + eyeW * 0.5}" cy="${eyeY + eyeH * 0.5}" rx="${eyeW * 0.5}" ry="${eyeH * 0.5}" fill="#27272a" />
    <ellipse cx="${eyeLeftX + eyeW * 0.7}" cy="${eyeY + eyeH * 0.28}" rx="${Math.max(2, eyeW * 0.12)}" ry="${Math.max(3, eyeH * 0.2)}" fill="#ffffff" />
    <ellipse cx="${eyeRightX + eyeW * 0.7}" cy="${eyeY + eyeH * 0.28}" rx="${Math.max(2, eyeW * 0.12)}" ry="${Math.max(3, eyeH * 0.2)}" fill="#ffffff" />`;

  const zzz =
    emotion === "sleeping"
      ? `<text x="${origin + face * 0.84}" y="${origin + face * 0.16}" font-family="Manrope, sans-serif" font-size="${Math.round(face * 0.16)}" font-weight="800" fill="#3f3f46" opacity="0.55">zzz</text>`
      : "";

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="buddy-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fde68a" />
      <stop offset="100%" stop-color="#fdba74" />
    </linearGradient>
    <linearGradient id="buddy-glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5" />
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect x="${origin}" y="${origin}" width="${face}" height="${face}" rx="${radius}" fill="url(#buddy-grad)" />
  <rect x="${origin}" y="${origin}" width="${face}" height="${face}" rx="${radius}" fill="url(#buddy-glass)" />
  ${sleepingEyes}
  <ellipse cx="${origin + face * 0.21}" cy="${blushY}" rx="${blushW * 0.5}" ry="${blushH * 0.5}" fill="#fb7185" opacity="0.4" />
  <ellipse cx="${origin + face * 0.79}" cy="${blushY}" rx="${blushW * 0.5}" ry="${blushH * 0.5}" fill="#fb7185" opacity="0.4" />
  ${mouth}
  ${zzz}
</svg>`;
}

function buildWordmarkSvg() {
  return `<svg width="860" height="260" viewBox="0 0 860 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="card-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fde68a" />
      <stop offset="100%" stop-color="#fdba74" />
    </linearGradient>
  </defs>
  <rect x="16" y="16" width="228" height="228" rx="56" fill="url(#card-grad)" />
  <path d="M95 132Q130 168 165 132" stroke="#27272a" stroke-width="14" stroke-linecap="round" fill="none" />
  <ellipse cx="88" cy="94" rx="12" ry="18" fill="#27272a" />
  <ellipse cx="172" cy="94" rx="12" ry="18" fill="#27272a" />
  <ellipse cx="95" cy="84" rx="3" ry="5" fill="#ffffff" />
  <ellipse cx="179" cy="84" rx="3" ry="5" fill="#ffffff" />
  <text x="280" y="156" font-family="Geist, Manrope, sans-serif" font-size="132" font-weight="700" fill="#27272a" letter-spacing="-2">lory</text>
</svg>`;
}
