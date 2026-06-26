const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, '../node_modules/react-useanimations/lib');
const targetDir = path.join(__dirname, '../public/icons');

fs.readdirSync(libDir).forEach(file => {
  if (file.endsWith('.js') && file !== 'index.js') {
    const icon = path.basename(file, '.js');
    try {
      const mod = require(path.join(libDir, file));
      const data = mod.default || mod;
      const animationData = data.animationData || data;
      if (animationData && typeof animationData === 'object' && animationData.v) {
          fs.writeFileSync(path.join(targetDir, `${icon}.json`), JSON.stringify(animationData, null, 2));
          console.log(`Saved ${icon}.json`);
      }
    } catch(e) {}
  }
});
