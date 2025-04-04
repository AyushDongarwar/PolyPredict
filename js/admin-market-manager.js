// Admin Market Manager for PolyPredict
// This file contains functions for managing markets in the admin panel

// Initialize market manager
function initMarketManager() {
    console.log('Initializing admin market manager...');
    
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
    
    // Set up event listeners for market management
    setupMarketManagementListeners();
    
    // Load existing markets
    loadMarkets();
}

// Set up event listeners for market management
function setupMarketManagementListeners() {
    // Add market form submission
    const addMarketForm = document.getElementById('add-market-form');
    if (addMarketForm) {
        addMarketForm.addEventListener('submit', handleAddMarket);
    }
    
    // Add outcome button
    const addOutcomeBtn = document.getElementById('add-outcome-btn');
    if (addOutcomeBtn) {
        addOutcomeBtn.addEventListener('click', addOutcomeField);
    }
    
    // Resolve market form submission
    const resolveMarketForm = document.getElementById('resolve-market-form');
    if (resolveMarketForm) {
        resolveMarketForm.addEventListener('submit', handleResolveMarket);
    }
    
    // Market selection change
    const marketSelect = document.getElementById('market-id');
    if (marketSelect) {
        marketSelect.addEventListener('change', handleMarketChange);
    }
}

// Load markets
function loadMarkets() {
    // Get market list container
    const marketList = document.getElementById('market-list');
    if (!marketList) return;
    
    // Clear existing content
    marketList.innerHTML = '';
    
    // Get markets from localStorage
    const markets = getMarketsFromStorage();
    
    // Add markets to list
    if (markets.length === 0) {
        // Add default markets if none exist
        const defaultMarkets = [
            {
                id: '1',
                title: 'US Presidential Election 2024',
                description: 'Who will win the 2024 US Presidential Election?',
                category: 'Politics',
                outcomes: ['Republican', 'Democrat', 'Other'],
                createdAt: new Date().toISOString(),
                closingDate: new Date(2024, 10, 5).toISOString(), // Nov 5, 2024
                status: 'open'
            },
            {
                id: '2',
                title: 'Bitcoin Price End of 2024',
                description: 'What will be the price of Bitcoin at the end of 2024?',
                category: 'Cryptocurrency',
                outcomes: ['Under $50,000', '$50,000 - $100,000', 'Over $100,000'],
                createdAt: new Date().toISOString(),
                closingDate: new Date(2024, 11, 31).toISOString(), // Dec 31, 2024
                status: 'open'
            },
            {
                id: '3',
                title: 'Super Bowl Winner 2025',
                description: 'Which team will win the Super Bowl in 2025?',
                category: 'Sports',
                outcomes: ['Kansas City Chiefs', 'San Francisco 49ers', 'Dallas Cowboys', 'Other'],
                createdAt: new Date().toISOString(),
                closingDate: new Date(2025, 1, 9).toISOString(), // Feb 9, 2025
                status: 'open'
            }
        ];
        
        // Save default markets
        saveMarketsToStorage(defaultMarkets);
        
        // Add default markets to list
        defaultMarkets.forEach(market => {
            addMarketToList(market);
        });
    } else {
        // Add existing markets to list
        markets.forEach(market => {
            addMarketToList(market);
        });
    }
    
    // Update market select options
    updateMarketSelectOptions();
}

