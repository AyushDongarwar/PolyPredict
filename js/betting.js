// Betting System for PolyPredict

// Global state
let bettingState = {
    markets: {},  // Will store all market betting data
    platformFee: 0.20,  // 20% platform fee
    betAmount: 1,  // Fixed bet amount of 1 token
    payoutMultiplier: 1.80,  // Payout multiplier for winning bets
    platformEarnings: 0  // Total platform earnings
};

// Initialize betting system
function initBettingSystem() {
    console.log('Initializing betting system...');

    // Load existing betting data from localStorage if available
    const savedBettingState = localStorage.getItem('polypredict_betting_state');
    if (savedBettingState) {
        try {
            const parsedState = JSON.parse(savedBettingState);
            bettingState = { ...bettingState, ...parsedState };
            console.log('Loaded betting state:', bettingState);

            // Debug: Log the number of bets in each market
            if (bettingState.markets) {
                Object.keys(bettingState.markets).forEach(marketId => {
                    const market = bettingState.markets[marketId];
                    if (market.bets) {
                        console.log(`Market ${marketId} has ${market.bets.length} bets`);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading betting state:', error);
        }
    }

    // Set up bet buttons
    setupBetButtons();
}

// Set up bet buttons
function setupBetButtons() {
    // Main bet buttons
    const betButtons = document.querySelectorAll('.bet-btn');

    betButtons.forEach(button => {
        // Remove existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        // Add new event listener
        newButton.addEventListener('click', handleBetClick);
    });

    // Small bet buttons in outcomes
    const smallBetButtons = document.querySelectorAll('.bet-btn-sm');

    smallBetButtons.forEach(button => {
        // Remove existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        // Add new event listener
        newButton.addEventListener('click', handleBetClick);
    });
}

// Handle bet button click
async function handleBetClick(event) {
    event.preventDefault();

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

    // Check if user has enough tokens
    if (currentUser.tokenBalance < bettingState.betAmount) {
        alert(`You need at least ${bettingState.betAmount} token to place a bet. Please purchase more tokens.`);
        return;
    }

    // Initialize market in betting state if it doesn't exist
    if (!bettingState.markets[marketId]) {
        bettingState.markets[marketId] = {
            outcomes: {},
            bets: []
        };
    }

    // Initialize outcome in market if it doesn't exist
    if (!bettingState.markets[marketId].outcomes[outcome]) {
        bettingState.markets[marketId].outcomes[outcome] = {
            bettors: [],
            totalBets: 0
        };
    }

    // Check if user already bet on this outcome
    const alreadyBet = bettingState.markets[marketId].bets.some(bet =>
        bet.userId === currentUser.id && bet.outcome === outcome
    );

    if (alreadyBet) {
        alert('You have already placed a bet on this outcome');
        return;
    }

    // Check if there's an opponent (at least one bet on a different outcome)
    const hasOpponent = Object.keys(bettingState.markets[marketId].outcomes)
        .some(existingOutcome =>
            existingOutcome !== outcome &&
            bettingState.markets[marketId].outcomes[existingOutcome].totalBets > 0
        );

    // Create the bet
    const bet = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userEmail: currentUser.email,
        marketId,
        outcome,
        amount: bettingState.betAmount,
        odds,
        timestamp: new Date().toISOString(),
        status: hasOpponent ? 'active' : 'pending'
    };

    // If no opponent, show warning
    if (!hasOpponent) {
        const proceed = confirm(
            'There are no opposing bets yet. Your bet will be placed but will remain pending until someone bets on a different outcome. Proceed?'
        );

        if (!proceed) {
            return;
        }
    }

    // Add bet to market
    bettingState.markets[marketId].bets.push(bet);
    bettingState.markets[marketId].outcomes[outcome].bettors.push(currentUser.id);
    bettingState.markets[marketId].outcomes[outcome].totalBets += bettingState.betAmount;

    // Deduct tokens from user
    currentUser.tokenBalance -= bettingState.betAmount;

    // Add transaction record
    if (!currentUser.transactions) {
        currentUser.transactions = [];
    }

    currentUser.transactions.unshift({
        id: Date.now().toString(),
        type: 'Bet Placement',
        amount: -bettingState.betAmount,
        date: new Date().toISOString(),
        status: 'Completed',
        details: `Bet on ${outcome} in market "${getMarketTitle(marketId)}"`
    });

    // Update user in session and localStorage
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

    const users = JSON.parse(localStorage.getItem('polypredict_users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('polypredict_users', JSON.stringify(users));
    }

    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));

    // Update UI
    updateBettingUI(marketId);

    // Show success message
    alert(`Bet placed successfully on "${outcome}" for ${bettingState.betAmount} token. If you win, you'll receive ${bettingState.payoutMultiplier} tokens.`);

    // Check if this bet activated any pending bets
    activatePendingBets(marketId);
}

// Activate pending bets if there are now opponents
function activatePendingBets(marketId) {
    const market = bettingState.markets[marketId];
    if (!market) return;

    // Check if there are at least two outcomes with bets
    const outcomesWithBets = Object.keys(market.outcomes)
        .filter(outcome => market.outcomes[outcome].totalBets > 0);

    if (outcomesWithBets.length >= 2) {
        // Activate all pending bets
        market.bets.forEach(bet => {
            if (bet.status === 'pending') {
                bet.status = 'active';
            }
        });

        // Save betting state
        localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));
    }
}

