const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/components/wellbeing-settings');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'index.tsx' && f !== 'break-countdown-pill.tsx');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const keyMatch = content.match(/settings\.breaks\.(\w+)\.enabled/);
  if (!keyMatch) continue;
  const key = keyMatch[1];

  const iconMatch = content.match(/<(Icon[A-Za-z0-9]+)\s+className=".*?"/);
  const icon = iconMatch ? iconMatch[1] : 'IconHeart';
  
  const titleMatch = content.match(/<h3[^>]*>[\s\S]*?<Icon[A-Za-z0-9]+[^>]*\/>\s*([^<]+)\s*<\/h3>/);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const descMatch = content.match(/<p className="text-muted-foreground text-sm">\s*([^<]+)\s*<\/p>/);
  const desc = descMatch ? descMatch[1].trim() : '';

  const sliderMin = content.match(/min={(\d+)}/)[1];
  const sliderMax = content.match(/max={(\d+)}/)[1];
  const sliderStep = content.match(/step={(\d+)}/)[1];
  const sliderDefault = content.match(/v\[0\] \?\? (\d+)/)[1];

  const newReturn = `  return (
    <section
      className={\`bg-card p-8 rounded-[2rem] shadow-sm border border-emerald-100/30 flex flex-col gap-6 transition-all duration-300 relative overflow-hidden \${
        !settings.breaks.${key}.enabled ? "opacity-60 grayscale-[50%] hover:opacity-80" : "hover:shadow-md hover:border-emerald-200/50"
      }\`}
    >
      {settings.breaks.${key}.enabled && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-orange-50/20 pointer-events-none" />
      )}
      
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-start flex-col sm:flex-row gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl shadow-sm border border-orange-200/50 shrink-0">
            <${icon} className="size-6 text-orange-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              ${title}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 leading-relaxed max-w-[280px]">
              ${desc}
            </p>
          </div>
        </div>
        <Switch
          checked={settings.breaks.${key}.enabled}
          onCheckedChange={(c) => toggleEnabled("${key}", c)}
          className="data-[state=checked]:bg-emerald-500 shrink-0 mt-1 sm:mt-0"
        />
      </div>

      <div className="relative z-10 flex items-center min-h-[24px]">
        <BreakCountdownPill
          lastFiredAt={lastFiredAt}
          intervalMinutes={settings.breaks.${key}.intervalMinutes}
          enabled={settings.breaks.${key}.enabled}
        />
      </div>

      <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm border border-emerald-100/50 dark:border-emerald-900/30 p-5 rounded-2xl relative z-10 mt-auto">
        <div className="flex justify-between items-end mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-emerald-700/70 dark:text-emerald-400/70">
            Frequency
          </label>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {settings.breaks.${key}.intervalMinutes}m
          </span>
        </div>
        <Slider
          min={${sliderMin}}
          max={${sliderMax}}
          step={${sliderStep}}
          value={[settings.breaks.${key}.intervalMinutes]}
          onValueChange={(v) => updateInterval("${key}", v[0] ?? ${sliderDefault})}
          disabled={!settings.breaks.${key}.enabled}
          {...sliderStyles}
        />
      </div>
    </section>
  );
}`;

  content = content.replace(/  return \([\s\S]*?\);\n\}/, newReturn);
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Done refactoring components');