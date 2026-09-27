const fs = require('fs');
const path = require('path');

class PerformanceOptimizer {
  constructor() {
    this.optimizations = [];
    this.warnings = [];
  }

  async runOptimizations() {
    console.log('🚀 Running Performance Optimizations...\n');
    
    try {
      // 1. Analyze and optimize images
      await this.analyzeImages();
      
      // 2. Check bundle configuration
      await this.checkBundleConfig();
      
      // 3. Verify lazy loading implementation
      await this.verifyLazyLoading();
      
      // 4. Check caching strategies
      await this.checkCaching();
      
      // 5. Analyze CSS and JS optimization
      await this.analyzeAssetOptimization();
      
      // 6. Generate optimization report
      this.generateOptimizationReport();
      
      console.log('✅ Performance optimization analysis completed!');
      
    } catch (error) {
      console.error('❌ Performance optimization failed:', error.message);
    }
  }

  async analyzeImages() {
    console.log('🖼️  Analyzing image optimization...');
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    const imageFiles = this.findFiles('src', imageExtensions);
    
    if (imageFiles.length === 0) {
      this.optimizations.push({
        category: 'Images',
        status: 'info',
        message: 'No image files found in src directory'
      });
    } else {
      // Check for lazy loading directive
      const lazyDirectiveExists = fs.existsSync('src/app/shared/directives/lazy-image.directive.ts');
      
      this.optimizations.push({
        category: 'Images',
        status: lazyDirectiveExists ? 'success' : 'warning',
        message: lazyDirectiveExists 
          ? `✓ Lazy loading directive implemented (${imageFiles.length} images found)`
          : `⚠️  Consider implementing lazy loading for ${imageFiles.length} images`
      });
      
      // Check for image optimization service
      const imageServiceExists = fs.existsSync('src/app/services/image-optimization.service.ts');
      
      this.optimizations.push({
        category: 'Images',
        status: imageServiceExists ? 'success' : 'warning',
        message: imageServiceExists 
          ? '✓ Image optimization service implemented'
          : '⚠️  Consider implementing image optimization service'
      });
    }
    
    console.log(`   Found ${imageFiles.length} image files`);
  }

  async checkBundleConfig() {
    console.log('📦 Checking bundle configuration...');
    
    const angularJsonPath = 'angular.json';
    
    if (fs.existsSync(angularJsonPath)) {
      const angularConfig = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));
      const buildConfig = angularConfig.projects?.['public-website']?.architect?.build?.configurations?.production;
      
