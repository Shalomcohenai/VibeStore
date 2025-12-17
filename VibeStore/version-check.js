// VibeStore Version Consistency Checker
// This script validates version consistency across all files

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_DIR = __dirname;
const VERSION_FILES = {
    '_config.yml': /^version:\s*["']?([^"']+)["']?/m,
    '_data/site.yml': /^version:\s*["']?([^"']+)["']?/m,
    'package.json': /"version":\s*["']([^"']+)["']/,
    'DEPLOYMENT_STATUS.md': /Version\s+([0-9]+\.[0-9]+)/,
    'functions/package.json': /"version":\s*["']([^"']+)["']/
};

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        return null;
    }
}

function extractVersion(content, pattern) {
    if (!content) return null;
    const match = content.match(pattern);
    return match ? match[1] : null;
}

function checkVersionConsistency() {
    log('🔍 Checking Version Consistency...', 'yellow');
    console.log('=====================================');
    
    const versions = {};
    let errors = 0;
    
    // Extract versions from all files
    for (const [file, pattern] of Object.entries(VERSION_FILES)) {
        const filePath = path.join(PROJECT_DIR, file);
        const content = readFile(filePath);
        const version = extractVersion(content, pattern);
        
        if (version) {
            versions[file] = version;
            log(`✅ ${file}: ${version}`, 'green');
        } else {
            log(`❌ ${file}: Version not found or file missing`, 'red');
            errors++;
        }
    }
    
    // Check consistency
    const uniqueVersions = [...new Set(Object.values(versions))];
    
    if (uniqueVersions.length === 1) {
        log(`\n🎉 All versions are consistent: ${uniqueVersions[0]}`, 'green');
        return { consistent: true, version: uniqueVersions[0] };
    } else {
        log(`\n❌ Version inconsistencies found:`, 'red');
        for (const [file, version] of Object.entries(versions)) {
            log(`  ${file}: ${version}`, 'red');
        }
        return { consistent: false, versions };
    }
}

function updateVersionInFile(filePath, newVersion) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (filePath.endsWith('.json')) {
            // JSON file
            content = content.replace(/"version":\s*["'][^"']*["']/, `"version": "${newVersion}"`);
        } else if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
            // YAML file
            content = content.replace(/^version:\s*["']?[^"']*["']?/m, `version: "${newVersion}"`);
        } else if (filePath.endsWith('.md')) {
            // Markdown file
            content = content.replace(/Version\s+[0-9]+\.[0-9]+/g, `Version ${newVersion}`);
            content = content.replace(/v[0-9]+\.[0-9]+/g, `v${newVersion}`);
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    } catch (error) {
        log(`Error updating ${filePath}: ${error.message}`, 'red');
        return false;
    }
}

function syncVersions(newVersion) {
    log(`🔄 Synchronizing all versions to: ${newVersion}`, 'yellow');
    console.log('==========================================');
    
    let success = 0;
    let total = 0;
    
    for (const file of Object.keys(VERSION_FILES)) {
        const filePath = path.join(PROJECT_DIR, file);
        total++;
        
        if (updateVersionInFile(filePath, newVersion)) {
            log(`✅ Updated: ${file}`, 'green');
            success++;
        } else {
            log(`❌ Failed: ${file}`, 'red');
        }
    }
    
    // Update cache bust in _data/site.yml
    const siteYmlPath = path.join(PROJECT_DIR, '_data/site.yml');
    try {
        let content = fs.readFileSync(siteYmlPath, 'utf8');
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const currentTime = new Date().toTimeString().slice(0, 5).replace(':', '');
        const cacheBust = `${currentDate}-${currentTime}-v${newVersion.replace('.', '')}`;
        
        content = content.replace(/cache_bust:\s*["'][^"']*["']/, `cache_bust: "${cacheBust}"`);
        content = content.replace(/last_updated:\s*["'][^"']*["']/, `last_updated: "${new Date().toISOString().slice(0, 10)}"`);
        
        fs.writeFileSync(siteYmlPath, content, 'utf8');
        log(`✅ Updated: _data/site.yml (cache_bust: ${cacheBust})`, 'green');
        success++;
    } catch (error) {
        log(`❌ Failed to update cache_bust: ${error.message}`, 'red');
    }
    
    log(`\n📊 Results: ${success}/${total + 1} files updated successfully`, success === total + 1 ? 'green' : 'yellow');
    
    return success === total + 1;
}

function showHelp() {
    log('VibeStore Version Consistency Checker', 'blue');
    console.log('=====================================');
    console.log('');
    console.log('Usage: node version-check.js <command> [options]');
    console.log('');
    console.log('Commands:');
    console.log('  check                    - Check version consistency');
    console.log('  sync <version>           - Sync all versions to specified version');
    console.log('  help                     - Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  node version-check.js check');
    console.log('  node version-check.js sync 6.3');
    console.log('');
}

// Main execution
function main() {
    const command = process.argv[2];
    const version = process.argv[3];
    
    switch (command) {
        case 'check':
            const result = checkVersionConsistency();
            process.exit(result.consistent ? 0 : 1);
            break;
            
        case 'sync':
            if (!version) {
                log('❌ Error: Version number required', 'red');
                log('Usage: node version-check.js sync <version>', 'yellow');
                process.exit(1);
            }
            
            if (syncVersions(version)) {
                log('🎉 Version synchronization complete!', 'green');
                process.exit(0);
            } else {
                log('❌ Version synchronization failed!', 'red');
                process.exit(1);
            }
            break;
            
        case 'help':
        case '--help':
        case '-h':
            showHelp();
            break;
            
        default:
            log('❌ Unknown command', 'red');
            showHelp();
            process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    checkVersionConsistency,
    syncVersions
};
