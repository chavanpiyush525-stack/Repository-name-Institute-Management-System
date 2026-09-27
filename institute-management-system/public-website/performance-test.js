const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PerformanceTester {
  constructor() {
    this.results = {
      lighthouse: null,
      bundleAnalysis: null,
      buildTime: null,
      timestamp: new Date().toISOString()
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Performance Testing Suite...\n');
    
    try {
      // 1. Build Performance Test
      await this.measureBuildTime();
      
      // 2. Bundle Analysis
      await this.analyzeBundleSize();
      
      // 3. Lighthouse Audit
      await this.runLighthouseAudit();
      
      // 4. Generate Report
      this.generateReport();
      
      console.log('✅ Performance testing completed successfully!');
      
    } catch (error) {
      console.error('❌ Performance testing failed:', error.message);
      process.exit(1);
    }
  }

  async measureBuildTime() {
    console.log('📦 Measuring build performance...');
    
    const startTime = Date.now();
    
    try {
      execSync('npm run build:prod', { 
        stdio: 'pipe',
        cwd: process.cwd()
      });
      
      const buildTime = Date.now() - startTime;
      this.results.buildTime = {
        duration: buildTime,
        durationFormatted: `${(buildTime / 1000).toFixed(2)}s`
      };
      
      console.log(`   ✓ Build completed in ${this.results.buildTime.durationFormatted}`);
      
      // Check if build time is acceptable (under 60 seconds)
      if (buildTime > 60000) {
        console.warn('   ⚠️  Build time exceeds 60 seconds - consider optimization');
      }
      
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  async analyzeBundleSize() {
    console.log('📊 Analyzing bundle size...');
    
    try {
      // Generate stats.json for analysis
      execSync('ng build --configuration production --stats-json', { 
        stdio: 'pipe',
        cwd: process.cwd()
      });
      
      const statsPath = path.join(process.cwd(), 'dist/public-website/stats.json');
      
      if (fs.existsSync(statsPath)) {
        const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
        
        const bundleAnalysis = this.analyzeBundleStats(stats);
        this.results.bundleAnalysis = bundleAnalysis;
        
        console.log(`   ✓ Main bundle: ${bundleAnalysis.mainBundleSize}`);
        console.log(`   ✓ Total size: ${bundleAnalysis.totalSize}`);
        console.log(`   ✓ Chunk count: ${bundleAnalysis.chunkCount}`);
        
        // Check bundle size thresholds
        if (bundleAnalysis.mainBundleSizeBytes > 500000) { // 500KB
          console.warn('   ⚠️  Main bundle exceeds 500KB - consider code splitting');
        }
        
      } else {
        console.warn('   ⚠️  Stats file not found, skipping bundle analysis');
      }
      
    } catch (error) {
      console.warn(`   ⚠️  Bundle analysis failed: ${error.message}`);
    }
  }

  analyzeBundleStats(stats) {
    const assets = stats.assets || [];
    const chunks = stats.chunks || [];
    
    // Find main bundle
    const mainAsset = assets.find(asset => 
      asset.name.includes('main') && asset.name.endsWith('.js')
    );
    
    const totalSize = assets.reduce((sum, asset) => sum + (asset.size || 0), 0);
    const mainBundleSizeBytes = mainAsset ? mainAsset.size : 0;
    
    return {
      mainBundleSize: this.formatBytes(mainBundleSizeBytes),
      mainBundleSizeBytes,
      totalSize: this.formatBytes(totalSize),
      totalSizeBytes: totalSize,
      chunkCount: chunks.length,
      assets: assets.map(asset => ({
        name: asset.name,
        size: this.formatBytes(asset.size || 0),
        sizeBytes: asset.size || 0
      })).sort((a, b) => b.sizeBytes - a.sizeBytes).slice(0, 10) // Top 10 largest
    };
  }

  async runLighthouseAudit() {
    console.log('🔍 Running Lighthouse audit...');
    
    try {
      // Run Lighthouse CI
      const output = execSync('npx @lhci/cli autorun --config=lighthouserc.js', { 
        stdio: 'pipe',
        cwd: process.cwd(),
        encoding: 'utf8'
      });
      
      console.log('   ✓ Lighthouse audit completed');
      
      // Try to parse Lighthouse results
      this.parseLighthouseResults(output);
      
    } catch (error) {
      console.warn(`   ⚠️  Lighthouse audit failed: ${error.message}`);
      console.log('   ℹ️  Running fallback single-page audit...');
      
      try {
        // Fallback: Run single lighthouse audit
        const fallbackOutput = execSync('npx lighthouse http://localhost:4300 --output=json --quiet --chrome-flags="--headless --no-sandbox"', {
          stdio: 'pipe',
          cwd: process.cwd(),
          encoding: 'utf8'
        });
        
        const lighthouseResult = JSON.parse(fallbackOutput);
        this.results.lighthouse = this.extractLighthouseMetrics(lighthouseResult);
        console.log('   ✓ Fallback audit completed');
        
      } catch (fallbackError) {
        console.warn('   ⚠️  Fallback audit also failed, skipping Lighthouse results');
      }
    }
  }

  parseLighthouseResults(output) {
    // Try to extract key metrics from LHCI output
    const lines = output.split('\n');
    const metrics = {};
    
    lines.forEach(line => {
      if (line.includes('Performance:')) {
        const match = line.match(/Performance:\s*(\d+)/);
        if (match) metrics.performance = parseInt(match[1]);
      }
      if (line.includes('Accessibility:')) {
        const match = line.match(/Accessibility:\s*(\d+)/);
        if (match) metrics.accessibility = parseInt(match[1]);
      }
      if (line.includes('Best Practices:')) {
        const match = line.match(/Best Practices:\s*(\d+)/);
        if (match) metrics.bestPractices = parseInt(match[1]);
      }
      if (line.includes('SEO:')) {
        const match = line.match(/SEO:\s*(\d+)/);
        if (match) metrics.seo = parseInt(match[1]);
      }
    });
    
    if (Object.keys(metrics).length > 0) {
      this.results.lighthouse = metrics;
    }
  }

  extractLighthouseMetrics(lighthouseResult) {
    const categories = lighthouseResult.categories || {};
    const audits = lighthouseResult.audits || {};
    
    return {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
      metrics: {
        fcp: audits['first-contentful-paint']?.numericValue,
        lcp: audits['largest-contentful-paint']?.numericValue,
        cls: audits['cumulative-layout-shift']?.numericValue,
        tbt: audits['total-blocking-time']?.numericValue,
        si: audits['speed-index']?.numericValue
      }
    };
  }

  generateReport() {
    console.log('\n📋 Performance Test Report');
    console.log('=' .repeat(50));
    
    // Build Performance
    if (this.results.buildTime) {
      console.log(`\n🏗️  Build Performance:`);
      console.log(`   Duration: ${this.results.buildTime.durationFormatted}`);
      console.log(`   Status: ${this.results.buildTime.duration < 60000 ? '✅ Good' : '⚠️  Slow'}`);
    }
    
    // Bundle Analysis
    if (this.results.bundleAnalysis) {
      console.log(`\n📦 Bundle Analysis:`);
      console.log(`   Main Bundle: ${this.results.bundleAnalysis.mainBundleSize}`);
      console.log(`   Total Size: ${this.results.bundleAnalysis.totalSize}`);
      console.log(`   Chunks: ${this.results.bundleAnalysis.chunkCount}`);
      
      const mainSizeStatus = this.results.bundleAnalysis.mainBundleSizeBytes < 500000 ? '✅ Good' : '⚠️  Large';
      console.log(`   Status: ${mainSizeStatus}`);
    }
    
    // Lighthouse Results
    if (this.results.lighthouse) {
      console.log(`\n🔍 Lighthouse Scores:`);
      console.log(`   Performance: ${this.results.lighthouse.performance || 'N/A'}%`);
      console.log(`   Accessibility: ${this.results.lighthouse.accessibility || 'N/A'}%`);
      console.log(`   Best Practices: ${this.results.lighthouse.bestPractices || 'N/A'}%`);
      console.log(`   SEO: ${this.results.lighthouse.seo || 'N/A'}%`);
      
      if (this.results.lighthouse.metrics) {
        console.log(`\n⚡ Core Web Vitals:`);
        const metrics = this.results.lighthouse.metrics;
        if (metrics.fcp) console.log(`   FCP: ${Math.round(metrics.fcp)}ms`);
        if (metrics.lcp) console.log(`   LCP: ${Math.round(metrics.lcp)}ms`);
        if (metrics.cls) console.log(`   CLS: ${metrics.cls.toFixed(3)}`);
        if (metrics.tbt) console.log(`   TBT: ${Math.round(metrics.tbt)}ms`);
        if (metrics.si) console.log(`   Speed Index: ${Math.round(metrics.si)}ms`);
      }
    }
    
    // Save detailed report
    this.saveDetailedReport();
    
    console.log(`\n📄 Detailed report saved to: performance-report.json`);
    console.log(`🕒 Test completed at: ${this.results.timestamp}\n`);
  }

  saveDetailedReport() {
    const reportPath = path.join(process.cwd(), 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run performance tests if called directly
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runAllTests().catch(console.error);
}

module.exports = PerformanceTester;