      if (buildConfig) {
        // Check optimization settings
        const hasOptimization = buildConfig.optimization;
        const hasOutputHashing = buildConfig.outputHashing;
        const hasBudgets = buildConfig.budgets && buildConfig.budgets.length > 0;
        
        this.optimizations.push({
          category: 'Bundle',
          status: hasOptimization ? 'success' : 'warning',
          message: hasOptimization 
            ? '✓ Build optimization enabled'
            : '⚠️  Build optimization not configured'
        });
        
        this.optimizations.push({
          category: 'Bundle',
          status: hasOutputHashing ? 'success' : 'warning',
          message: hasOutputHashing 
            ? '✓ Output hashing enabled for caching'
            : '⚠️  Output hashing not configured'
        });
        
        this.optimizations.push({
          category: 'Bundle',
          status: hasBudgets ? 'success' : 'warning',
          message: hasBudgets 
            ? '✓ Bundle size budgets configured'
            : '⚠️  Bundle size budgets not set'
        });
      }
    }
    
    console.log('   ✓ Bundle configuration analyzed');
  }

  async verifyLazyLoading() {
    console.log('⚡ Verifying lazy loading implementation...');
    
    // Check for lazy loading in routing
    const routingFiles = this.findFiles('src', ['.ts']).filter(file => 
      file.includes('routing') || file.includes('routes')
    );
    
    let hasLazyRoutes = false;
    
    for (const file of routingFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('loadChildren') || content.includes('import(')) {
        hasLazyRoutes = true;
        break;
      }
    }
    
    this.optimizations.push({
      category: 'Lazy Loading',
      status: hasLazyRoutes ? 'success' : 'warning',
      message: hasLazyRoutes 
        ? '✓ Lazy route loading implemented'
        : '⚠️  Consider implementing lazy route loading'
    });
    
    // Check for lazy image directive
    const lazyImageExists = fs.existsSync('src/app/shared/directives/lazy-image.directive.ts');
    
    this.optimizations.push({
      category: 'Lazy Loading',
      status: lazyImageExists ? 'success' : 'info',
      message: lazyImageExists 
        ? '✓ Lazy image loading directive available'
        : 'ℹ️  Lazy image loading directive not found'
    });
    
    console.log('   ✓ Lazy loading verification completed');
  }

  async checkCaching() {
    console.log('💾 Checking caching strategies...');
    
    // Check for service worker
    const swConfigExists = fs.existsSync('ngsw-config.json');
    
    this.optimizations.push({
      category: 'Caching',
      status: swConfigExists ? 'success' : 'info',
      message: swConfigExists 
        ? '✓ Service worker configuration found'
        : 'ℹ️  Service worker not configured'
    });
    
    // Check for HTTP interceptors (caching)
    const interceptorFiles = this.findFiles('src', ['.ts']).filter(file => 
      file.includes('interceptor') || file.includes('cache')
    );
    
    this.optimizations.push({
      category: 'Caching',
      status: interceptorFiles.length > 0 ? 'success' : 'info',
      message: interceptorFiles.length > 0 
        ? `✓ ${interceptorFiles.length} caching/interceptor files found`
        : 'ℹ️  No HTTP caching interceptors found'
    });
    
    console.log('   ✓ Caching strategy analysis completed');
  }

  async analyzeAssetOptimization() {
    console.log('🎨 Analyzing asset optimization...');
    
    // Check for SCSS optimization
    const scssFiles = this.findFiles('src', ['.scss']);
    
    this.optimizations.push({
      category: 'Assets',
      status: 'info',
      message: `ℹ️  Found ${scssFiles.length} SCSS files for optimization`
    });
    
    // Check for performance service
    const perfServiceExists = fs.existsSync('src/app/services/performance.service.ts');
    
    this.optimizations.push({
      category: 'Assets',
      status: perfServiceExists ? 'success' : 'warning',
      message: perfServiceExists 
        ? '✓ Performance monitoring service implemented'
        : '⚠️  Performance monitoring service not found'
    });
    
    // Check for Lighthouse configuration
    const lighthouseConfigExists = fs.existsSync('lighthouserc.js');
    
    this.optimizations.push({
      category: 'Assets',
      status: lighthouseConfigExists ? 'success' : 'info',
      message: lighthouseConfigExists 
        ? '✓ Lighthouse CI configuration found'
        : 'ℹ️  Lighthouse CI not configured'
    });
    
    console.log('   ✓ Asset optimization analysis completed');
  }

  findFiles(dir, extensions) {
    let results = [];
    
    if (!fs.existsSync(dir)) {
      return results;
    }
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        results = results.concat(this.findFiles(filePath, extensions));
      } else {
        const ext = path.extname(file).toLowerCase();
        if (extensions.includes(ext)) {
          results.push(filePath);
        }
      }
    }
    
    return results;
  }

  generateOptimizationReport() {
    console.log('\n📋 Performance Optimization Report');
    console.log('=' .repeat(50));
    
    const categories = [...new Set(this.optimizations.map(opt => opt.category))];
    
    categories.forEach(category => {
      console.log(`\n${this.getCategoryIcon(category)} ${category}:`);
      
      const categoryOptimizations = this.optimizations.filter(opt => opt.category === category);
      
      categoryOptimizations.forEach(opt => {
        console.log(`   ${opt.message}`);
      });
    });
    
    // Summary
    const successCount = this.optimizations.filter(opt => opt.status === 'success').length;
    const warningCount = this.optimizations.filter(opt => opt.status === 'warning').length;
    const infoCount = this.optimizations.filter(opt => opt.status === 'info').length;
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Optimizations in place: ${successCount}`);
    console.log(`   ⚠️  Recommendations: ${warningCount}`);
    console.log(`   ℹ️  Information: ${infoCount}`);
    
    // Performance recommendations
    if (warningCount > 0) {
      console.log('\n🎯 Key Recommendations:');
      console.log('   1. Enable all build optimizations in angular.json');
      console.log('   2. Implement lazy loading for routes and images');
      console.log('   3. Configure service worker for caching');
      console.log('   4. Set up bundle size budgets');
      console.log('   5. Optimize images with modern formats (WebP)');
    }
    
    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      optimizations: this.optimizations,
      summary: {
        success: successCount,
        warnings: warningCount,
        info: infoCount
      }
    };
    
    fs.writeFileSync('performance-optimization-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed report saved to: performance-optimization-report.json');
  }

  getCategoryIcon(category) {
    const icons = {
      'Images': '🖼️',
      'Bundle': '📦',
      'Lazy Loading': '⚡',
      'Caching': '💾',
      'Assets': '🎨'
    };
    
    return icons[category] || '📋';
  }
}

// Run optimization analysis if called directly
if (require.main === module) {
  const optimizer = new PerformanceOptimizer();
  optimizer.runOptimizations().catch(console.error);
}

module.exports = PerformanceOptimizer;