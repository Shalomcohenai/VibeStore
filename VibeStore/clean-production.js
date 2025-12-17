#!/usr/bin/env node

/**
 * Production cleanup script for VibeStore
 * Removes debug logs, test code, and development artifacts
 */

const fs = require('fs');
const path = require('path');

class ProductionCleaner {
  constructor() {
    this.processedFiles = 0;
    this.removedLogs = 0;
    this.removedTests = 0;
  }

  // Clean console.log statements (keep console.error for production debugging)
  cleanConsoleLogs(content, filePath) {
    const originalLength = content.length;
    
    // Remove console.log, console.warn, console.debug (keep console.error)
    content = content.replace(/console\.log\([^;]*\);\s*/g, '');
    content = content.replace(/console\.warn\([^;]*\);\s*/g, '');
    content = content.replace(/console\.debug\([^;]*\);\s*/g, '');
    
    // Remove multi-line console statements
    content = content.replace(/console\.log\([^)]*\);\s*/gs, '');
    content = content.replace(/console\.warn\([^)]*\);\s*/gs, '');
    content = content.replace(/console\.debug\([^)]*\);\s*/gs, '');
    
    const removed = originalLength - content.length;
    if (removed > 0) {
      this.removedLogs += (originalLength - content.length);
      console.log(`🧹 Cleaned ${removed} characters from ${filePath}`);
    }
    
    return content;
  }

  // Remove test/debug functions
  cleanTestCode(content, filePath) {
    const originalLength = content.length;
    
    // Remove test functions and debug code
    content = content.replace(/\/\*\*[\s\S]*?TEST[\s\S]*?\*\/\s*/g, '');
    content = content.replace(/\/\*\*[\s\S]*?DEBUG[\s\S]*?\*\/\s*/g, '');
    content = content.replace(/\/\/\s*TEST[\s\S]*?\n/g, '');
    content = content.replace(/\/\/\s*DEBUG[\s\S]*?\n/g, '');
    
    // Remove development comments
    content = content.replace(/\/\/\s*TODO[\s\S]*?\n/g, '');
    content = content.replace(/\/\/\s*FIXME[\s\S]*?\n/g, '');
    
    const removed = originalLength - content.length;
    if (removed > 0) {
      this.removedTests += removed;
      console.log(`🧪 Cleaned test code from ${filePath}`);
    }
    
    return content;
  }

  // Clean empty lines and extra whitespace
  cleanWhitespace(content) {
    // Remove multiple consecutive empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Remove trailing whitespace
    content = content.replace(/[ \t]+$/gm, '');
    
    return content;
  }

  // Process a single file
  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let cleanedContent = content;
      
      // Apply cleaning operations
      cleanedContent = this.cleanConsoleLogs(cleanedContent, filePath);
      cleanedContent = this.cleanTestCode(cleanedContent, filePath);
      cleanedContent = this.cleanWhitespace(cleanedContent);
      
      // Write back if changed
      if (cleanedContent !== content) {
        fs.writeFileSync(filePath, cleanedContent, 'utf8');
        this.processedFiles++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  // Process all JavaScript files
  async processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      
      if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
        await this.processDirectory(fullPath);
      } else if (file.name.endsWith('.js') && !file.name.includes('.min.')) {
        this.processFile(fullPath);
      }
    }
  }

  // Main cleanup function
  async cleanup() {
    console.log('🧹 Starting production cleanup...');
    
    try {
      // Process JavaScript files
      await this.processDirectory('./assets/js');
      
      // Process any other directories
      const otherDirs = ['./pages', './_includes'];
      for (const dir of otherDirs) {
        if (fs.existsSync(dir)) {
          await this.processDirectory(dir);
        }
      }
      
      console.log('\n✅ Production cleanup completed!');
      console.log(`📊 Processed ${this.processedFiles} files`);
      console.log(`🗑️  Removed ${this.removedLogs} characters of debug logs`);
      console.log(`🧪 Removed ${this.removedTests} characters of test code`);
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      process.exit(1);
    }
  }
}

// Run cleanup
const cleaner = new ProductionCleaner();
cleaner.cleanup();