// Add market to list
function addMarketToList(market) {
    const marketList = document.getElementById('market-list');
    if (!marketList) return;
    
    // Create market item
    const marketItem = document.createElement('div');
    marketItem.className = 'market-item';
    marketItem.dataset.id = market.id;
    
    // Create market title
    const marketTitle = document.createElement('span');
    marketTitle.className = 'market-title';
    marketTitle.textContent = market.title;
    marketItem.appendChild(marketTitle);
    
    // Create market status
    const marketStatus = document.createElement('span');
    marketStatus.className = `market-status status-${market.status}`;
    marketStatus.textContent = market.status.charAt(0).toUpperCase() + market.status.slice(1);
    marketItem.appendChild(marketStatus);
    
    // Create action buttons
    const actionButtons = document.createElement('div');
    actionButtons.className = 'market-actions';
    actionButtons.style.marginTop = '10px';
    
    // Edit button
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-sm';
    editButton.textContent = 'Edit';
    editButton.style.marginRight = '5px';
    editButton.style.padding = '3px 10px';
    editButton.style.fontSize = '0.8rem';
    editButton.style.backgroundColor = '#4299e1';
    editButton.style.color = 'white';
    editButton.style.border = 'none';
    editButton.style.borderRadius = '3px';
    editButton.style.cursor = 'pointer';
    
    editButton.addEventListener('click', function() {
        editMarket(market.id);
    });
    
    actionButtons.appendChild(editButton);
    
    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-sm';
    deleteButton.textContent = 'Delete';
    deleteButton.style.padding = '3px 10px';
    deleteButton.style.fontSize = '0.8rem';
    deleteButton.style.backgroundColor = '#e53e3e';
    deleteButton.style.color = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '3px';
    deleteButton.style.cursor = 'pointer';
    
    deleteButton.addEventListener('click', function() {
        deleteMarket(market.id);
    });
    
    actionButtons.appendChild(deleteButton);
    
    marketItem.appendChild(actionButtons);
    
    // Add market details
    const marketDetails = document.createElement('div');
    marketDetails.className = 'market-details';
    marketDetails.style.display = 'none';
    marketDetails.style.marginTop = '10px';
    marketDetails.style.padding = '10px';
    marketDetails.style.backgroundColor = '#f8f9fa';
    marketDetails.style.borderRadius = '5px';
    marketDetails.style.fontSize = '0.9rem';
    
    // Description
    const description = document.createElement('p');
    description.textContent = `Description: ${market.description}`;
    description.style.margin = '0 0 5px 0';
    marketDetails.appendChild(description);
    
    // Category
    const category = document.createElement('p');
    category.textContent = `Category: ${market.category}`;
    category.style.margin = '0 0 5px 0';
    marketDetails.appendChild(category);
    
    // Outcomes
    const outcomes = document.createElement('p');
    outcomes.textContent = `Outcomes: ${market.outcomes.join(', ')}`;
    outcomes.style.margin = '0 0 5px 0';
    marketDetails.appendChild(outcomes);
    
    // Closing date
    const closingDate = document.createElement('p');
    closingDate.textContent = `Closing Date: ${new Date(market.closingDate).toLocaleDateString()}`;
    closingDate.style.margin = '0';
    marketDetails.appendChild(closingDate);
    
    marketItem.appendChild(marketDetails);
    
    // Add toggle for details
    marketTitle.style.cursor = 'pointer';
    marketTitle.addEventListener('click', function() {
        marketDetails.style.display = marketDetails.style.display === 'none' ? 'block' : 'none';
    });
    
    // Add market item to list
    marketList.appendChild(marketItem);
}

// Handle add market form submission
function handleAddMarket(event) {
    event.preventDefault();
    
    // Get form values
    const title = document.getElementById('market-title').value;
    const description = document.getElementById('market-description').value;
    const category = document.getElementById('market-category').value;
    const closingDate = document.getElementById('closing-date').value;
    
    // Get outcomes
    const outcomeInputs = document.querySelectorAll('.outcome-input');
    const outcomes = Array.from(outcomeInputs).map(input => input.value).filter(value => value.trim() !== '');
    
    // Validate form
    if (!title || !description || !category || !closingDate || outcomes.length < 2) {
        alert('Please fill in all fields and add at least two outcomes');
        return;
    }
    
    // Create market object
    const market = {
        id: Date.now().toString(),
        title,
        description,
        category,
        outcomes,
        createdAt: new Date().toISOString(),
        closingDate: new Date(closingDate).toISOString(),
        status: 'open'
    };
    
    // Get existing markets
    const markets = getMarketsFromStorage();
    
    // Add new market
    markets.push(market);
    
    // Save markets
    saveMarketsToStorage(markets);
    
    // Add market to list
    addMarketToList(market);
    
    // Update market select options
    updateMarketSelectOptions();
    
    // Reset form
    document.getElementById('add-market-form').reset();
    
    // Remove extra outcome fields
    const outcomeContainer = document.getElementById('outcomes-container');
    while (outcomeContainer.children.length > 2) { // Keep first two outcome fields
        outcomeContainer.removeChild(outcomeContainer.lastChild);
    }
    
    // Show success message
    alert('Market added successfully');
}

// Add outcome field
function addOutcomeField() {
    const outcomeContainer = document.getElementById('outcomes-container');
    const outcomeCount = outcomeContainer.children.length;
    
    // Create outcome field
    const outcomeField = document.createElement('div');
    outcomeField.className = 'form-group';
    
    // Create label
    const label = document.createElement('label');
    label.textContent = `Outcome ${outcomeCount + 1}`;
    outcomeField.appendChild(label);
    
    // Create input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control outcome-input';
    input.required = true;
    outcomeField.appendChild(input);
    
    // Add outcome field to container
    outcomeContainer.appendChild(outcomeField);
}

