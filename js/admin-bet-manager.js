// Admin Bet Manager for PolyPredict
// This file contains functions for managing bets in the admin panel

// Initialize bet manager
function initBetManager() {
    console.log('Initializing admin bet manager...');

    // Make sure bettingState is initialized
    if (typeof bettingState === 'undefined') {
        console.log('Creating bettingState...');
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

    // Add bet management tab to admin panel
    addBetManagementTab();

    // Load existing bets
    loadAllBets();

    // Add direct bet buttons to the UI
    addDirectBetButtons();
}

// Add bet management tab to admin panel
function addBetManagementTab() {
    // Get tabs container
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) return;

    // Create new tab
    const betManagementTab = document.createElement('div');
    betManagementTab.className = 'tab';
    betManagementTab.setAttribute('data-tab', 'bet-management');
    betManagementTab.textContent = 'Bet Management';

    // Add tab to container
    tabsContainer.appendChild(betManagementTab);

    // Create tab content
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.id = 'bet-management';
    tabContent.style.display = 'none';

    // Add content to tab
    tabContent.innerHTML = `
        <h2>Bet Management</h2>
        <div class="card">
            <div class="card-header">
                <h3>Add New Bet</h3>
            </div>
            <div class="card-body">
                <form id="add-bet-form">
                    <div class="form-group">
                        <label for="bet-market">Market</label>
                        <select id="bet-market" class="form-control" required>
                            <option value="">Select a market</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="bet-outcome">Outcome</label>
                        <select id="bet-outcome" class="form-control" required>
                            <option value="">Select an outcome</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="bet-user">User</label>
                        <select id="bet-user" class="form-control" required>
                            <option value="">Select a user</option>
                            <option value="new-bot">Create Bot User</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="bet-amount">Amount (tokens)</label>
                        <input type="number" id="bet-amount" class="form-control" value="1" min="1" step="1" required>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary">Add Bet</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card" style="margin-top: 20px;">
            <div class="card-header">
                <h3>Existing Bets</h3>
                <div style="margin-top: 10px;">
                    <input type="text" id="bet-search" class="form-control" placeholder="Search bets..." style="width: 100%;">
                </div>
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                    <select id="bet-filter-market" class="form-control" style="flex: 1;">
                        <option value="">All Markets</option>
                    </select>
                    <select id="bet-filter-status" class="form-control" style="flex: 1;">
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Market</th>
                                <th>Outcome</th>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="bets-table-body">
                            <!-- Bets will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Add tab content to container
    document.querySelector('.tab-contents').appendChild(tabContent);

    // Add event listener to tab
    betManagementTab.addEventListener('click', function () {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });

        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab content
        document.getElementById('bet-management').style.display = 'block';

        // Add active class to selected tab
        this.classList.add('active');

        // Refresh bets
        loadAllBets();
    });

    // Add event listeners
    setupBetManagementListeners();
}

// Set up event listeners for bet management
function setupBetManagementListeners() {
    // Wait for DOM to be fully loaded
    setTimeout(() => {
        // Add bet form submission
        const addBetForm = document.getElementById('add-bet-form');
        if (addBetForm) {
            addBetForm.addEventListener('submit', handleAddBet);
        }

        // Market selection change
        const marketSelect = document.getElementById('bet-market');
        if (marketSelect) {
            marketSelect.addEventListener('change', handleMarketChange);

            // Load markets
            loadMarkets();
        }

        // Search input
        const searchInput = document.getElementById('bet-search');
        if (searchInput) {
            searchInput.addEventListener('input', filterBets);
        }

        // Market filter
        const marketFilter = document.getElementById('bet-filter-market');
        if (marketFilter) {
            marketFilter.addEventListener('change', filterBets);
        }

        // Status filter
        const statusFilter = document.getElementById('bet-filter-status');
        if (statusFilter) {
            statusFilter.addEventListener('change', filterBets);
        }

        // Load users
        loadUsers();
    }, 500);
}

// Load markets for bet management
function loadMarkets() {
    // Get market select
    const marketSelect = document.getElementById('bet-market');
    const marketFilter = document.getElementById('bet-filter-market');
    if (!marketSelect || !marketFilter) return;

    // Clear existing options (except first)
    while (marketSelect.options.length > 1) {
        marketSelect.remove(1);
    }

    while (marketFilter.options.length > 1) {
        marketFilter.remove(1);
    }

    // Get markets from DOM
    const marketItems = document.querySelectorAll('.market-item');

    marketItems.forEach((item, index) => {
        const marketId = (index + 1).toString();
        const marketTitle = item.querySelector('.market-title').textContent;

        // Add to market select
        const option = document.createElement('option');
        option.value = marketId;
        option.textContent = marketTitle;
        marketSelect.appendChild(option);

        // Add to market filter
        const filterOption = document.createElement('option');
        filterOption.value = marketId;
        filterOption.textContent = marketTitle;
        marketFilter.appendChild(filterOption);
    });
}

// Handle market change
function handleMarketChange() {
    const marketId = document.getElementById('bet-market').value;
    const outcomeSelect = document.getElementById('bet-outcome');

    // Clear existing options
    outcomeSelect.innerHTML = '<option value="">Select an outcome</option>';

    if (!marketId) return;

    // Get outcomes based on market
    let outcomes = [];

    switch (marketId) {
        case '1': // US Presidential Election
            outcomes = ['Republican', 'Democrat', 'Other'];
            break;
        case '2': // Bitcoin Price
            outcomes = ['Under $50,000', '$50,000 - $100,000', 'Over $100,000'];
            break;
        case '3': // Super Bowl
            outcomes = ['Kansas City Chiefs', 'San Francisco 49ers', 'Dallas Cowboys', 'Other'];
            break;
    }

    // Add outcomes to select
    outcomes.forEach(outcome => {
        const option = document.createElement('option');
        option.value = outcome;
        option.textContent = outcome;
        outcomeSelect.appendChild(option);
    });
}

// Load users for bet management
function loadUsers() {
    // Get user select
    const userSelect = document.getElementById('bet-user');
    if (!userSelect) return;

    // Clear existing options (except first two)
    while (userSelect.options.length > 2) {
        userSelect.remove(2);
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('polypredict_users') || '[]');

    // Add users to select
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.email;
        userSelect.appendChild(option);
    });
}

// Handle add bet form submission
function handleAddBet(event) {
    event.preventDefault();

    // Get form values
    const marketId = document.getElementById('bet-market').value;
    const outcome = document.getElementById('bet-outcome').value;
    const userId = document.getElementById('bet-user').value;
    const amount = parseInt(document.getElementById('bet-amount').value);

    // Validate form
    if (!marketId || !outcome || !userId || isNaN(amount) || amount < 1) {
        alert('Please fill in all fields correctly');
        return;
    }

    // Check if betting state is initialized
    if (typeof bettingState === 'undefined') {
        alert('Betting system not initialized');
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

    // Handle bot user creation
    let user;
    let isBot = false;

    if (userId === 'new-bot') {
        // Create bot user
        user = {
            id: 'bot-' + Date.now().toString(),
            email: 'bot' + Math.floor(Math.random() * 10000) + '@example.com',
            isBot: true
        };
        isBot = true;
    } else {
        // Get user from localStorage
        const users = JSON.parse(localStorage.getItem('polypredict_users') || '[]');
        user = users.find(u => u.id === userId);

        if (!user) {
            alert('User not found');
            return;
        }

        // Check if user has enough tokens
        if (user.tokenBalance < amount) {
            alert(`User does not have enough tokens. Current balance: ${user.tokenBalance}`);
            return;
        }

        // Deduct tokens from user
        user.tokenBalance -= amount;

        // Add transaction record
        if (!user.transactions) {
            user.transactions = [];
        }

        user.transactions.unshift({
            id: Date.now().toString(),
            type: 'Bet Placement',
            amount: -amount,
            date: new Date().toISOString(),
            status: 'Completed',
            details: `Bet on ${outcome} in market "${getMarketTitle(marketId)}"`
        });

        // Update user in localStorage
        const updatedUsers = users.map(u => u.id === user.id ? user : u);
        localStorage.setItem('polypredict_users', JSON.stringify(updatedUsers));
    }

    // Create bet
    const bet = {
        id: Date.now().toString(),
        userId: user.id,
        userEmail: user.email,
        marketId,
        outcome,
        amount,
        timestamp: new Date().toISOString(),
        status: 'active',
        isBot
    };

    // Add bet to market
    bettingState.markets[marketId].bets.push(bet);
    bettingState.markets[marketId].outcomes[outcome].bettors.push(user.id);
    bettingState.markets[marketId].outcomes[outcome].totalBets += amount;

    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));

    // Show success message
    alert(`Bet added successfully for ${user.email} on ${outcome} in market ${getMarketTitle(marketId)}`);

    // Reset form
    document.getElementById('add-bet-form').reset();

    // Reload bets
    loadAllBets();
}

// Get market title by ID
function getMarketTitle(marketId) {
    const marketItems = document.querySelectorAll('.market-item');
    if (marketItems.length >= marketId) {
        return marketItems[marketId - 1].querySelector('.market-title').textContent;
    }
    return `Market ${marketId}`;
}

// Load all bets
function loadAllBets() {
    // Get bets table body
    const betsTableBody = document.getElementById('bets-table-body');
    if (!betsTableBody) return;

    // Clear existing rows
    betsTableBody.innerHTML = '';

    // Check if betting state is initialized
    if (typeof bettingState === 'undefined' || !bettingState.markets) {
        betsTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No bets found</td></tr>';
        return;
    }

    // Collect all bets from all markets
    const allBets = [];

    Object.keys(bettingState.markets).forEach(marketId => {
        const market = bettingState.markets[marketId];
        if (market.bets && Array.isArray(market.bets)) {
            market.bets.forEach(bet => {
                allBets.push({
                    ...bet,
                    marketTitle: getMarketTitle(marketId)
                });
            });
        }
    });

    // Sort bets by timestamp (newest first)
    allBets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Check if there are any bets
    if (allBets.length === 0) {
        betsTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No bets found</td></tr>';
        return;
    }

    // Add bets to table
    allBets.forEach(bet => {
        const row = document.createElement('tr');

        // Format date
        const date = new Date(bet.timestamp);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        // Create row
        row.innerHTML = `
            <td>${bet.id.substring(0, 8)}...</td>
            <td>${bet.marketTitle}</td>
            <td>${bet.outcome}</td>
            <td>${bet.isBot ? '<span style="color: #e74c3c;">Bot</span> ' : ''}${bet.userEmail}</td>
            <td>${bet.amount}</td>
            <td>
                <span class="status-badge status-${bet.status}">
                    ${bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                </span>
            </td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-danger btn-sm delete-bet" data-id="${bet.id}" data-market="${bet.marketId}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        // Add row to table
        betsTableBody.appendChild(row);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-bet').forEach(button => {
        button.addEventListener('click', handleDeleteBet);
    });

    // Add CSS for status badges if not already added
    if (!document.getElementById('bet-status-styles')) {
        const style = document.createElement('style');
        style.id = 'bet-status-styles';
        style.textContent = `
            .status-badge {
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 500;
            }
            .status-pending {
                background-color: #ffeaa7;
                color: #d35400;
            }
            .status-active {
                background-color: #81ecec;
                color: #00b894;
            }
            .status-won {
                background-color: #55efc4;
                color: #00b894;
            }
            .status-lost {
                background-color: #fab1a0;
                color: #d63031;
            }
        `;
        document.head.appendChild(style);
    }
}

