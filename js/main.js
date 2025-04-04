// Main JavaScript file for Polymarket Clone

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Wallet Connection
    setupWalletConnection();
    
    // Tab Navigation
    setupTabs();
    
    // Login Page
    setupLoginOptions();
    
    // Token Purchase
    setupTokenPurchase();
});

// Wallet Connection
function setupWalletConnection() {
    const connectWalletBtns = document.querySelectorAll('.connect-wallet-btn');
    if (connectWalletBtns.length === 0) return;
    
    connectWalletBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                // Check if MetaMask is installed
                if (typeof window.ethereum !== 'undefined') {
                    console.log('MetaMask is installed!');
                    
                    // Request account access
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const account = accounts[0];
                    
                    // Update UI
                    updateWalletUI(account);
                    
                    // Store in session
                    sessionStorage.setItem('walletAddress', account);
                    
                    console.log('Connected account:', account);
                } else if (typeof window.solana !== 'undefined') {
                    // Phantom wallet
                    console.log('Phantom is installed!');
                    
                    // Connect to Phantom
                    const resp = await window.solana.connect();
                    const account = resp.publicKey.toString();
                    
                    // Update UI
                    updateWalletUI(account);
                    
                    // Store in session
                    sessionStorage.setItem('walletAddress', account);
                    
                    console.log('Connected account:', account);
                } else {
                    alert('Please install MetaMask or Phantom wallet!');
                }
            } catch (error) {
                console.error('Error connecting wallet:', error);
                alert('Failed to connect wallet. Please try again.');
            }
        });
    });
    
    // Check if already connected
    const savedAddress = sessionStorage.getItem('walletAddress');
    if (savedAddress) {
        updateWalletUI(savedAddress);
    }
}

function updateWalletUI(account) {
    const connectBtns = document.querySelectorAll('.connect-wallet-btn');
    const walletInfo = document.querySelectorAll('.wallet-info');
    const walletAddress = document.querySelectorAll('.wallet-address');
    
    // Update connect buttons
    connectBtns.forEach(btn => {
        btn.textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
        btn.classList.add('connected');
    });
    
    // Update wallet info sections
    walletInfo.forEach(info => {
        if (info.classList.contains('hidden')) {
            info.classList.remove('hidden');
        }
    });
    
    // Update wallet address displays
    walletAddress.forEach(addr => {
        addr.textContent = account;
    });
    
    // Show elements that require wallet connection
    document.querySelectorAll('.wallet-required').forEach(el => {
        el.classList.remove('hidden');
    });
}

// Tab Navigation
function setupTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all tab contents
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });
                
                // Show selected tab content
                const targetId = tab.getAttribute('data-tab');
                const targetContent = document.getElementById(`${targetId}-content`);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                }
            });
        });
    });
}

// Login Page
function setupLoginOptions() {
    const loginOptions = document.querySelectorAll('.login-option');
    const loginForms = document.querySelectorAll('.login-form');
    
    if (loginOptions.length === 0) return;
    
    loginOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            loginOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Hide all forms
            loginForms.forEach(form => {
                form.classList.add('hidden');
            });
            
            // Show selected form
            const targetForm = document.getElementById(`${option.getAttribute('data-form')}-form`);
            if (targetForm) {
                targetForm.classList.remove('hidden');
            }
        });
    });
    
    // Handle login form submission
    const loginForm = document.getElementById('email-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real app, you would send this to your backend
            console.log('Login attempt:', { email, password });
            
            // Simulate successful login
            alert('Login successful!');
            window.location.href = 'dashboard.html';
        });
    }
    
    // Handle registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const dob = document.getElementById('dob').value;
            const location = document.getElementById('location').value;
            
            // Simple validation
            if (!email || !password || !dob || !location) {
                alert('Please fill in all fields');
                return;
            }
            
            // Age verification (must be 18+)
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                alert('You must be at least 18 years old to register');
                return;
            }
            
            // In a real app, you would send this to your backend
            console.log('Registration attempt:', { email, password, dob, location });
            
            // Simulate successful registration
            alert('Registration successful! Please log in.');
            
            // Switch to login form
            document.querySelector('[data-form="email"]').click();
        });
    }
}

// Token Purchase
function setupTokenPurchase() {
    const purchaseTabs = document.querySelectorAll('.purchase-tab');
    const purchaseContents = document.querySelectorAll('.purchase-content');
    
    if (purchaseTabs.length === 0) return;
    
    purchaseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            purchaseTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all contents
            purchaseContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show selected content
            const targetContent = document.getElementById(`${tab.getAttribute('data-tab')}-content`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
    
    // Amount presets
    const amountPresets = document.querySelectorAll('.amount-preset');
    const amountInputs = document.querySelectorAll('.amount-input input');
    
    amountPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const amount = preset.getAttribute('data-amount');
            const targetInput = document.querySelector(`#${preset.getAttribute('data-target')}`);
            
            if (targetInput) {
                targetInput.value = amount;
                updatePurchaseSummary(targetInput);
            }
            
            // Update active state
            const presetGroup = preset.closest('.amount-presets');
            presetGroup.querySelectorAll('.amount-preset').forEach(p => {
                p.classList.remove('active');
            });
            preset.classList.add('active');
        });
    });
    
    // Amount input changes
    amountInputs.forEach(input => {
        input.addEventListener('input', () => {
            updatePurchaseSummary(input);
        });
    });
    
    // Payment methods
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            const methodGroup = method.closest('.payment-methods');
            methodGroup.querySelectorAll('.payment-method').forEach(m => {
                m.classList.remove('active');
            });
            method.classList.add('active');
        });
    });
    
    // Purchase buttons
    const purchaseButtons = document.querySelectorAll('.purchase-btn');
    
    purchaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const form = button.closest('form');
            const amountInput = form.querySelector('input[type="number"]');
            const amount = parseFloat(amountInput.value);
            
            if (!amount || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }
            
            const paymentMethod = form.querySelector('.payment-method.active');
            if (!paymentMethod) {
                alert('Please select a payment method');
                return;
            }
            
            // In a real app, you would process the payment here
            console.log('Purchase attempt:', {
                amount,
                paymentMethod: paymentMethod.getAttribute('data-method'),
                type: button.getAttribute('data-type')
            });
            
            // Simulate successful purchase
            alert(`Successfully purchased ${amount} tokens!`);
            amountInput.value = '';
            updatePurchaseSummary(amountInput);
        });
    });
}

function updatePurchaseSummary(input) {
    const amount = parseFloat(input.value) || 0;
    const summaryContainer = input.closest('form').querySelector('.purchase-summary');
    
    if (summaryContainer) {
        const tokenAmount = summaryContainer.querySelector('.token-amount');
        const fee = summaryContainer.querySelector('.fee-amount');
        const total = summaryContainer.querySelector('.total-amount');
        
        if (tokenAmount) tokenAmount.textContent = amount.toFixed(2);
        
        // Calculate fee (e.g., 2%)
        const feeValue = amount * 0.02;
        if (fee) fee.textContent = feeValue.toFixed(2);
        
        // Calculate total
        const totalValue = amount + feeValue;
        if (total) total.textContent = totalValue.toFixed(2);
    }
}