// Get market title by ID
function getMarketTitle(marketId) {
    const marketCards = document.querySelectorAll('.market-card');
    for (let i = 0; i < marketCards.length; i++) {
        const card = marketCards[i];
        const cardBetBtn = card.querySelector('.bet-btn');
        if (cardBetBtn && cardBetBtn.getAttribute('data-market') === marketId) {
            return card.querySelector('.market-title').textContent;
        }
    }
    return `Market ${marketId}`;
}

// Update betting UI for a specific market
function updateBettingUI(marketId) {
    console.log(`Updating UI for market ${marketId}`);
    const market = bettingState.markets[marketId];
    if (!market) {
        console.log(`No market data found for market ${marketId}`);
        return;
    }

    console.log(`Market ${marketId} data:`, market);

    // Update token balance display
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const tokenBalanceElements = document.querySelectorAll('.token-balance h3');
        tokenBalanceElements.forEach(element => {
            element.textContent = `${currentUser.tokenBalance} PTK`;
        });
    }

    // Update market card to show betting status
    const marketCards = document.querySelectorAll('.market-card');
    for (let i = 0; i < marketCards.length; i++) {
        const card = marketCards[i];
        const cardBetBtn = card.querySelector('.bet-btn');
        if (cardBetBtn && cardBetBtn.getAttribute('data-market') === marketId) {
            // Find all outcome rows
            const outcomeRows = card.querySelectorAll('.outcome');
            outcomeRows.forEach(row => {
                const outcomeName = row.querySelector('.outcome-name').textContent;
                const outcome = market.outcomes[outcomeName];

                // If there are bets on this outcome
                if (outcome && outcome.totalBets > 0) {
                    console.log(`Outcome ${outcomeName} has ${outcome.bettors.length} bettors and ${outcome.totalBets} total bets`);

                    // Add bettors count
                    const bettorsCount = outcome.bettors.length;
                    let bettorsElement = row.querySelector('.bettors-count');

                    if (!bettorsElement) {
                        bettorsElement = document.createElement('span');
                        bettorsElement.className = 'bettors-count';
                        bettorsElement.style.marginLeft = '10px';
                        bettorsElement.style.fontSize = '0.8rem';
                        bettorsElement.style.color = '#666';
                        row.querySelector('.outcome-name').appendChild(bettorsElement);
                    }

                    bettorsElement.textContent = `(${bettorsCount} ${bettorsCount === 1 ? 'bet' : 'bets'})`;

                    // Check if current user bet on this outcome
                    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
                    if (currentUser && outcome.bettors.includes(currentUser.id)) {
                        row.style.backgroundColor = '#e6fffa';
                        row.style.borderColor = '#38b2ac';

                        // Add "Your Bet" indicator
                        let betIndicator = row.querySelector('.your-bet-indicator');
                        if (!betIndicator) {
                            betIndicator = document.createElement('span');
                            betIndicator.className = 'your-bet-indicator';
                            betIndicator.textContent = 'Your Bet';
                            betIndicator.style.backgroundColor = '#38b2ac';
                            betIndicator.style.color = 'white';
                            betIndicator.style.padding = '2px 6px';
                            betIndicator.style.borderRadius = '10px';
                            betIndicator.style.fontSize = '0.7rem';
                            betIndicator.style.marginLeft = '10px';
                            row.querySelector('.outcome-name').appendChild(betIndicator);
                        }
                    }
                }
            });

            // Disable bet button if user already bet on this market
            if (currentUser) {
                const userBet = market.bets.find(bet => bet.userId === currentUser.id);
                if (userBet) {
                    // Disable all bet buttons in this market
                    const allBetButtons = card.querySelectorAll('.bet-btn, .bet-btn-sm');
                    allBetButtons.forEach(btn => {
                        btn.disabled = true;
                        btn.textContent = btn.classList.contains('bet-btn-sm') ? 'Placed' : 'Bet Placed';
                        btn.style.backgroundColor = '#cbd5e0';
                        btn.style.cursor = 'not-allowed';
                    });
                }
            }
        }
    }
}

