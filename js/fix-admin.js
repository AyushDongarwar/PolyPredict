// Script to fix admin user and ensure secret admin tools work
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checking admin user...');
    
    // Fix admin user
    fixAdminUser();
    
    // Initialize secret admin toggle
    initSecretAdminToggle();
});

// Fix admin user
function fixAdminUser() {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('polypredict_users') || '[]');
    
    // Find admin user
    const adminIndex = users.findIndex(u => u.email === 'admin@polypredict.com');
    
    if (adminIndex !== -1) {
        // Ensure admin has isAdmin property set to true
        users[adminIndex].isAdmin = true;
        users[adminIndex].role = 'admin';
        
        // Save updated users
        localStorage.setItem('polypredict_users', JSON.stringify(users));
        console.log('Admin user fixed');
    } else {
        // Create admin user if it doesn't exist
        const adminUser = {
            id: 'admin-' + Date.now(),
            email: 'admin@polypredict.com',
            password: 'admin123', // This will be hashed on first login
            name: 'Admin',
            isAdmin: true,
            role: 'admin',
            tokenBalance: 1000,
            registrationDate: new Date().toISOString(),
            transactions: []
        };
        
        users.push(adminUser);
        localStorage.setItem('polypredict_users', JSON.stringify(users));
        console.log('Admin user created');
    }
    
    // Check current user
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.email === 'admin@polypredict.com') {
        // Ensure current admin session has isAdmin property
        currentUser.isAdmin = true;
        currentUser.role = 'admin';
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('Current admin session fixed');
    }
}

// Initialize secret admin toggle
function initSecretAdminToggle() {
    // Check if user is admin
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isAdmin) {
        console.log('User is not admin, skipping secret admin toggle');
        return;
    }
    
    console.log('User is admin, adding secret admin toggle');
    
    // Create toggle button if it doesn't exist
    if (!document.getElementById('secret-admin-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'secret-admin-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-user-secret"></i>';
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.bottom = '20px';
        toggleBtn.style.right = '20px';
        toggleBtn.style.width = '50px';
        toggleBtn.style.height = '50px';
        toggleBtn.style.borderRadius = '50%';
        toggleBtn.style.backgroundColor = '#2d3436';
        toggleBtn.style.color = 'white';
        toggleBtn.style.border = 'none';
        toggleBtn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.zIndex = '1000';
        toggleBtn.style.opacity = '0.7';
        toggleBtn.style.transition = 'all 0.3s ease';
        
        // Add hover effect
        toggleBtn.addEventListener('mouseover', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1.1)';
        });
        
        toggleBtn.addEventListener('mouseout', function() {
            this.style.opacity = '0.7';
            this.style.transform = 'scale(1)';
        });
        
        // Add click event
        toggleBtn.addEventListener('click', function() {
            toggleSecretAdminMode();
        });
        
        // Add to body
        document.body.appendChild(toggleBtn);
        console.log('Secret admin toggle added');
    }
}

// Toggle secret admin mode
function toggleSecretAdminMode() {
    console.log('Toggling secret admin mode');
    
    // Get or create admin state
    if (typeof window.adminToolsState === 'undefined') {
        window.adminToolsState = {
            secretMode: false
        };
    }
    
    // Toggle mode
    window.adminToolsState.secretMode = !window.adminToolsState.secretMode;
    
    // Update toggle button
    const toggleBtn = document.getElementById('secret-admin-toggle');
    if (window.adminToolsState.secretMode) {
        toggleBtn.style.backgroundColor = '#e74c3c';
        toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        // Show secret admin panel
        showSecretAdminPanel();
    } else {
        toggleBtn.style.backgroundColor = '#2d3436';
        toggleBtn.innerHTML = '<i class="fas fa-user-secret"></i>';
        
        // Hide secret admin panel
        hideSecretAdminPanel();
    }
}

// Show secret admin panel
function showSecretAdminPanel() {
    console.log('Showing secret admin panel');
    
    // Check if panel already exists
    if (document.getElementById('secret-admin-panel')) {
        document.getElementById('secret-admin-panel').style.display = 'block';
        return;
    }
    
    // Create panel
    const panel = document.createElement('div');
    panel.id = 'secret-admin-panel';
    panel.style.position = 'fixed';
    panel.style.top = '20px';
    panel.style.right = '20px';
    panel.style.width = '300px';
    panel.style.backgroundColor = 'white';
    panel.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    panel.style.borderRadius = '10px';
    panel.style.padding = '20px';
    panel.style.zIndex = '999';
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Secret Admin Tools';
    title.style.margin = '0 0 15px 0';
    title.style.color = '#e74c3c';
    panel.appendChild(title);
    
    // Add tools
    addSecretAdminTools(panel);
    
    // Add to body
    document.body.appendChild(panel);
}

