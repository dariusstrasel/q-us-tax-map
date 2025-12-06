"use strict";
const fs = require('fs');
const path = require('path');
const structure = {
    src: {
        components: ['USMap.tsx', 'Controls.tsx', 'Legend.tsx'],
        utils: ['csv.ts', 'color.ts'],
        assets: ['us-map.svg'],
        'App.tsx': null,
        'main.tsx': null,
    },
    public: ['index.html'],
    scripts: ['generate-structure.ts', 'validate-structure.cjs'],
    'package.json': null,
    'tsconfig.json': null,
    'vite.config.ts': null,
    'README.md': null,
};
function checkStructure(base, obj, errors = []) {
    Object.entries(obj).forEach(([key, value]) => {
        const fullPath = path.join(base, key);
        if (Array.isArray(value)) {
            if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
                errors.push(`Missing directory: ${fullPath}`);
            }
            else {
                value.forEach(f => {
                    const filePath = path.join(fullPath, f);
                    if (!fs.existsSync(filePath)) {
                        errors.push(`Missing file: ${filePath}`);
                    }
                });
            }
        }
        else if (typeof value === 'object' && value !== null) {
            if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
                errors.push(`Missing directory: ${fullPath}`);
            }
            else {
                checkStructure(fullPath, value, errors);
            }
        }
        else {
            if (!fs.existsSync(fullPath)) {
                errors.push(`Missing file: ${fullPath}`);
            }
        }
    });
    return errors;
}
const errors = checkStructure('.', structure);
if (errors.length === 0) {
    console.log('✅ Structure is valid.');
    process.exit(0);
}
else {
    console.error('❌ Structure validation failed:');
    errors.forEach(e => console.error('  -', e));
    process.exit(1);
}
