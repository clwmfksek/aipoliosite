// Performance monitoring script
(function () {
  'use strict';

  // Check if performance APIs are supported
  if (!window.performance || !window.performance.mark) {
    console.warn('Performance API not supported');
    return;
  }

  // Core Web Vitals tracking
  let vitals = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  };

  // Largest Contentful Paint (LCP)
  function observeLCP() {
    try {
      const observer = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = Math.round(lastEntry.startTime);
          console.log('LCP:', vitals.lcp + 'ms');
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observation failed:', e);
    }
  }

  // First Input Delay (FID)
  function observeFID() {
    try {
      const observer = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (entry.processingStart && entry.startTime) {
            vitals.fid = Math.round(entry.processingStart - entry.startTime);
            console.log('FID:', vitals.fid + 'ms');
          }
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observation failed:', e);
    }
  }

  // Cumulative Layout Shift (CLS)
  function observeCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        vitals.cls = Math.round(clsValue * 1000) / 1000;
        console.log('CLS:', vitals.cls);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observation failed:', e);
    }
  }

  // First Contentful Paint (FCP)
  function observeFCP() {
    try {
      const observer = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            vitals.fcp = Math.round(entry.startTime);
            console.log('FCP:', vitals.fcp + 'ms');
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP observation failed:', e);
    }
  }

  // Time to First Byte (TTFB)
  function measureTTFB() {
    try {
      const navEntry = performance.getEntriesByType('navigation')[0];
      if (navEntry && navEntry.responseStart && navEntry.requestStart) {
        vitals.ttfb = Math.round(navEntry.responseStart - navEntry.requestStart);
        console.log('TTFB:', vitals.ttfb + 'ms');
      }
    } catch (e) {
      console.warn('TTFB measurement failed:', e);
    }
  }

  // Page load performance
  function measurePageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navEntry = performance.getEntriesByType('navigation')[0];
        if (navEntry) {
          console.group('📊 Page Performance Metrics');
          console.log(
            'DOM Content Loaded:',
            Math.round(navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart) +
              'ms'
          );
          console.log(
            'Full Page Load:',
            Math.round(navEntry.loadEventEnd - navEntry.loadEventStart) + 'ms'
          );
          console.log(
            'Total Load Time:',
            Math.round(navEntry.loadEventEnd - navEntry.fetchStart) + 'ms'
          );
          console.groupEnd();
        }
      }, 0);
    });
  }

  // Resource loading performance
  function measureResources() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const resources = performance.getEntriesByType('resource');
        const resourceTypes = {};

        resources.forEach(resource => {
          const type = resource.initiatorType || 'other';
          if (!resourceTypes[type]) {
            resourceTypes[type] = { count: 0, totalSize: 0, totalTime: 0 };
          }
          resourceTypes[type].count++;
          resourceTypes[type].totalTime += resource.duration;
          if (resource.transferSize) {
            resourceTypes[type].totalSize += resource.transferSize;
          }
        });

        console.group('📦 Resource Performance');
        Object.entries(resourceTypes).forEach(([type, stats]) => {
          console.log(
            `${type}: ${stats.count} files, ${Math.round(stats.totalTime)}ms avg, ${Math.round(stats.totalSize / 1024)}KB`
          );
        });
        console.groupEnd();
      }, 1000);
    });
  }

  // Send vitals to analytics (placeholder)
  function sendVitalsToAnalytics() {
    // This would typically send data to your analytics service
    // For now, we'll just log the final metrics
    window.addEventListener('beforeunload', () => {
      console.group('🎯 Final Core Web Vitals');
      console.log('LCP:', vitals.lcp ? vitals.lcp + 'ms' : 'Not measured');
      console.log('FID:', vitals.fid ? vitals.fid + 'ms' : 'Not measured');
      console.log('CLS:', vitals.cls !== null ? vitals.cls : 'Not measured');
      console.log('FCP:', vitals.fcp ? vitals.fcp + 'ms' : 'Not measured');
      console.log('TTFB:', vitals.ttfb ? vitals.ttfb + 'ms' : 'Not measured');
      console.groupEnd();
    });
  }

  // Initialize all observers
  function init() {
    console.log('🚀 Performance monitoring initialized');

    observeLCP();
    observeFID();
    observeCLS();
    observeFCP();
    measureTTFB();
    measurePageLoad();
    measureResources();
    sendVitalsToAnalytics();
  }

  // Start monitoring when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
