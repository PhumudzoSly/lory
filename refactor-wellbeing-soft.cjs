const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/components/wellbeing-settings');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'index.tsx' && f !== 'break-countdown-pill.tsx');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace wrapper section
  content = content.replace(
    /className={`bg-card[^`]*`}/,
    'className={`bg-card p-8 rounded-[2rem] shadow-sm border border-emerald-100/30 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${!settings.breaks.$1.enabled ? "opacity-60 grayscale-[50%] hover:opacity-80" : "hover:shadow-md hover:border-emerald-200/50"}`}'
  );

  // Add gradient background behind everything if enabled
  // We'll inject it right after <section ... >
  content = content.replace(
    /(<section[^>]*>)/,
    `$1\n      {settings.breaks.$1.enabled && (\n        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-orange-50/20 pointer-events-none" />\n      )}`
  );

  // Update headers
  content = content.replace(
    /<h3[^>]*>\s*<Icon([A-Za-z0-9]+) className="size-5[^"]*" \/>\s*([^<]+)\s*<\/h3>/,
    `<div className="flex items-center gap-4 relative z-10 mb-4">\n          <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl shadow-sm border border-orange-200/50 shrink-0">\n            <Icon$1 className="size-6 text-orange-700" />\n          </div>\n          <h3 className="text-xl font-bold text-foreground">\n            $2\n          </h3>\n        </div>`
  );

  // Update internal containers
  content = content.replace(
    /<div className="bg-background p-[^"]+ rounded-xl[^"]*">/,
    '<div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-emerald-100/50 dark:border-emerald-900/30 p-6 rounded-2xl relative z-10 mt-auto">'
  );

  // Switch element z-index fix
  content = content.replace(
    /(<Switch[\s\S]*?\/>)/,
    `<div className="relative z-10 shrink-0">\n            $1\n          </div>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Done soft refactoring components');