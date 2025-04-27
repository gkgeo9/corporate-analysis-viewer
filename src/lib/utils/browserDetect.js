export function isSafari() {
    if (typeof window === 'undefined') return false;
    
    // For Safari on iOS and MacOS
    const ua = navigator.userAgent.toLowerCase();
    return /^((?!chrome|android).)*safari/.test(ua);
}

export function createSafariClass() {
    if (isSafari()) {
        return 'glass-safari';
    }
    return 'glass';
}
