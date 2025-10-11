/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorInfo } from "react";
import { DataStructure, DataType } from "../data_types";

function isLocalhost() {
    try {
        if (typeof window === 'undefined') return true;
        const host = window.location?.hostname || '';
        if (host === 'localhost' || host === '127.0.0.1' || host === '192.168.0.44') return true;
    } catch {
        return true;
    }
    return false;
}

function getApiEndpoint() {
    return '/api';
}

async function getIP() {
    // Get IP Address
    let ipAddress = "unknown";
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
    } catch { }

    return ipAddress;
}

function getWDNData() {
    // Window data
    let windowData = {};
    try {
        windowData = {
            href: window.location.href,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            browserWindowSize: {
                width: window.outerWidth,
                height: window.outerHeight
            },
            screenSize: {
                width: window.screen.width,
                height: window.screen.height
            },
            devicePixelRatio: window.devicePixelRatio,
        };
    } catch { }

    // Get document data
    let documentData = {};
    try {
        documentData = {
            title: document.title,
            referrer: document.referrer,
            readyState: document.readyState,
            charset: document.characterSet,
            lang: document.documentElement.lang,
            url: document.URL,
            visibilityState: document.visibilityState
        };
    } catch { }

    // Get navigator data
    let navigatorData = {};
    try {
        navigatorData = {
            connection: {
                effectiveType: (navigator as any).connection?.effectiveType || "unknown",
                downlink: (navigator as any).connection?.downlink || 0,
                rtt: (navigator as any).connection?.rtt || 0
            },
            cookieEnabled: navigator.cookieEnabled,
            deviceMemory: (navigator as any).deviceMemory || 0,
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency || 0,
            language: navigator.language,
            languages: navigator.languages,
            onLine: navigator.onLine,
            userAgent: navigator.userAgent,
            userAgentData: {
                brands: (navigator as any).userAgentData?.brands || [],
                mobile: (navigator as any).userAgentData?.mobile || false,
                platform: (navigator as any).userAgentData?.platform || ""
            },
            webdriver: (navigator as any).webdriver || false
        };
    } catch { }

    return [windowData, documentData, navigatorData];
}

function getPerformancesMeasurements() {
    let performancesData = {};
    try {
        const performances = ['element', 'event', 'first-input', 'largest-contentful-paint', 'layout-shift', 'long-animation-frame', 'longtask', 'mark', 'measure', 'navigation', 'paint', 'resource', 'visibility-state'];
        performancesData = {
            eventCounts: (window.performance as any)?.eventCounts || {},
            memory: {
                jsHeapSizeLimit: (window.performance as any)?.memory?.jsHeapSizeLimit || 0,
                totalJSHeapSize: (window.performance as any)?.memory?.totalJSHeapSize || 0,
                usedJSHeapSize: (window.performance as any)?.memory?.usedJSHeapSize || 0
            },
            entries: performances
        };
    } catch { }

    return performancesData;
}

export async function postUserInformations() {
    // Create payload
    const ipAddress = await getIP();
    const [windowData, documentData, navigatorData] = getWDNData();
    const payload = {
        type: DataType.CONNECTION_REPORT,
        payload: {
            timestamp: new Date().toISOString(),
            ipAddress,
            window: windowData,
            document: documentData,
            navigator: navigatorData
        }
    } as DataStructure;

    // Send report to server
    if (isLocalhost()) {
        console.log('[Analytics] Skipped posting user informations (localhost/dev)', payload);
    }
    fetch(getApiEndpoint(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
};

export async function postError(error: Error, info?: ErrorInfo) {
    // Create payload
    const ipAddress = await getIP();
    const performancesData = getPerformancesMeasurements();
    let errorData = {};
    try {
        errorData = {
            name: error.name,
            message: error.message,
            cause: error.cause,
            stack: error.stack,
            digest: info?.digest || "",
            componentStack: info?.componentStack || ""
        };
    } catch { }
    const [windowData, documentData, navigatorData] = getWDNData();
    const payload = {
        type: DataType.ERROR_REPORT,
        payload: {
            timestamp: new Date().toISOString(),
            ipAddress,
            error: errorData,
            performances: performancesData,
            window: windowData,
            document: documentData,
            navigator: navigatorData
        }
    } as DataStructure;

    // Send report to server
    if (isLocalhost()) {
        console.log('[Analytics] Skipped posting error report (localhost/dev)', payload);
    }
    console.log("Posting error report:", payload);
    fetch(getApiEndpoint(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
}

export async function postComment(name: string, email: string, message: string): Promise<boolean> {
    // Create payload
    const ipAddress = await getIP();
    const [windowData, documentData, navigatorData] = getWDNData();
    const payload = {
        type: DataType.COMMENT,
        payload: {
            name,
            email,
            message,
            trackingPayload: {
                timestamp: new Date().toISOString(),
                ipAddress,
                window: windowData,
                document: documentData,
                navigator: navigatorData
            }
        }
    };

    // Send report to server
    if (isLocalhost()) {
        console.log('[Analytics] Skipped posting comment (localhost/dev)', payload);
    }
    return (await fetch(getApiEndpoint(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })).ok;
}
