/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable radix */

/**
 * Pre-deployment validation script
 * Run this before deploying to Render to catch common issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validating deployment readiness...\n');

let hasErrors = false;
let hasWarnings = false;

// Check Node version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (majorVersion < 18) {
  console.error('❌ Node.js version is too old:', nodeVersion);
  console.error('   Required: >= 18.0.0');
  hasErrors = true;
} else {
  console.log('✅ Node.js version:', nodeVersion);
}

// Check for required files

const requiredFiles = [
  'server.js',
  'app.js',
  'package.json',
  'public/js/index.js',
  'views/base.pug',
  'render.yaml',
  '.env.example',
];

requiredFiles.forEach((file) => {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    hasErrors = true;
  }
});

console.log('✅ All required files present');

// Check package.json
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  if (!pkg.scripts.start) {
    console.error('❌ Missing "start" script in package.json');
    hasErrors = true;
  } else {
    console.log('✅ Start script:', pkg.scripts.start);
  }

  if (!pkg.scripts['build:js']) {
    console.error('❌ Missing "build:js" script in package.json');
    hasErrors = true;
  } else {
    console.log('✅ Build script:', pkg.scripts['build:js']);
  }

  if (!pkg.engines || !pkg.engines.node) {
    console.warn('⚠️  No Node.js version specified in package.json');
    hasWarnings = true;
  } else {
    console.log('✅ Node version requirement:', pkg.engines.node);
  }

  // Check for critical dependencies
  const criticalDeps = ['express', 'mongoose', 'pug', 'dotenv'];
  criticalDeps.forEach((dep) => {
    if (!pkg.dependencies[dep]) {
      console.error(`❌ Missing critical dependency: ${dep}`);
      hasErrors = true;
    }
  });

  console.log('✅ Critical dependencies present');
} catch (error) {
  console.error('❌ Invalid package.json:', error.message);
  hasErrors = true;
}

// Check for sensitive data in files
const filesToCheck = ['app.js', 'server.js', 'package.json'];
const sensitivePatterns = [
  /mongodb\+srv:\/\/.*:[^<].*@/i, // MongoDB URI with actual password
  /sk_live_[a-zA-Z0-9]+/, // Stripe live key
  /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/, // SendGrid API key
];

filesToCheck.forEach((file) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    sensitivePatterns.forEach((pattern) => {
      if (pattern.test(content)) {
        console.error(`❌ Possible sensitive data found in ${file}`);
        console.error('   Make sure to use environment variables!');
        hasErrors = true;
      }
    });
  }
});

console.log('✅ No sensitive data found in source files');

// Check .gitignore
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const requiredIgnores = ['config.env', '.env', 'node_modules'];

  requiredIgnores.forEach((pattern) => {
    if (!gitignore.includes(pattern)) {
      console.warn(`⚠️  .gitignore should include: ${pattern}`);
      hasWarnings = true;
    }
  });

  console.log('✅ .gitignore configured');
} else {
  console.error('❌ Missing .gitignore file');
  hasErrors = true;
}

// Check if bundle.js exists or can be built
if (!fs.existsSync('public/js/bundle.js')) {
  console.warn('⚠️  bundle.js not found - will be built during deployment');
  hasWarnings = true;
} else {
  const stats = fs.statSync('public/js/bundle.js');
  console.log(`✅ bundle.js exists (${(stats.size / 1024).toFixed(2)} KB)`);
}

// Summary
console.log(`\n${'='.repeat(50)}`);

if (hasErrors) {
  console.error('\n❌ DEPLOYMENT VALIDATION FAILED');
  console.error('   Please fix the errors above before deploying\n');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('\n⚠️  VALIDATION PASSED WITH WARNINGS');
  console.warn('   Review warnings above before deploying\n');
  process.exit(0);
} else {
  console.log('\n✅ DEPLOYMENT VALIDATION PASSED');
  console.log('   Your app is ready for Render deployment!\n');
  console.log('📋 Next steps:');
  console.log('   1. Push to GitHub: git push origin main');
  console.log('   2. Create Web Service on Render');
  console.log('   3. Add environment variables');
  console.log('   4. Deploy!\n');
  process.exit(0);
}