// Update all betting UI
function updateAllBettingUI() {
    Object.keys(bettingState.markets).forEach(marketId => {
        updateBettingUI(marketId);
    });
}

// Resolve a market (admin function)
function resolveMarket(marketId, winningOutcome) {
    const market = bettingState.markets[marketId];
    if (!market) return false;

    console.log(`Resolving market ${marketId} with winning outcome: ${winningOutcome}`);

    // Get all users
    const users = JSON.parse(localStorage.getItem('polypredict_users') || '[]');

    // Calculate platform earnings
    let platformEarnings = 0;

    // Process all bets
    market.bets.forEach(bet => {
        // Skip pending bets
        if (bet.status === 'pending') return;

        // Find user
        const userIndex = users.findIndex(u => u.id === bet.userId);
        if (userIndex === -1) return;

        const user = users[userIndex];

        // Check if bet won
        const won = bet.outcome === winningOutcome;

        if (won) {
            // Calculate winnings (original bet + profit)
            const winnings = bettingState.payoutMultiplier;

            // Add winnings to user balance
            user.tokenBalance += winnings;

            // Add transaction record
            if (!user.transactions) {
                user.transactions = [];
            }

            user.transactions.unshift({
                id: Date.now().toString() + '-' + bet.id,
                type: 'Bet Winnings',
                amount: winnings,
                date: new Date().toISOString(),
                status: 'Completed',
                details: `Won bet on ${bet.outcome} in market "${getMarketTitle(marketId)}"`
            });
        } else {
            // Add platform earnings
            platformEarnings += bet.amount;

            // Add transaction record for loss
            if (!user.transactions) {
                user.transactions = [];
            }

            user.transactions.unshift({
                id: Date.now().toString() + '-' + bet.id,
                type: 'Bet Loss',
                amount: 0, // No additional tokens lost (already deducted when placing bet)
                date: new Date().toISOString(),
                status: 'Completed',
                details: `Lost bet on ${bet.outcome} in market "${getMarketTitle(marketId)}"`
            });
        }

        // Update user
        users[userIndex] = user;

        // Mark bet as resolved
        bet.status = won ? 'won' : 'lost';
        bet.resolvedAt = new Date().toISOString();
    });

    // Mark market as resolved
    market.status = 'resolved';
    market.resolvedAt = new Date().toISOString();
    market.winningOutcome = winningOutcome;
    market.platformEarnings = platformEarnings;

    // Update total platform earnings
    bettingState.platformEarnings += platformEarnings;

    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));

    // Save users
    localStorage.setItem('polypredict_users', JSON.stringify(users));

    // Update current user session if needed
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const updatedUser = users.find(u => u.id === currentUser.id);
        if (updatedUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
    }

    return true;
}

// Force update all markets
function forceUpdateAllMarkets() {
    console.log('Force updating all markets...');

    // Make sure bettingState is initialized
    if (typeof bettingState === 'undefined' || !bettingState.markets) {
        console.log('No betting state found, initializing...');
        return;
    }

    // Update all markets
    Object.keys(bettingState.markets).forEach(marketId => {
        console.log(`Forcing update for market ${marketId}`);
        updateBettingUI(marketId);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initBettingSystem();
    updateAllBettingUI();

    // Force update all markets after a short delay
    setTimeout(forceUpdateAllMarkets, 1000);
});
