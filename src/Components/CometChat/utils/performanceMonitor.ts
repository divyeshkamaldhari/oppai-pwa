export class PerformanceMonitor {
    private static startTimes: Map<string, number> = new Map();

    /**
     * Start timing a specific operation
     */
    static startTimer(label: string): void {
        this.startTimes.set(label, performance.now());
    }

    /**
     * End timing and log the duration
     */
    static endTimer(label: string): number {
        const startTime = this.startTimes.get(label);
        if (!startTime) {
            console.warn(`Timer '${label}' was not started`);
            return 0;
        }

        const duration = performance.now() - startTime;
        this.startTimes.delete(label);
        return duration;
    }

    /**
     * Measure a function execution time
     */
    static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
        this.startTimer(label);
        try {
            const result = await fn();
            this.endTimer(label);
            return result;
        } catch (error) {
            this.endTimer(label);
            throw error;
        }
    }

    /**
     * Log application initialization metrics
     */
    static logInitMetrics(): void {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const metrics = {
                "DNS Lookup": timing.domainLookupEnd - timing.domainLookupStart,
                "TCP Connection": timing.connectEnd - timing.connectStart,
                "Server Response": timing.responseEnd - timing.requestStart,
                "DOM Loading": timing.domContentLoadedEventEnd - timing.domLoading,
                "Page Load": timing.loadEventEnd - timing.navigationStart,
            };

            Object.entries(metrics).forEach(([key, value]) => {});
        }
    }

    /**
     * Monitor Core Web Vitals
     */
    static monitorWebVitals(): void {
        // Monitor Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
        }).observe({ entryTypes: ["largest-contentful-paint"] });

        // Monitor First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry: any) => {});
        }).observe({ entryTypes: ["first-input"] });

        // Monitor Cumulative Layout Shift (CLS)
        let clsScore = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry: any) => {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                }
            });
        }).observe({ entryTypes: ["layout-shift"] });
    }
}