// Hide secret admin panel
function hideSecretAdminPanel() {
    console.log('Hiding secret admin panel');
    
    const panel = document.getElementById('secret-admin-panel');
    if (panel) {
        panel.style.display = 'none';
    }
}

// Add secret admin tools to panel
function addSecretAdminTools(panel) {
    // Add market manipulation tools
    const marketTools = document.createElement('div');
    marketTools.style.marginBottom = '20px';
    
    // Add section title
    const sectionTitle = document.createElement('h4');
    sectionTitle.textContent = 'Market Manipulation';
    sectionTitle.style.margin = '0 0 10px 0';
    sectionTitle.style.fontSize = '16px';
    marketTools.appendChild(sectionTitle);
    
    // Add auto-generate bets button
    const generateBetsBtn = document.createElement('button');
    generateBetsBtn.textContent = 'Generate Random Bets';
    generateBetsBtn.style.display = 'block';
    generateBetsBtn.style.width = '100%';
    generateBetsBtn.style.padding = '8px';
    generateBetsBtn.style.marginBottom = '10px';
    generateBetsBtn.style.backgroundColor = '#3498db';
    generateBetsBtn.style.color = 'white';
    generateBetsBtn.style.border = 'none';
    generateBetsBtn.style.borderRadius = '5px';
    generateBetsBtn.style.cursor = 'pointer';
    
    // Add click event
    generateBetsBtn.addEventListener('click', function() {
        generateRandomBets();
    });
    
    marketTools.appendChild(generateBetsBtn);
    
    // Add resolve all markets button
    const resolveAllBtn = document.createElement('button');
    resolveAllBtn.textContent = 'Resolve All Markets';
    resolveAllBtn.style.display = 'block';
    resolveAllBtn.style.width = '100%';
    resolveAllBtn.style.padding = '8px';
    resolveAllBtn.style.marginBottom = '10px';
    resolveAllBtn.style.backgroundColor = '#2ecc71';
    resolveAllBtn.style.color = 'white';
    resolveAllBtn.style.border = 'none';
    resolveAllBtn.style.borderRadius = '5px';
    resolveAllBtn.style.cursor = 'pointer';
    
    // Add click event
    resolveAllBtn.addEventListener('click', function() {
        resolveAllMarkets();
    });
    
    marketTools.appendChild(resolveAllBtn);
    
    // Add reset all markets button
    const resetAllBtn = document.createElement('button');
    resetAllBtn.textContent = 'Reset All Markets';
    resetAllBtn.style.display = 'block';
    resetAllBtn.style.width = '100%';
    resetAllBtn.style.padding = '8px';
    resetAllBtn.style.backgroundColor = '#e74c3c';
    resetAllBtn.style.color = 'white';
    resetAllBtn.style.border = 'none';
    resetAllBtn.style.borderRadius = '5px';
    resetAllBtn.style.cursor = 'pointer';
    
    // Add click event
    resetAllBtn.addEventListener('click', function() {
        resetAllMarkets();
    });
    
    marketTools.appendChild(resetAllBtn);
    
    // Add to panel
    panel.appendChild(marketTools);
}

// Generate random bets for all markets
function generateRandomBets() {
    console.log('Generating random bets for all markets');
    
    // Get betting state
    let bettingState = window.bettingState;
    if (!bettingState || !bettingState.markets) {
        console.error('Betting state not found');
        alert('Error: Betting state not found');
        return;
    }
    
    // Get number of bets to generate
    const numBets = prompt('How many random bets would you like to generate per market?', '5');
    if (!numBets) return;
    
    const betsPerMarket = parseInt(numBets);
    if (isNaN(betsPerMarket) || betsPerMarket < 1) {
        alert('Please enter a valid number');
        return;
    }
    
    // Generate bets for each market
    let totalBets = 0;
    
    Object.keys(bettingState.markets).forEach(marketId => {
        const market = bettingState.markets[marketId];
        
        // Skip resolved markets
        if (market.status === 'resolved') return;
        
        // Get outcomes
        const outcomes = Object.keys(market.outcomes);
        if (!outcomes.length) return;
        
        // Generate random bets
        for (let i = 0; i < betsPerMarket; i++) {
            // Select random outcome
            const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            
            // Create bot user ID
            const botUserId = `bot-${Date.now()}-${i}-${marketId}`;
            
            // Create bet
            const bet = {
                id: `bet-${Date.now()}-${i}-${marketId}`,
                userId: botUserId,
                userEmail: `bot${Math.floor(Math.random() * 10000)}@example.com`,
                marketId,
                outcome: randomOutcome,
                amount: 1,
                timestamp: new Date().toISOString(),
                status: 'active',
                isBot: true
            };
            
            // Add bet to market
            if (!market.bets) {
                market.bets = [];
            }
            market.bets.push(bet);
            
            // Add bettor to outcome
            if (!market.outcomes[randomOutcome].bettors) {
                market.outcomes[randomOutcome].bettors = [];
            }
            market.outcomes[randomOutcome].bettors.push(botUserId);
            
            // Increment total bets
            market.outcomes[randomOutcome].totalBets = (market.outcomes[randomOutcome].totalBets || 0) + 1;
            
            totalBets++;
        }
    });
    
    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));
    
    // Show success message
    alert(`Successfully generated ${totalBets} random bets across all markets`);
    
    // Reload page to update UI
    location.reload();
}

