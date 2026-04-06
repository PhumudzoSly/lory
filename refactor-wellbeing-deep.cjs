const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/components/wellbeing-settings');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'index.tsx' && f !== 'info-panel.tsx' && f !== 'break-countdown-pill.tsx');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the break key (e.g., eye, posture, etc.)
  const keyMatch = content.match(/settings\.breaks\.(\w+)/);
  if (!keyMatch) continue;
  const key = keyMatch[1];

  // 1. Replace the top-level <section className={...}>
  content = content.replace(
    /<section[\s\S]*?className=\{`bg-card[\s\S]*?`\}/m,
    `<section\n      className={\`bg-card p-8 rounded-[2rem] shadow-sm border border-emerald-100/30 flex flex-col transition-all duration-300 relative overflow-hidden \${!settings.breaks.${key}.enabled ? "opacity-60 grayscale-[50%] hover:opacity-80" : "hover:shadow-md hover:border-emerald-200/50"}\`}`
  );

  // 2. Inject gradient background right after <section ...>
  //    Wait, we can just replace `<section ...>` and the `>` character.
  content = content.replace(
    /(<section[\s\S]*?className=\{`bg-card[\s\S]*?`\}\s*>)/m,
    `$1\n      {settings.breaks.${key}.enabled && (\n        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-orange-50/20 pointer-events-none" />\n      )}`
  );

  // 3. Replace the header <h3> with the icon
  // Example: <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">\n <IconEye className="size-5 text-emerald-500" />\n Eye Rest Protocol\n </h3>
  content = content.replace(
    /<h3[\s\S]*?<Icon([A-Za-z0-9]+)[\s\S]*?\/>\s*([^<]+)\s*<\/h3>/m,
    `<div className="flex items-center gap-4 relative z-10">\n          <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl shadow-sm border border-orange-200/50 shrink-0">\n            <Icon$1 className="size-6 text-orange-700" />\n          </div>\n          <h3 className="text-xl font-bold text-foreground">\n            $2\n          </h3>\n        </div>`
  );

  // 4. Wrap Switch in a relative z-10
  content = content.replace(
    /<Switch([\s\S]*?)\/>/m,
    `<div className="relative z-10 shrink-0">\n          <Switch$1 className="data-[state=checked]:bg-emerald-500" />\n        </div>`
  );

  // 5. Upgrade the inner boxes (bg-background p-6 rounded-xl)
  content = content.replace(
    /<div className="bg-background p-([0-9]+) rounded-xl"/m,
    `<div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-emerald-100/50 dark:border-emerald-900/30 p-6 rounded-2xl relative z-10 mt-auto"`
  );

  // 6. Give paragraph relative z-10
  content = content.replace(
    /<p className="text-muted-foreground/m,
    `<p className="text-muted-foreground relative z-10`
  );
  
  // 7. Fix RadioGroup selected color
  content = content.replace(
    /border-primary bg-primary\/10/g,
    `border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400`
  );

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Finished deep refactor.');