// Handle market change
function handleMarketChange() {
    const marketId = document.getElementById('market-id').value;
    const winningOutcomeSelect = document.getElementById('winning-outcome');
    
    // Clear existing options
    winningOutcomeSelect.innerHTML = '<option value="">Select winning outcome</option>';
    
    if (!marketId) return;
    
    // Get market
    const markets = getMarketsFromStorage();
    const market = markets.find(m => m.id === marketId);
    
    if (!market) return;
    
    // Add outcomes to select
    market.outcomes.forEach(outcome => {
        const option = document.createElement('option');
        option.value = outcome;
        option.textContent = outcome;
        winningOutcomeSelect.appendChild(option);
    });
}

// Handle resolve market form submission
function handleResolveMarket(event) {
    event.preventDefault();
    
    // Get form values
    const marketId = document.getElementById('market-id').value;
    const winningOutcome = document.getElementById('winning-outcome').value;
    
    // Validate form
    if (!marketId || !winningOutcome) {
        alert('Please select a market and winning outcome');
        return;
    }
    
    // Resolve market
    if (typeof resolveMarket === 'function') {
        const result = resolveMarket(marketId, winningOutcome);
        
        if (result) {
            // Update market status in storage
            const markets = getMarketsFromStorage();
            const marketIndex = markets.findIndex(m => m.id === marketId);
            
            if (marketIndex !== -1) {
                markets[marketIndex].status = 'resolved';
                markets[marketIndex].resolvedAt = new Date().toISOString();
                markets[marketIndex].winningOutcome = winningOutcome;
                
                // Save markets
                saveMarketsToStorage(markets);
                
                // Reload markets
                loadMarkets();
                
                // Reset form
                document.getElementById('resolve-market-form').reset();
                
                // Show success message
                alert(`Market resolved successfully with winning outcome: ${winningOutcome}`);
            }
        } else {
            alert('Failed to resolve market');
        }
    } else {
        alert('Resolve market function not found');
    }
}