// Handle delete bet
function handleDeleteBet(event) {
    const betId = event.currentTarget.getAttribute('data-id');
    const marketId = event.currentTarget.getAttribute('data-market');

    if (!betId || !marketId) return;

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this bet?')) return;

    // Check if betting state is initialized
    if (typeof bettingState === 'undefined' || !bettingState.markets || !bettingState.markets[marketId]) {
        alert('Bet not found');
        return;
    }

    // Find bet
    const market = bettingState.markets[marketId];
    const betIndex = market.bets.findIndex(b => b.id === betId);

    if (betIndex === -1) {
        alert('Bet not found');
        return;
    }

    const bet = market.bets[betIndex];

    // If bet is not from a bot and not already resolved, refund tokens to user
    if (!bet.isBot && bet.status !== 'won' && bet.status !== 'lost') {
        // Get user
        const users = JSON.parse(localStorage.getItem('polypredict_users') || '[]');
        const userIndex = users.findIndex(u => u.id === bet.userId);

        if (userIndex !== -1) {
            // Refund tokens
            users[userIndex].tokenBalance += bet.amount;

            // Add transaction record
            if (!users[userIndex].transactions) {
                users[userIndex].transactions = [];
            }

            users[userIndex].transactions.unshift({
                id: Date.now().toString(),
                type: 'Bet Refund',
                amount: bet.amount,
                date: new Date().toISOString(),
                status: 'Completed',
                details: `Refund for bet on ${bet.outcome} in market "${getMarketTitle(marketId)}"`
            });

            // Update user in localStorage
            localStorage.setItem('polypredict_users', JSON.stringify(users));
        }
    }

    // Remove bet from outcome
    const outcome = bet.outcome;
    if (market.outcomes[outcome]) {
        // Remove user from bettors
        const bettorIndex = market.outcomes[outcome].bettors.indexOf(bet.userId);
        if (bettorIndex !== -1) {
            market.outcomes[outcome].bettors.splice(bettorIndex, 1);
        }

        // Reduce total bets
        market.outcomes[outcome].totalBets -= bet.amount;
    }

    // Remove bet from market
    market.bets.splice(betIndex, 1);

    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));

    // Show success message
    alert('Bet deleted successfully');

    // Reload bets
    loadAllBets();
}

