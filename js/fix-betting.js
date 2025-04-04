// Script to fix betting functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fixing betting functionality...');
    
    // Initialize betting state
    initializeBettingState();
    
    // Add event listeners to bet buttons
    addBetButtonListeners();
});

// Initialize betting state
function initializeBettingState() {
    console.log('Initializing betting state...');
    
    // Check if window.bettingState exists
    if (typeof window.bettingState === 'undefined') {
        // Create default betting state
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
                const parsedState = JSON.parse(savedState);
                window.bettingState = parsedState;
                console.log('Loaded betting state from localStorage');
            } catch (e) {
                console.error('Error parsing betting state:', e);
            }
        }
    }
    
    // Make sure bettingState is globally accessible
    window.bettingState = window.bettingState;
}

// Add event listeners to bet buttons
function addBetButtonListeners() {
    console.log('Adding bet button listeners...');
    
    // Regular bet buttons
    const betButtons = document.querySelectorAll('.bet-btn, .bet-btn-sm, .place-bet');
    
    betButtons.forEach(button => {
        // Remove existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new event listener
        newButton.addEventListener('click', handleBetClick);
    });
    
    console.log(`Added listeners to ${betButtons.length} bet buttons`);
}

// Handle bet button click
async function handleBetClick(event) {
    event.preventDefault();
    
    console.log('Bet button clicked');
    
    // Get current user
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Check if user is logged in
    if (!currentUser) {
        alert('Please sign in to place bets');
        window.location.href = 'login.html';
        return;
    }
    
    // Get bet details from button data attributes
    const marketId = this.getAttribute('data-market');
    const outcome = this.getAttribute('data-outcome');
    const odds = parseFloat(this.getAttribute('data-odds'));
    
    console.log(`Attempting to place bet: Market ${marketId}, Outcome: ${outcome}, Odds: ${odds}`);
    
    // Ensure betting state exists
    if (typeof window.bettingState === 'undefined') {
        console.error('Betting state not found');
        alert('Error: Betting state not found. Please refresh the page and try again.');
        return;
    }
    
    // Check if user has enough tokens
    if (currentUser.tokenBalance < window.bettingState.betAmount) {
        alert(`You need at least ${window.bettingState.betAmount} token to place a bet. Please purchase more tokens.`);
        return;
    }
    
    // Place the bet
    placeBet(marketId, outcome, odds);
}

// Place a bet
function placeBet(marketId, outcome, odds) {
    console.log(`Placing bet: Market ${marketId}, Outcome: ${outcome}, Odds: ${odds}`);
    
    // Get current user
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please sign in to place bets');
        return;
    }
    
    // Ensure betting state exists
    if (typeof window.bettingState === 'undefined') {
        console.error('Betting state not found');
        alert('Error: Betting state not found. Please refresh the page and try again.');
        return;
    }
    
    // Initialize market in betting state if it doesn't exist
    if (!window.bettingState.markets[marketId]) {
        window.bettingState.markets[marketId] = {
            outcomes: {},
            bets: []
        };
    }
    
    // Initialize outcome in market if it doesn't exist
    if (!window.bettingState.markets[marketId].outcomes[outcome]) {
        window.bettingState.markets[marketId].outcomes[outcome] = {
            bettors: [],
            totalBets: 0
        };
    }
    
    // Check if user already bet on this outcome
    const alreadyBet = window.bettingState.markets[marketId].bets.some(bet =>
        bet.userId === currentUser.id && bet.outcome === outcome
    );
    
    if (alreadyBet) {
        alert('You have already placed a bet on this outcome');
        return;
    }
    
    // Create bet object
    const bet = {
        id: `bet-${Date.now()}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        marketId: marketId,
        outcome: outcome,
        amount: window.bettingState.betAmount,
        odds: odds,
        timestamp: new Date().toISOString(),
        status: 'active'
    };
    
    // Add bet to market
    window.bettingState.markets[marketId].bets.push(bet);
    
    // Add user to outcome bettors
    window.bettingState.markets[marketId].outcomes[outcome].bettors.push(currentUser.id);
    
    // Increment total bets for outcome
    window.bettingState.markets[marketId].outcomes[outcome].totalBets++;
    
    // Deduct tokens from user
    currentUser.tokenBalance -= window.bettingState.betAmount;
    
    // Add transaction record
    if (!currentUser.transactions) {
        currentUser.transactions = [];
    }
    
    currentUser.transactions.unshift({
        id: `tx-${Date.now()}`,
        type: 'Bet Placed',
        amount: -window.bettingState.betAmount,
        date: new Date().toISOString(),
        status: 'Completed',
        details: `Bet placed on ${outcome} in market ${marketId}`
    });
    
    // Save updated user data
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update user in localStorage
    const users = JSON.parse(localStorage.getItem('polypredict_users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('polypredict_users', JSON.stringify(users));
    }
    
    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(window.bettingState));
    
    // Show success message
    alert(`Bet placed successfully on ${outcome}!`);
    
    // Reload page to update UI
    location.reload();
}
