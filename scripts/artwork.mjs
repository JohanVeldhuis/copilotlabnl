import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { root } from './prepare-content.mjs';

const background = '<rect width="720" height="420" fill="#eef0fc"/><circle cx="650" cy="30" r="225" fill="#e1edfb"/>';
const definitions = `<defs>
  <linearGradient id="arch" x2="1" y2="1"><stop stop-color="#b9effb"/><stop offset=".45" stop-color="#86b5eb"/><stop offset="1" stop-color="#7473c9"/></linearGradient>
  <radialGradient id="sphere" cx=".28" cy=".23" r=".85"><stop stop-color="#f2e1fa"/><stop offset=".5" stop-color="#c4aae8"/><stop offset="1" stop-color="#8886d0"/></radialGradient>
  <filter id="shadow" x="-30%" y="-40%" width="160%" height="190%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#424979" flood-opacity=".12"/></filter>
</defs>`;
const pictures = {
  hero: `${definitions}
    <ellipse cx="360" cy="357" rx="250" ry="32" fill="#ced8ef" opacity=".4"/>
    <path d="M337 338V142a112 112 0 0 1 224 0v196h-64V142a48 48 0 0 0-96 0v196Z" fill="#858ac9"/>
    <path d="M316 327V131a112 112 0 0 1 224 0v196h-64V131a48 48 0 0 0-96 0v196Z" fill="url(#arch)"/>
    <circle cx="267" cy="276" r="85" fill="url(#sphere)"/>
    <g transform="rotate(-7 192 137)" filter="url(#shadow)"><rect x="67" y="78" width="240" height="119" rx="19" fill="white" stroke="#e1e5f1"/><rect x="88" y="100" width="35" height="35" rx="10" fill="#eeebfc"/><path d="M98 112h15m-15 6h10m-10 6h15" stroke="#7664ba" stroke-width="2"/><path d="M142 114h123M90 156h169M90 173h108" stroke="#c4c9e4" stroke-width="6" stroke-linecap="round"/></g>
    <g transform="rotate(5 528 307)" filter="url(#shadow)"><rect x="422" y="265" width="233" height="104" rx="18" fill="white" stroke="#e1e5f1"/><circle cx="450" cy="292" r="12" fill="#e8f0fc"/><path d="m445 292 4 4 6-8" stroke="#5271b6" stroke-width="2" fill="none"/><path d="M475 292h132M445 331h182" stroke="#c4c9e4" stroke-width="6" stroke-linecap="round"/></g><circle cx="595" cy="123" r="16" fill="#f1c7b9"/><path d="M125 254h19m-9.5-9.5v19" stroke="#9c9ed5" stroke-width="2"/>`,
  prompt: `${background}<g transform="rotate(-9 360 210)"><rect x="155" y="67" width="328" height="240" rx="20" fill="#bcbce6"/><rect x="207" y="111" width="328" height="240" rx="20" fill="white" stroke="#d6dcef"/><rect x="243" y="150" width="66" height="15" rx="7" fill="#b0a1d9"/><path d="M243 207h239M243 237h174M243 267h209" stroke="#d7deee" stroke-width="10" stroke-linecap="round"/><circle cx="488" cy="306" r="18" fill="#eeeafb"/><path d="M480 306h16m-6-6 6 6-6 6" stroke="#7664ba" stroke-width="2" fill="none"/></g>`,
  dialogue: `<rect width="720" height="420" fill="#f2edfa"/><circle cx="660" cy="380" r="235" fill="#f8e5df"/><path d="M130 68h305a24 24 0 0 1 24 24v130a24 24 0 0 1-24 24H181l-44 31v-31h-7a24 24 0 0 1-24-24V92a24 24 0 0 1 24-24Z" fill="white" stroke="#e0dcee"/><path d="M152 121h251M152 153h176" stroke="#c8c4e4" stroke-width="10" stroke-linecap="round"/><path d="M323 203h256a24 24 0 0 1 24 24v97a24 24 0 0 1-24 24h-8v30l-42-30H323a24 24 0 0 1-24-24v-97a24 24 0 0 1 24-24Z" fill="#a8a4d9"/><path d="M338 253h222M338 287h154" stroke="#f1effb" stroke-width="10" stroke-linecap="round"/>`,
  data: `${background}<rect x="92" y="55" width="536" height="318" rx="23" fill="#f9fbff" stroke="#c7d4ee"/><path d="M92 104h536" stroke="#dce3f3"/><circle cx="122" cy="80" r="6" fill="#aba9d6"/><circle cx="143" cy="80" r="6" fill="#c4c8e5"/><path d="M148 302h423M148 233h423M148 164h423" stroke="#e5eaf5"/><path d="M177 302v-72h51v72ZM274 302V195h51v107ZM371 302V170h51v132ZM468 302V139h51v163Z" fill="#969bd6"/>`,
  workflow: `${background}<path d="M170 206h380" stroke="#aba9d6" stroke-width="3"/><g fill="white" stroke="#cbd3ec"><rect x="60" y="153" width="161" height="106" rx="22"/><rect x="280" y="153" width="161" height="106" rx="22"/><rect x="500" y="153" width="161" height="106" rx="22"/></g><g fill="#aaa3d8"><circle cx="140" cy="206" r="24"/><path d="m360 180 28 26-28 26-28-26Z"/><rect x="558" y="183" width="46" height="46" rx="11"/></g>`,
};
const directory = path.join(root, 'public/art');
await mkdir(directory, { recursive: true });
for (const [name, body] of Object.entries(pictures)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420">${body}</svg>`;
  await writeFile(path.join(directory, `${name}.svg`), svg);
}
// Raster social preview has no font or external resource dependency.
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 720 420"><rect width="720" height="420" fill="#f7f9fe"/>${pictures.hero}</svg>`;
await sharp(Buffer.from(social)).png().toFile(path.join(directory, 'social.png'));
console.log('Generated five deterministic SVG compositions and a 1200 x 630 social image locally.');