// Add direct bet buttons to the UI
function addDirectBetButtons() {
    console.log('Adding direct bet buttons...');

    // Wait for DOM to be fully loaded
    setTimeout(() => {
        // Find all market cards
        const marketItems = document.querySelectorAll('.market-item, .market-card');
        if (!marketItems.length) {
            console.log('No market items found');
            return;
        }

        console.log(`Found ${marketItems.length} market items`);

        // Add admin bet buttons to each market
        marketItems.forEach((item, index) => {
            // Get market ID from data attribute or fallback to index
            let marketId;
            if (item.dataset.marketId) {
                marketId = item.dataset.marketId;
            } else {
                marketId = (index + 1).toString();
            }

            const marketTitle = item.querySelector('.market-title').textContent;

            // Create admin bet panel
            const adminBetPanel = document.createElement('div');
            adminBetPanel.className = 'admin-bet-panel';
            adminBetPanel.style.marginTop = '15px';
            adminBetPanel.style.padding = '10px';
            adminBetPanel.style.backgroundColor = '#f8d7da';
            adminBetPanel.style.borderRadius = '5px';
            adminBetPanel.style.border = '1px solid #f5c6cb';

            // Add title
            const title = document.createElement('h4');
            title.textContent = 'Admin Quick Bet';
            title.style.margin = '0 0 10px 0';
            title.style.fontSize = '14px';
            title.style.color = '#721c24';
            adminBetPanel.appendChild(title);

            // Get outcomes
            let outcomes = [];

            // Try to get outcomes from the DOM first
            const outcomeElements = item.querySelectorAll('.outcome-name');
            if (outcomeElements.length > 0) {
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
            } else {
                // Fallback to predefined outcomes if DOM elements not found
                switch (marketId) {
                    case '1': // US Presidential Election
                        outcomes = ['Republican', 'Democrat', 'Other'];
                        break;
                    case '2': // Bitcoin Price
                        outcomes = ['Under $50,000', '$50,000 - $100,000', 'Over $100,000'];
                        break;
                    case '3': // Super Bowl
                        outcomes = ['Kansas City Chiefs', 'San Francisco 49ers', 'Dallas Cowboys', 'Other'];
                        break;
                    default:
                        // For crypto markets, extract from ID and add generic outcomes
                        if (marketId.startsWith('crypto-')) {
                            const cryptoId = marketId.split('-')[1];
                            switch (cryptoId) {
                                case '4': // Cardano
                                    outcomes = ['Under $5', '$5 - $10', 'Over $10'];
                                    break;
                                case '5': // Ripple
                                    outcomes = ['Under $1', '$1 - $3', 'Over $3'];
                                    break;
                                case '6': // Dogecoin
                                    outcomes = ['Decrease', 'Increase 0-20%', 'Increase >20%'];
                                    break;
                                case '7': // Polygon
                                    outcomes = ['Under $2', '$2 - $5', 'Over $5'];
                                    break;
                                case '8': // Chainlink
                                    outcomes = ['Under $20', '$20 - $50', 'Over $50'];
                                    break;
                                case '9': // Bitcoin Dominance
                                    outcomes = ['Under 40%', '40% - 50%', 'Over 50%'];
                                    break;
                                case '10': // Ethereum 2.0
                                    outcomes = ['Before July 2024', 'July 2024 - Dec 2024', '2025 or later'];
                                    break;
                                case '11': // NFT Market
                                    outcomes = ['Decrease >20%', '-20% to +20%', 'Increase >20%'];
                                    break;
                                case '12': // CBDC
                                    outcomes = ['China', 'European Union', 'United States', 'Other'];
                                    break;
                                case '13': // DeFi TVL
                                    outcomes = ['Under $50 billion', '$50B - $100B', 'Over $100 billion'];
                                    break;
                                case '14': // Layer 2
                                    outcomes = ['Under 40%', '40% - 70%', 'Over 70%'];
                                    break;
                                case '15': // Regulation
                                    outcomes = ['Before 2025', 'During 2025', 'After 2025'];
                                    break;
                                default:
                                    outcomes = ['Option A', 'Option B', 'Option C'];
                            }
                        } else {
                            outcomes = ['Option A', 'Option B', 'Option C'];
                        }
                }
            }

            // Create buttons for each outcome
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexWrap = 'wrap';
            buttonContainer.style.gap = '5px';

            outcomes.forEach(outcome => {
                const button = document.createElement('button');
                button.className = 'btn btn-sm';
                button.style.backgroundColor = '#dc3545';
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.padding = '5px 10px';
                button.style.borderRadius = '3px';
                button.style.fontSize = '12px';
                button.style.cursor = 'pointer';
                button.textContent = `Bet on ${outcome}`;

                // Add click event
                button.addEventListener('click', function () {
                    placeAdminBet(marketId, outcome);
                });

                buttonContainer.appendChild(button);
            });

            adminBetPanel.appendChild(buttonContainer);

            // Add delete all bets button
            const deleteAllButton = document.createElement('button');
            deleteAllButton.className = 'btn btn-sm';
            deleteAllButton.style.backgroundColor = '#6c757d';
            deleteAllButton.style.color = 'white';
            deleteAllButton.style.border = 'none';
            deleteAllButton.style.padding = '5px 10px';
            deleteAllButton.style.borderRadius = '3px';
            deleteAllButton.style.fontSize = '12px';
            deleteAllButton.style.cursor = 'pointer';
            deleteAllButton.style.marginTop = '10px';
            deleteAllButton.style.width = '100%';
            deleteAllButton.textContent = 'Delete All Bets for this Market';

            // Add click event
            deleteAllButton.addEventListener('click', function () {
                deleteAllBetsForMarket(marketId);
            });

            adminBetPanel.appendChild(deleteAllButton);

            // Add panel to market item
            item.appendChild(adminBetPanel);
        });
    }, 1000);
}