// Resolve all markets
function resolveAllMarkets() {
    console.log('Resolving all markets');
    
    // Confirm resolution
    if (!confirm('Are you sure you want to resolve ALL markets with random outcomes? This cannot be undone.')) {
        return;
    }
    
    // Get betting state
    let bettingState = window.bettingState;
    if (!bettingState || !bettingState.markets) {
        console.error('Betting state not found');
        alert('Error: Betting state not found');
        return;
    }
    
    // Resolve each market
    let resolvedCount = 0;
    
    Object.keys(bettingState.markets).forEach(marketId => {
        const market = bettingState.markets[marketId];
        
        // Skip already resolved markets
        if (market.status === 'resolved') return;
        
        // Get outcomes
        const outcomes = Object.keys(market.outcomes);
        if (!outcomes.length) return;
        
        // Select random outcome as winner
        const winningOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        
        // Calculate platform earnings
        let platformEarnings = 0;
        
        // Process bets
        if (market.bets && Array.isArray(market.bets)) {
            market.bets.forEach(bet => {
                // Skip pending bets
                if (bet.status === 'pending') return;
                
                // Get user
                const users = JSON.parse(localStorage.getItem('polypredict_users') || '[]');
                const userIndex = users.findIndex(u => u.id === bet.userId);
                
                // Skip if user not found or is a bot
                if (userIndex === -1 || bet.isBot) return;
                
                // Check if bet won
                if (bet.outcome === winningOutcome) {
                    // Calculate winnings
                    const winnings = bet.amount * bettingState.payoutMultiplier;
                    
                    // Add winnings to user balance
                    users[userIndex].tokenBalance += winnings;
                    
                    // Add transaction record
                    if (!users[userIndex].transactions) {
                        users[userIndex].transactions = [];
                    }
                    
                    users[userIndex].transactions.unshift({
                        id: Date.now().toString(),
                        type: 'Bet Winnings',
                        amount: winnings,
                        date: new Date().toISOString(),
                        status: 'Completed',
                        details: `Winnings from bet on ${bet.outcome} in market "${market.title}"`
                    });
                    
                    // Update bet status
                    bet.status = 'won';
                } else {
                    // Add to platform earnings
                    platformEarnings += bet.amount * bettingState.platformFee;
                    
                    // Update bet status
                    bet.status = 'lost';
                }
            });
            
            // Update users in localStorage
            const users = JSON.parse(localStorage.getItem('polypredict_users') || '[]');
            localStorage.setItem('polypredict_users', JSON.stringify(users));
        }
        
        // Update market status
        market.status = 'resolved';
        market.resolvedAt = new Date().toISOString();
        market.winningOutcome = winningOutcome;
        market.platformEarnings = platformEarnings;
        
        // Update platform earnings
        bettingState.platformEarnings = (bettingState.platformEarnings || 0) + platformEarnings;
        
        resolvedCount++;
    });
    
    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));
    
    // Show success message
    alert(`Successfully resolved ${resolvedCount} markets with random outcomes`);
    
    // Reload page to update UI
    location.reload();
}

// Reset all markets
function resetAllMarkets() {
    console.log('Resetting all markets');
    
    // Confirm reset
    if (!confirm('Are you sure you want to RESET ALL MARKETS? This will delete all bets and set all markets back to open status. This cannot be undone.')) {
        return;
    }
    
    // Double confirm
    if (!confirm('THIS IS DESTRUCTIVE! Are you absolutely sure you want to reset all markets?')) {
        return;
    }
    
    // Get betting state
    let bettingState = window.bettingState;
    if (!bettingState || !bettingState.markets) {
        console.error('Betting state not found');
        alert('Error: Betting state not found');
        return;
    }
    
    // Reset each market
    Object.keys(bettingState.markets).forEach(marketId => {
        const market = bettingState.markets[marketId];
        
        // Reset bets
        market.bets = [];
        
        // Reset outcomes
        Object.keys(market.outcomes).forEach(outcomeName => {
            const outcome = market.outcomes[outcomeName];
            outcome.bettors = [];
            outcome.totalBets = 0;
        });
        
        // Reset status
        market.status = 'open';
        delete market.resolvedAt;
        delete market.winningOutcome;
        delete market.platformEarnings;
    });
    
    // Reset platform earnings
    bettingState.platformEarnings = 0;
    
    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));
    
    // Show success message
    alert('All markets have been reset successfully');
    
    // Reload page to update UI
    location.reload();
}
