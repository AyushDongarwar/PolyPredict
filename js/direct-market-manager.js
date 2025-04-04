// Direct Market Manager for PolyPredict
// This file contains simplified functions for creating and resolving markets

// Initialize direct market manager
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing direct market manager...');
    
    // Set up event listeners
    setupDirectMarketListeners();
    
    // Initialize betting state if needed
    initializeBettingState();
});

// Set up event listeners for market management
function setupDirectMarketListeners() {
    // Create market button
    const createMarketBtn = document.getElementById('create-market-btn');
    if (createMarketBtn) {
        createMarketBtn.addEventListener('click', handleCreateMarket);
    }
    
    // Add outcome button
    const addOutcomeBtn = document.getElementById('add-outcome-btn');
    if (addOutcomeBtn) {
        addOutcomeBtn.addEventListener('click', addOutcomeField);
    }
    
    // Remove outcome buttons
    document.querySelectorAll('.remove-outcome-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.outcome-input').remove();
        });
    });
    
    // Resolve market button
    const resolveMarketBtn = document.getElementById('resolve-market-btn');
    if (resolveMarketBtn) {
        resolveMarketBtn.addEventListener('click', handleResolveMarket);
    }
    
    // Market selection change
    const marketSelect = document.getElementById('market-id');
    if (marketSelect) {
        marketSelect.addEventListener('change', handleMarketChange);
    }
}

// Initialize betting state
function initializeBettingState() {
    if (typeof window.bettingState === 'undefined') {
        window.bettingState = {
            markets: {},
            platformFee: 0.20,
            betAmount: 1,
            payoutMultiplier: 1.80,
            platformEarnings: 0
        };
        
        // Try to load from localStorage
        const savedState = localStorage.getItem('polypredict_betting_state');
        if (savedState) {
            try {
                window.bettingState = JSON.parse(savedState);
                console.log('Loaded bettingState from localStorage');
            } catch (e) {
                console.error('Error parsing bettingState:', e);
            }
        }
    }
}

// Handle create market button click
function handleCreateMarket() {
    console.log('Creating market...');
    
    // Get form values
    const title = document.getElementById('new-market-title').value;
    const description = document.getElementById('new-market-description').value;
    const category = document.getElementById('new-market-category').value;
    const endDate = document.getElementById('new-market-end-date').value;
    
    // Get outcomes
    const outcomeInputs = document.querySelectorAll('.outcome-input');
    const outcomes = [];
    
    outcomeInputs.forEach(input => {
        const name = input.querySelector('.outcome-name').value;
        const odds = input.querySelector('.outcome-odds').value;
        
        if (name && odds) {
            outcomes.push({
                name: name,
                odds: parseFloat(odds)
            });
        }
    });
    
    // Validate form
    if (!title) {
        alert('Please enter a market title');
        return;
    }
    
    if (!description) {
        alert('Please enter a market description');
        return;
    }
    
    if (!endDate) {
        alert('Please select an end date');
        return;
    }
    
    if (outcomes.length < 2) {
        alert('Please add at least two outcomes');
        return;
    }
    
    // Create market ID
    const marketId = Date.now().toString();
    
    // Create market in betting state
    if (typeof window.bettingState === 'undefined') {
        initializeBettingState();
    }
    
    // Initialize market in betting state
    window.bettingState.markets[marketId] = {
        id: marketId,
        title: title,
        description: description,
        category: category,
        createdAt: new Date().toISOString(),
        closingDate: new Date(endDate).toISOString(),
        status: 'open',
        outcomes: {},
        bets: []
    };
    
    // Add outcomes to market
    outcomes.forEach(outcome => {
        window.bettingState.markets[marketId].outcomes[outcome.name] = {
            odds: outcome.odds,
            bettors: [],
            totalBets: 0
        };
    });
    
    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(window.bettingState));
    
    // Show success message
    alert('Market created successfully!');
    
    // Reset form
    document.getElementById('new-market-title').value = '';
    document.getElementById('new-market-description').value = '';
    document.getElementById('new-market-end-date').value = '';
    
    // Reset outcomes
    const outcomeContainer = document.getElementById('outcome-inputs');
    outcomeContainer.innerHTML = `
        <div class="outcome-input" style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
            <div style="flex: 3;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Outcome Name</label>
                <input type="text" class="outcome-name" placeholder="e.g., Republican" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="flex: 1;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Odds</label>
                <input type="number" class="outcome-odds" placeholder="e.g., 1.8" min="1" step="0.1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="align-self: flex-end;">
                <button type="button" class="remove-outcome-btn" style="background-color: #ff7675; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; margin-bottom: 5px; display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="outcome-input" style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
            <div style="flex: 3;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Outcome Name</label>
                <input type="text" class="outcome-name" placeholder="e.g., Democrat" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="flex: 1;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Odds</label>
                <input type="number" class="outcome-odds" placeholder="e.g., 2.1" min="1" step="0.1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="align-self: flex-end;">
                <button type="button" class="remove-outcome-btn" style="background-color: #ff7675; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; margin-bottom: 5px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    
    // Re-attach event listeners to remove buttons
    document.querySelectorAll('.remove-outcome-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.outcome-input').remove();
        });
    });
    
    // Update market select options
    updateMarketSelectOptions();
    
    // Reload page to show new market
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Add outcome field
function addOutcomeField() {
    const outcomeContainer = document.getElementById('outcome-inputs');
    
    // Create new outcome input
    const outcomeInput = document.createElement('div');
    outcomeInput.className = 'outcome-input';
    outcomeInput.style.display = 'flex';
    outcomeInput.style.gap = '10px';
    outcomeInput.style.marginBottom = '15px';
    outcomeInput.style.alignItems = 'center';
    
    outcomeInput.innerHTML = `
        <div style="flex: 3;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Outcome Name</label>
            <input type="text" class="outcome-name" placeholder="Enter outcome name" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        <div style="flex: 1;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Odds</label>
            <input type="number" class="outcome-odds" placeholder="Enter odds" min="1" step="0.1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        <div style="align-self: flex-end;">
            <button type="button" class="remove-outcome-btn" style="background-color: #ff7675; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; margin-bottom: 5px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to container
    outcomeContainer.appendChild(outcomeInput);
    
    // Add event listener to remove button
    outcomeInput.querySelector('.remove-outcome-btn').addEventListener('click', function() {
        outcomeInput.remove();
    });
}

