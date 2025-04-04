// Security utilities for PolyPredict

/**
 * Simple password hashing function
 * Note: In a production environment, use a proper server-side hashing library like bcrypt
 * This is a client-side implementation for demo purposes only
 */
function hashPassword(password) {
    // This is a simple SHA-256 implementation for demo purposes
    // In production, use a proper server-side hashing with salt
    return sha256(password);
}

/**
 * SHA-256 implementation
 * Source: https://geraintluff.github.io/sha256/
 */
function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }

    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const lengthProperty = 'length';
    let i, j;
    let result = '';

    const words = [];
    const asciiBitLength = ascii[lengthProperty] * 8;

    // Initialize hash values
    let hash = sha256.h = sha256.h || [];
    // Round constants
    let k = sha256.k = sha256.k || [];
    let primeCounter = k[lengthProperty];

    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }

    ascii += '\x80'; // Append '1' bit (plus zero padding)
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00'; // More zero padding

    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII check: only accept characters in range 0-255
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength);

    // Process each chunk
    for (j = 0; j < words[lengthProperty];) {
        const w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        const oldHash = hash;
        // This is now the "working hash", often labelled as variables a...h
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            // Expand the message into 64 words
            const w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            const a = hash[0], e = hash[4];
            const temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e & hash[5]) ^ ((~e) & hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                    w[i - 16]
                    + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) // s0
                    + w[i - 7]
                    + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) // s1
                ) | 0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadable
            const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

            hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother to compute h, since h = hash[7]
            hash[4] = (hash[4] + temp1) | 0;
        }

        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }

    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            const b = (hash[i] >> (j * 8)) & 255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
}

/**
 * Generate a secure random token
 */
function generateSecureToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
        result += chars[values[i] % chars.length];
    }
    return result;
}

/**
 * Sanitize user input to prevent XSS attacks
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Add CSRF token to forms
 */
function addCSRFProtection() {
    // Generate a CSRF token if not already present
    if (!sessionStorage.getItem('csrf_token')) {
        sessionStorage.setItem('csrf_token', generateSecureToken());
    }

    // Add CSRF token to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // Check if form already has a CSRF token
        if (!form.querySelector('input[name="csrf_token"]')) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = sessionStorage.getItem('csrf_token');
            form.appendChild(csrfInput);
        }
    });
}

/**
 * Validate CSRF token
 */
function validateCSRFToken(token) {
    return token === sessionStorage.getItem('csrf_token');
}

/**
 * Protect sensitive user data by removing or masking private information
 */
function protectUserData(userData, forPublicDisplay = false) {
    // Create a deep copy to avoid modifying the original
    const protectedData = JSON.parse(JSON.stringify(userData));

    if (forPublicDisplay) {
        // For public display, remove all sensitive data
        delete protectedData.password;
        delete protectedData.dob;
        delete protectedData.email;
        delete protectedData.location;
        delete protectedData.walletAddress;
        delete protectedData.transactions;

        // Mask user ID
        if (protectedData.id) {
            protectedData.id = maskString(protectedData.id);
        }
    } else {
        // For internal use, just remove the most sensitive data
        delete protectedData.password;

        // Mask sensitive data
        if (protectedData.dob) {
            protectedData.dob = maskString(protectedData.dob);
        }

        if (protectedData.email) {
            // Keep first character and domain, mask the rest
            const parts = protectedData.email.split('@');
            if (parts.length === 2) {
                const username = parts[0];
                const domain = parts[1];
                const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1);
                protectedData.email = maskedUsername + '@' + domain;
            }
        }

        if (protectedData.walletAddress) {
            protectedData.walletAddress = maskString(protectedData.walletAddress);
        }

        // Mask transaction details
        if (protectedData.transactions && Array.isArray(protectedData.transactions)) {
            protectedData.transactions = protectedData.transactions.map(tx => {
                const maskedTx = { ...tx };
                if (maskedTx.id) {
                    maskedTx.id = maskString(maskedTx.id);
                }
                return maskedTx;
            });
        }
    }

    return protectedData;
}

/**
 * Mask a string for privacy
 */
function maskString(str, visibleChars = 4) {
    if (!str || typeof str !== 'string') return str;

    if (str.length <= visibleChars * 2) {
        return '*'.repeat(str.length);
    }

    const start = str.substring(0, visibleChars);
    const end = str.substring(str.length - visibleChars);
    const middle = '*'.repeat(Math.min(str.length - (visibleChars * 2), 8));

    return start + middle + end;
}

/**
 * Log data safely without exposing sensitive information
 */
function safeLog(data, message = 'Debug info') {
    let logData;

    if (typeof data === 'object' && data !== null) {
        // If it's a user object, protect it
        if (data.email || data.password || data.dob) {
            logData = protectUserData(data);
        } else {
            // For other objects, create a copy and remove common sensitive fields
            logData = JSON.parse(JSON.stringify(data));
            delete logData.password;
            delete logData.token;
            delete logData.secret;
            delete logData.key;
        }
    } else {
        logData = data;
    }

    console.log(message, logData);
}

// Initialize security features when the page loads
document.addEventListener('DOMContentLoaded', function () {
    // Add CSRF protection to forms
    addCSRFProtection();

    // Add event listeners to sanitize user input
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
    textInputs.forEach(input => {
        input.addEventListener('blur', function () {
            this.value = sanitizeInput(this.value);
        });
    });

    // Override console.log to prevent accidental data leakage
    const originalLog = console.log;
    console.log = function () {
        // Check if we're in development mode
        const isDevelopment = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:';

        // In production, filter sensitive data
        if (!isDevelopment) {
            // Check for sensitive data patterns in arguments
            const args = Array.from(arguments).map(arg => {
                if (typeof arg === 'object' && arg !== null) {
                    // If it looks like user data, protect it
                    if (arg.email || arg.password || arg.dob) {
                        return protectUserData(arg);
                    }
                    // If it's a string that looks like sensitive data, mask it
                } else if (typeof arg === 'string') {
                    // Mask potential emails
                    if (arg.includes('@') && arg.includes('.')) {
                        return arg.replace(/([^@\s]+)@([^\s]+)/g, function (match, p1, p2) {
                            return p1.charAt(0) + '*'.repeat(p1.length - 1) + '@' + p2;
                        });
                    }
                }
                return arg;
            });
            return originalLog.apply(console, args);
        }

        // In development, log normally
        return originalLog.apply(console, arguments);
    };
});