// Place admin bet
function placeAdminBet(marketId, outcome) {
    console.log(`Admin placing bet on ${outcome} in market ${marketId}`);

    // Make sure bettingState is initialized
    if (typeof bettingState === 'undefined') {
        console.error('bettingState is not initialized');
        alert('Error: Betting system not initialized');
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

    // Create bot user for admin bet
    const botUser = {
        id: 'admin-bot-' + Date.now().toString(),
        email: 'admin-bot-' + Math.floor(Math.random() * 10000) + '@polypredict.com',
        isBot: true,
        isAdminBot: true
    };

    // Create bet
    const bet = {
        id: Date.now().toString(),
        userId: botUser.id,
        userEmail: botUser.email,
        marketId,
        outcome,
        amount: 1, // Fixed bet amount
        timestamp: new Date().toISOString(),
        status: 'active',
        isBot: true,
        isAdminBet: true
    };

    // Add bet to market
    bettingState.markets[marketId].bets.push(bet);
    bettingState.markets[marketId].outcomes[outcome].bettors.push(botUser.id);
    bettingState.markets[marketId].outcomes[outcome].totalBets += 1;

    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));

    // Update UI for this market
    if (typeof updateBettingUI === 'function') {
        updateBettingUI(marketId);
    }

    // Show success message
    alert(`Admin bet placed on ${outcome} in market ${getMarketTitle(marketId)}`);

    // Reload page to update UI
    location.reload();
}

