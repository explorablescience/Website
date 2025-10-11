/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ErrorInfo } from "react";

export function TestErrorComponent() {
    throw Error("This is an error!");
    return <></>
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

// Called when the page is loaded
const logUserInfo = async () => {
    // Get IP Address
    const ipAddress = await getIP();

    // Performances measurements
    const performancesData = getPerformancesMeasurements();

    // Get window, document, navigator data
    const [windowData, documentData, navigatorData] = getWDNData();

    // Creates error report payload
    const payload = {
        source: {
            website: "mecanicascience.fr",
            page: "article_science_of_complexity"
        },
        type: "connection_report",
        payload: {
            timestamp: new Date().toISOString(),
            ipAddress,
            performances: performancesData,
            window: windowData,
            document: documentData,
            navigator: navigatorData
        }
    };

    console.log(payload);
    // // Send error report to server
    // fetch("https://api.mecanicascience.fr", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(payload)
    // });
};

// Called when a component registers an error
const logError = async (error: Error, info?: ErrorInfo) => {
    // Get IP Address
    const ipAddress = await getIP();

    // Performances measurements
    const performancesData = getPerformancesMeasurements();

    // Error data
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

    // Get window, document, navigator data
    const [windowData, documentData, navigatorData] = getWDNData();

    // Creates error report payload
    const payload = {
        source: {
            website: "mecanicascience.fr",
            page: "article_science_of_complexity"
        },
        type: "error_report",
        payload: {
            timestamp: new Date().toISOString(),
            ipAddress,
            error: errorData,
            performances: performancesData,
            window: windowData,
            document: documentData,
            navigator: navigatorData
        }
    };

    console.log(payload);
    // // Send error report to server
    // fetch("https://api.mecanicascience.fr", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(payload)
    // });
}

// Called when a user submits a comment
const logComment = async (name: string, email: string, messageContent: string): Promise<boolean> => {
    // Get IP Address
    const ipAddress = await getIP();

    // Get window, document, navigator data
    const [windowData, documentData, navigatorData] = getWDNData();

    // Creates error report payload
    const payload = {
        source: {
            website: "mecanicascience.fr",
            page: "article_science_of_complexity"
        },
        type: "contact_form",
        payload: {
            name,
            email,
            message: messageContent,
            trackingPayload: {
                timestamp: new Date().toISOString(),
                ipAddress,
                window: windowData,
                document: documentData,
                navigator: navigatorData
            }
        }
    };

    console.log(payload);
    // // Send error report to server
    // const response = await fetch("https://api.mecanicascience.fr", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(payload)
    // });

    // return response.ok;
    return true;
};

export default logError;
export { logUserInfo, logComment };