// Handle market change
function handleMarketChange() {
    const marketId = document.getElementById('market-id').value;
    const winningOutcomeSelect = document.getElementById('winning-outcome');
    
    // Clear existing options
    winningOutcomeSelect.innerHTML = '<option value="">Select winning outcome</option>';
    
    if (!marketId) return;
    
    // Get market from betting state
    if (typeof window.bettingState === 'undefined' || !window.bettingState.markets || !window.bettingState.markets[marketId]) {
        console.error('Market not found:', marketId);
        return;
    }
    
    const market = window.bettingState.markets[marketId];
    
    // Add outcomes to select
    Object.keys(market.outcomes).forEach(outcome => {
        const option = document.createElement('option');
        option.value = outcome;
        option.textContent = outcome;
        winningOutcomeSelect.appendChild(option);
    });
}

// Handle resolve market
function handleResolveMarket() {
    const marketId = document.getElementById('market-id').value;
    const winningOutcome = document.getElementById('winning-outcome').value;
    
    // Validate form
    if (!marketId) {
        alert('Please select a market');
        return;
    }
    
    if (!winningOutcome) {
        alert('Please select a winning outcome');
        return;
    }
    
    // Get market from betting state
    if (typeof window.bettingState === 'undefined' || !window.bettingState.markets || !window.bettingState.markets[marketId]) {
        console.error('Market not found:', marketId);
        alert('Market not found');
        return;
    }
    
    const market = window.bettingState.markets[marketId];
    
    // Check if market is already resolved
    if (market.status === 'resolved') {
        alert('This market is already resolved');
        return;
    }
    
    // Resolve market
    console.log(`Resolving market ${marketId} with winning outcome ${winningOutcome}`);
    
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
                const winnings = bet.amount * window.bettingState.payoutMultiplier;
                
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
                platformEarnings += bet.amount * window.bettingState.platformFee;
                
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
    window.bettingState.platformEarnings += platformEarnings;
    
    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(window.bettingState));
    
    // Show success message
    alert(`Market resolved successfully with winning outcome: ${winningOutcome}`);
    
    // Reload page to show updated market
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Update market select options
function updateMarketSelectOptions() {
    const marketSelect = document.getElementById('market-id');
    if (!marketSelect) return;
    
    // Clear existing options (except first)
    while (marketSelect.options.length > 1) {
        marketSelect.remove(1);
    }
    
    // Get markets from betting state
    if (typeof window.bettingState === 'undefined' || !window.bettingState.markets) {
        console.error('No markets found');
        return;
    }
    
    // Add markets to select
    Object.keys(window.bettingState.markets).forEach(marketId => {
        const market = window.bettingState.markets[marketId];
        
        const option = document.createElement('option');
        option.value = marketId;
        option.textContent = market.title || `Market ${marketId}`;
        marketSelect.appendChild(option);
    });
}