// Delete all bets for a market
function deleteAllBetsForMarket(marketId) {
    console.log(`Deleting all bets for market ${marketId}`);

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete ALL bets for market ${getMarketTitle(marketId)}?`)) {
        return;
    }

    // Make sure bettingState is initialized
    if (typeof bettingState === 'undefined' || !bettingState.markets || !bettingState.markets[marketId]) {
        alert('No bets found for this market');
        return;
    }

    // Get all bets for this market
    const market = bettingState.markets[marketId];
    const bets = market.bets || [];

    // Process refunds for real users
    const users = JSON.parse(localStorage.getItem('polypredict_users') || '[]');
    const updatedUsers = [...users];

    bets.forEach(bet => {
        // Skip bot bets
        if (bet.isBot) return;

        // Find user
        const userIndex = updatedUsers.findIndex(u => u.id === bet.userId);
        if (userIndex === -1) return;

        // Refund tokens
        updatedUsers[userIndex].tokenBalance += bet.amount;

        // Add transaction record
        if (!updatedUsers[userIndex].transactions) {
            updatedUsers[userIndex].transactions = [];
        }

        updatedUsers[userIndex].transactions.unshift({
            id: Date.now().toString(),
            type: 'Bet Refund',
            amount: bet.amount,
            date: new Date().toISOString(),
            status: 'Completed',
            details: `Refund for bet on ${bet.outcome} in market "${getMarketTitle(marketId)}"`
        });
    });

    // Update users in localStorage
    localStorage.setItem('polypredict_users', JSON.stringify(updatedUsers));

    // Clear all bets and outcomes for this market
    bettingState.markets[marketId] = {
        outcomes: {},
        bets: []
    };

    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));

    // Show success message
    alert(`All bets for market ${getMarketTitle(marketId)} have been deleted`);

    // Reload page to update UI
    location.reload();
}

// Filter bets
function filterBets() {
    const searchTerm = document.getElementById('bet-search').value.toLowerCase();
    const marketFilter = document.getElementById('bet-filter-market').value;
    const statusFilter = document.getElementById('bet-filter-status').value;

    // Get all rows
    const rows = document.querySelectorAll('#bets-table-body tr');

    rows.forEach(row => {
        // Skip "no bets found" row
        if (row.cells.length === 1) return;

        // Get row data
        const marketText = row.cells[1].textContent.toLowerCase();
        const outcomeText = row.cells[2].textContent.toLowerCase();
        const userText = row.cells[3].textContent.toLowerCase();
        const statusText = row.cells[5].textContent.toLowerCase();

        // Check if row matches filters
        const matchesSearch = searchTerm === '' ||
            marketText.includes(searchTerm) ||
            outcomeText.includes(searchTerm) ||
            userText.includes(searchTerm);

        const matchesMarket = marketFilter === '' ||
            row.cells[1].textContent === getMarketTitle(marketFilter);

        const matchesStatus = statusFilter === '' ||
            statusText.toLowerCase() === statusFilter.toLowerCase();

        // Show or hide row
        row.style.display = matchesSearch && matchesMarket && matchesStatus ? '' : 'none';
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Delay initialization to ensure betting.js is loaded first
    setTimeout(initBetManager, 500);
});
