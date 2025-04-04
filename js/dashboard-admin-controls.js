// Script to add admin controls to the dashboard
document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing dashboard admin controls...');

    // Check if user is admin
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        console.log('User is not admin, skipping admin controls');
        return;
    }

    console.log('User is admin, adding admin controls');

    // Add admin controls to all market cards
    addAdminControlsToMarketCards();

    // Add admin header to dashboard
    addAdminHeader();
});

// Add admin controls to all market cards
function addAdminControlsToMarketCards() {
    // Find all market cards
    const marketCards = document.querySelectorAll('.market-card');
    if (!marketCards.length) {
        console.log('No market cards found');
        return;
    }

    console.log(`Found ${marketCards.length} market cards`);

    // Add admin controls to each market card
    marketCards.forEach(card => {
        // Get market ID
        const marketId = card.dataset.marketId;
        if (!marketId) {
            console.log('Market card has no ID, skipping');
            return;
        }

        // Add admin panel
        addAdminPanelToMarketCard(card, marketId);
    });
}

// Add admin panel to market card
function addAdminPanelToMarketCard(card, marketId) {
    // Create admin panel
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    adminPanel.style.cssText = `
        background-color: #ffebee;
        border-top: 1px solid #ffcdd2;
        padding: 10px 15px;
        margin-top: 10px;
    `;

    // Add admin panel title
    const title = document.createElement('h4');
    title.textContent = 'Admin Controls';
    title.style.cssText = `
        margin: 0 0 10px 0;
        font-size: 14px;
        color: #c62828;
    `;
    adminPanel.appendChild(title);

    // Get outcomes
    const outcomeElements = card.querySelectorAll('.outcome-name');
    const outcomes = [];

    outcomeElements.forEach(el => {
        // Clean up the text content (remove any nested elements' text)
        let outcomeText = el.textContent.trim();
        // Remove any nested spans (like bettors count)
        const nestedSpans = el.querySelectorAll('span');
        nestedSpans.forEach(span => {
            outcomeText = outcomeText.replace(span.textContent, '').trim();
        });
        outcomes.push(outcomeText);
    });

    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 10px;
    `;

    // Add buttons for each outcome
    outcomes.forEach(outcome => {
        const button = document.createElement('button');
        button.textContent = `Add Bet: ${outcome}`;
        button.style.cssText = `
            background-color: #c62828;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 12px;
            cursor: pointer;
        `;

        // Add click event
        button.addEventListener('click', function () {
            placeAdminBet(marketId, outcome);
        });

        buttonsContainer.appendChild(button);
    });

    adminPanel.appendChild(buttonsContainer);

    // Add delete all bets button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete All Bets for this Market';
    deleteButton.style.cssText = `
        background-color: #e53e3e;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 10px;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        margin-top: 5px;
        margin-bottom: 5px;
    `;

    // Add click event
    deleteButton.addEventListener('click', function () {
        deleteAllBetsForMarket(marketId);
    });

    adminPanel.appendChild(deleteButton);

    // Add resolve market section
    const resolveSection = document.createElement('div');
    resolveSection.style.cssText = `
        margin-top: 10px;
        display: flex;
        gap: 5px;
    `;

    // Add outcome select
    const outcomeSelect = document.createElement('select');
    outcomeSelect.style.cssText = `
        flex: 1;
        padding: 5px;
        border-radius: 4px;
        border: 1px solid #ddd;
    `;

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select winning outcome';
    outcomeSelect.appendChild(defaultOption);

    // Add options for each outcome
    outcomes.forEach(outcome => {
        const option = document.createElement('option');
        option.value = outcome;
        option.textContent = outcome;
        outcomeSelect.appendChild(option);
    });

    resolveSection.appendChild(outcomeSelect);

    // Add resolve button
    const resolveButton = document.createElement('button');
    resolveButton.textContent = 'Resolve Market';
    resolveButton.style.cssText = `
        background-color: #2e7d32;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 12px;
        cursor: pointer;
    `;

    // Add click event
    resolveButton.addEventListener('click', function () {
        const winningOutcome = outcomeSelect.value;
        if (!winningOutcome) {
            alert('Please select a winning outcome');
            return;
        }

        resolveMarket(marketId, winningOutcome);
    });

    resolveSection.appendChild(resolveButton);

    adminPanel.appendChild(resolveSection);

    // Add admin panel to market card
    card.appendChild(adminPanel);
}

// Add admin header to dashboard
function addAdminHeader() {
    // Create admin header
    const adminHeader = document.createElement('div');
    adminHeader.className = 'admin-header';
    adminHeader.style.cssText = `
        background-color: #ffebee;
        border: 1px solid #ffcdd2;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 8px;
    `;

    // Add admin header title
    const title = document.createElement('h3');
    title.textContent = 'Admin Mode';
    title.style.cssText = `
        margin: 0 0 10px 0;
        color: #c62828;
    `;
    adminHeader.appendChild(title);

    // Add admin header description
    const description = document.createElement('p');
    description.textContent = 'You are viewing the dashboard in admin mode. You can add bets, delete bets, and resolve markets using the admin controls on each market card.';
    description.style.cssText = `
        margin: 0;
        font-size: 14px;
    `;
    adminHeader.appendChild(description);

    // Add admin header to page
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(adminHeader, container.firstChild);
    }
}

// Place admin bet
function placeAdminBet(marketId, outcome) {
    console.log(`Placing admin bet on ${outcome} for market ${marketId}`);

    // Get betting state
    let bettingState = window.bettingState;
    if (!bettingState) {
        console.error('Betting state not found');
        alert('Error: Betting state not found');
        return;
    }

    // Get market
    const market = bettingState.markets[marketId];
    if (!market) {
        console.error(`Market ${marketId} not found`);
        alert(`Error: Market ${marketId} not found`);
        return;
    }

    // Get outcome
    const marketOutcome = market.outcomes[outcome];
    if (!marketOutcome) {
        console.error(`Outcome ${outcome} not found in market ${marketId}`);
        alert(`Error: Outcome ${outcome} not found in market ${marketId}`);
        return;
    }

    // Create bot user ID
    const botUserId = `bot-${Date.now()}`;

    // Create bet
    const bet = {
        id: `bet-${Date.now()}`,
        userId: botUserId,
        userEmail: `bot${Math.floor(Math.random() * 10000)}@example.com`,
        marketId,
        outcome,
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
    if (!marketOutcome.bettors) {
        marketOutcome.bettors = [];
    }
    marketOutcome.bettors.push(botUserId);

    // Increment total bets
    marketOutcome.totalBets = (marketOutcome.totalBets || 0) + 1;

    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));

    // Show success message
    alert(`Admin bet placed on ${outcome} in market ${market.title || marketId}`);

    // Reload page to update UI
    location.reload();
}

// Delete all bets for market
function deleteAllBetsForMarket(marketId) {
    console.log(`Deleting all bets for market ${marketId}`);

    // Get market title for better confirmation message
    let marketTitle = '';
    try {
        const market = window.bettingState?.markets?.[marketId];
        if (market && market.title) {
            marketTitle = market.title;
        }
    } catch (e) {
        console.error('Error getting market title:', e);
    }

    // Confirm deletion with market title if available
    const confirmMessage = marketTitle
        ? `Are you sure you want to delete ALL BETS for the market: "${marketTitle}"?`
        : `Are you sure you want to delete ALL BETS for this market?`;

    if (!confirm(confirmMessage)) {
        return;
    }

    // Get betting state
    let bettingState = window.bettingState;
    if (!bettingState) {
        console.error('Betting state not found');
        alert('Error: Betting state not found');
        return;
    }

    // Get market
    const market = bettingState.markets[marketId];
    if (!market) {
        console.error(`Market ${marketId} not found`);
        alert(`Error: Market ${marketId} not found`);
        return;
    }

    // Reset bets
    market.bets = [];

    // Reset outcomes
    Object.keys(market.outcomes).forEach(outcomeName => {
        const outcome = market.outcomes[outcomeName];
        outcome.bettors = [];
        outcome.totalBets = 0;
    });

    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));

    // Show success message with market title
    const successMessage = market.title
        ? `SUCCESS: All bets have been deleted for the market: "${market.title}"`
        : `SUCCESS: All bets have been deleted for market ${marketId}`;

    alert(successMessage);
    console.log(successMessage);

    // Reload page to update UI
    location.reload();
}

// Resolve market
function resolveMarket(marketId, winningOutcome) {
    console.log(`Resolving market ${marketId} with winning outcome ${winningOutcome}`);

    // Confirm resolution
    if (!confirm(`Are you sure you want to resolve this market with winning outcome: ${winningOutcome}?`)) {
        return;
    }

    // Get betting state
    let bettingState = window.bettingState;
    if (!bettingState) {
        console.error('Betting state not found');
        alert('Error: Betting state not found');
        return;
    }

    // Get market
    const market = bettingState.markets[marketId];
    if (!market) {
        console.error(`Market ${marketId} not found`);
        alert(`Error: Market ${marketId} not found`);
        return;
    }

    // Check if market is already resolved
    if (market.status === 'resolved') {
        alert('This market is already resolved');
        return;
    }

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

    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));

    // Show success message
    alert(`Market resolved successfully with winning outcome: ${winningOutcome}`);

    // Reload page to update UI
    location.reload();
}
