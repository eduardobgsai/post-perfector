const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('grep -rl "lucide-react" src/').toString().split('\n').filter(Boolean);

const iconMap = {
  Loader2: 'loader',
  GripVertical: 'menu4',
  PanelLeft: 'menu3',
  Check: 'check',
  ChevronRight: 'chevronRight',
  MoreHorizontal: 'menu',
  X: 'x',
  ArrowLeft: 'chevronLeft',
  ArrowRight: 'chevronRight',
  Search: 'searchToX',
  ChevronDown: 'chevronRight', // could rotate in css
  Circle: 'checkCircle', // closest
  Minus: 'userMinus', // we don't have minus, use something simple
  ChevronLeft: 'chevronLeft',
  ChevronDownIcon: 'chevronRight',
  ChevronLeftIcon: 'chevronLeft',
  ChevronRightIcon: 'chevronRight',
  ChevronUp: 'chevronRight'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find import { ... } from "lucide-react"
  const importMatch = content.match(/import\s+{([^}]+)}\s+from\s+["']lucide-react["'];?/);
  if (importMatch) {
    const importedIcons = importMatch[1].split(',').map(i => i.trim());
    
    content = content.replace(importMatch[0], 'import { AnimatedIcon } from "@/components/AnimatedIcon";');
    
    importedIcons.forEach(icon => {
      // Find usages like <IconName ... /> or <IconName>
      const mapped = iconMap[icon] || 'star';
      
      // Simple regex to replace <Icon ... /> to <AnimatedIcon name="..." ... />
      // And <Icon className="..." /> to <AnimatedIcon name="..." className="..." />
      const regex = new RegExp(`<${icon}(\\s+[^>]*|)>`, 'g');
      content = content.replace(regex, (match, attrs) => {
        return `<AnimatedIcon name="${mapped}" ${attrs.trim()}${attrs.endsWith('/') ? '' : ' />'}`;
      });
      
      // Also handle self closing that don't match the above exactly just in case
      const regex2 = new RegExp(`<${icon}\\s*/>`, 'g');
      content = content.replace(regex2, `<AnimatedIcon name="${mapped}" />`);
    });
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