// Edit market
function editMarket(marketId) {
    // Get market
    const markets = getMarketsFromStorage();
    const market = markets.find(m => m.id === marketId);
    
    if (!market) {
        alert('Market not found');
        return;
    }
    
    // Create edit form
    const editForm = document.createElement('div');
    editForm.className = 'edit-market-form';
    editForm.style.position = 'fixed';
    editForm.style.top = '50%';
    editForm.style.left = '50%';
    editForm.style.transform = 'translate(-50%, -50%)';
    editForm.style.backgroundColor = 'white';
    editForm.style.padding = '20px';
    editForm.style.borderRadius = '10px';
    editForm.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    editForm.style.zIndex = '1000';
    editForm.style.width = '90%';
    editForm.style.maxWidth = '500px';
    editForm.style.maxHeight = '90vh';
    editForm.style.overflowY = 'auto';
    
    // Create form content
    editForm.innerHTML = `
        <h3 style="margin-top: 0;">Edit Market</h3>
        <form id="edit-market-form">
            <div class="form-group">
                <label for="edit-market-title">Title</label>
                <input type="text" id="edit-market-title" class="form-control" value="${market.title}" required>
            </div>
            <div class="form-group">
                <label for="edit-market-description">Description</label>
                <textarea id="edit-market-description" class="form-control" required>${market.description}</textarea>
            </div>
            <div class="form-group">
                <label for="edit-market-category">Category</label>
                <select id="edit-market-category" class="form-control" required>
                    <option value="Politics" ${market.category === 'Politics' ? 'selected' : ''}>Politics</option>
                    <option value="Sports" ${market.category === 'Sports' ? 'selected' : ''}>Sports</option>
                    <option value="Cryptocurrency" ${market.category === 'Cryptocurrency' ? 'selected' : ''}>Cryptocurrency</option>
                    <option value="Entertainment" ${market.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                    <option value="Other" ${market.category === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="edit-closing-date">Closing Date</label>
                <input type="date" id="edit-closing-date" class="form-control" value="${market.closingDate.split('T')[0]}" required>
            </div>
            <div id="edit-outcomes-container">
                <label>Outcomes</label>
                ${market.outcomes.map((outcome, index) => `
                    <div class="form-group">
                        <label for="edit-outcome-${index}">Outcome ${index + 1}</label>
                        <input type="text" id="edit-outcome-${index}" class="form-control edit-outcome-input" value="${outcome}" required>
                    </div>
                `).join('')}
            </div>
            <div class="form-group">
                <button type="button" id="edit-add-outcome-btn" class="btn btn-secondary">Add Outcome</button>
            </div>
            <div class="form-group" style="display: flex; justify-content: space-between; margin-top: 20px;">
                <button type="button" id="edit-cancel-btn" class="btn btn-secondary">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
        </form>
    `;
    
    // Add form to body
    document.body.appendChild(editForm);
    
    // Add event listener to add outcome button
    document.getElementById('edit-add-outcome-btn').addEventListener('click', function() {
        const outcomeContainer = document.getElementById('edit-outcomes-container');
        const outcomeCount = outcomeContainer.querySelectorAll('.edit-outcome-input').length;
        
        // Create outcome field
        const outcomeField = document.createElement('div');
        outcomeField.className = 'form-group';
        
        // Create label
        const label = document.createElement('label');
        label.textContent = `Outcome ${outcomeCount + 1}`;
        label.setAttribute('for', `edit-outcome-${outcomeCount}`);
        outcomeField.appendChild(label);
        
        // Create input
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `edit-outcome-${outcomeCount}`;
        input.className = 'form-control edit-outcome-input';
        input.required = true;
        outcomeField.appendChild(input);
        
        // Add outcome field to container
        outcomeContainer.appendChild(outcomeField);
    });
    
    // Add event listener to cancel button
    document.getElementById('edit-cancel-btn').addEventListener('click', function() {
        document.body.removeChild(editForm);
    });
    
    // Add event listener to form submission
    document.getElementById('edit-market-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const title = document.getElementById('edit-market-title').value;
        const description = document.getElementById('edit-market-description').value;
        const category = document.getElementById('edit-market-category').value;
        const closingDate = document.getElementById('edit-closing-date').value;
        
        // Get outcomes
        const outcomeInputs = document.querySelectorAll('.edit-outcome-input');
        const outcomes = Array.from(outcomeInputs).map(input => input.value).filter(value => value.trim() !== '');
        
        // Validate form
        if (!title || !description || !category || !closingDate || outcomes.length < 2) {
            alert('Please fill in all fields and add at least two outcomes');
            return;
        }
        
        // Update market
        const markets = getMarketsFromStorage();
        const marketIndex = markets.findIndex(m => m.id === marketId);
        
        if (marketIndex !== -1) {
            markets[marketIndex].title = title;
            markets[marketIndex].description = description;
            markets[marketIndex].category = category;
            markets[marketIndex].closingDate = new Date(closingDate).toISOString();
            markets[marketIndex].outcomes = outcomes;
            
            // Save markets
            saveMarketsToStorage(markets);
            
            // Reload markets
            loadMarkets();
            
            // Update market select options
            updateMarketSelectOptions();
            
            // Remove form
            document.body.removeChild(editForm);
            
            // Show success message
            alert('Market updated successfully');
        }
    });
}

// Delete market
function deleteMarket(marketId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this market? This will also delete all bets for this market.')) {
        return;
    }
    
    // Get markets
    const markets = getMarketsFromStorage();
    
    // Remove market
    const updatedMarkets = markets.filter(m => m.id !== marketId);
    
    // Save markets
    saveMarketsToStorage(updatedMarkets);
    
    // Remove market from betting state
    if (typeof bettingState !== 'undefined' && bettingState.markets && bettingState.markets[marketId]) {
        delete bettingState.markets[marketId];
        localStorage.setItem('polypredict_betting_state', JSON.stringify(bettingState));
    }
    
    // Reload markets
    loadMarkets();
    
    // Update market select options
    updateMarketSelectOptions();
    
    // Show success message
    alert('Market deleted successfully');
}

// Update market select options
function updateMarketSelectOptions() {
    const marketSelect = document.getElementById('market-id');
    if (!marketSelect) return;
    
    // Clear existing options (except first)
    while (marketSelect.options.length > 1) {
        marketSelect.remove(1);
    }
    
    // Get markets
    const markets = getMarketsFromStorage();
    
    // Add markets to select
    markets.forEach(market => {
        const option = document.createElement('option');
        option.value = market.id;
        option.textContent = market.title;
        marketSelect.appendChild(option);
    });
}

// Get markets from storage
function getMarketsFromStorage() {
    const marketsJson = localStorage.getItem('polypredict_markets');
    return marketsJson ? JSON.parse(marketsJson) : [];
}

// Save markets to storage
function saveMarketsToStorage(markets) {
    localStorage.setItem('polypredict_markets', JSON.stringify(markets));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Delay initialization to ensure betting.js is loaded first
    setTimeout(initMarketManager, 500);
});
