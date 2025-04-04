// Script to fix the exact layout of market cards
document.addEventListener('DOMContentLoaded', function() {
    console.log('Applying exact layout fixes...');
    
    // Fix market cards layout
    fixMarketCardsLayout();
    
    // Fix outcome layout
    fixOutcomeLayout();
    
    // Fix market grid
    fixMarketGrid();
    
    // Remove duplicate markets
    removeDuplicateMarkets();
    
    console.log('Exact layout fixes applied');
});

// Fix market cards layout
function fixMarketCardsLayout() {
    // Get all market cards
    const marketCards = document.querySelectorAll('.market-card');
    
    marketCards.forEach(card => {
        // Reset all styles
        card.style.cssText = `
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            background-color: white !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
            margin-bottom: 20px !important;
            border: 1px solid #e0e0e0 !important;
            overflow: hidden !important;
            position: relative !important;
            animation: none !important;
            transform: none !important;
            transition: none !important;
        `;
        
        // Fix market header
        const header = card.querySelector('.market-header');
        if (header) {
            header.style.cssText = `
                padding: 15px !important;
                border-bottom: 1px solid #f0f0f0 !important;
                background: white !important;
            `;
        }
        
        // Fix market title
        const title = card.querySelector('.market-title');
        if (title) {
            title.style.cssText = `
                font-weight: 600 !important;
                margin-bottom: 8px !important;
                color: #333 !important;
                font-size: 1.1rem !important;
                line-height: 1.4 !important;
            `;
        }
        
        // Fix market meta
        const meta = card.querySelector('.market-meta');
        if (meta) {
            meta.style.cssText = `
                display: flex !important;
                justify-content: space-between !important;
                font-size: 0.85rem !important;
                color: #666 !important;
            `;
            
            // Fix category span
            const categorySpan = meta.querySelector('span:first-child');
            if (categorySpan) {
                categorySpan.style.cssText = `
                    background-color: rgba(108, 92, 231, 0.1) !important;
                    color: #6c5ce7 !important;
                    padding: 3px 8px !important;
                    border-radius: 12px !important;
                    font-weight: 500 !important;
                    font-size: 0.75rem !important;
                `;
                
                // Remove icons
                const icon = categorySpan.querySelector('i');
                if (icon) {
                    categorySpan.innerHTML = categorySpan.textContent;
                }
            }
            
            // Fix date span
            const dateSpan = meta.querySelector('span:last-child');
            if (dateSpan) {
                // Remove icons
                const icon = dateSpan.querySelector('i');
                if (icon) {
                    dateSpan.innerHTML = dateSpan.textContent;
                }
            }
        }
        
        // Fix market body
        const body = card.querySelector('.market-body');
        if (body) {
            body.style.cssText = `
                padding: 15px !important;
            `;
        }
        
        // Fix market description
        const description = card.querySelector('.market-description');
        if (description) {
            description.style.cssText = `
                margin-bottom: 15px !important;
                font-size: 0.9rem !important;
                color: #555 !important;
                line-height: 1.5 !important;
            `;
        }
        
        // Fix market footer
        const footer = card.querySelector('.market-footer');
        if (footer) {
            footer.style.cssText = `
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                padding: 10px 15px !important;
                border-top: 1px solid #f0f0f0 !important;
                background-color: #fafafa !important;
            `;
        }
    });
}

// Fix outcome layout
function fixOutcomeLayout() {
    // Fix outcomes container
    const outcomesContainers = document.querySelectorAll('.outcomes');
    outcomesContainers.forEach(container => {
        container.style.cssText = `
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
        `;
    });
    
    // Fix individual outcomes
    const outcomes = document.querySelectorAll('.outcome');
    outcomes.forEach((outcome, index) => {
        outcome.style.cssText = `
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 10px 0 !important;
            border: none !important;
            border-bottom: 1px solid #eee !important;
            border-radius: 0 !important;
            margin-bottom: 0 !important;
            background-color: transparent !important;
        `;
        
        // Remove border from last outcome in each container
        const nextOutcome = outcomes[index + 1];
        if (!nextOutcome || nextOutcome.parentElement !== outcome.parentElement) {
            outcome.style.borderBottom = 'none !important';
        }
        
        // Fix outcome name
        const name = outcome.querySelector('.outcome-name');
        if (name) {
            name.style.cssText = `
                font-weight: 500 !important;
                color: #444 !important;
                flex: 1 !important;
            `;
            
            // Remove bettors count
            const bettorsCount = name.querySelector('.bettors-count');
            if (bettorsCount) {
                bettorsCount.style.display = 'none';
            }
        }
        
        // Fix outcome odds
        const odds = outcome.querySelector('.outcome-odds');
        if (odds) {
            odds.style.cssText = `
                font-weight: 600 !important;
                color: #6c5ce7 !important;
                background-color: rgba(108, 92, 231, 0.1) !important;
                padding: 4px 10px !important;
                border-radius: 12px !important;
                font-size: 0.9rem !important;
                margin: 0 10px !important;
            `;
        }
        
        // Fix bet button
        const betButton = outcome.querySelector('.bet-btn-sm, .place-bet');
        if (betButton) {
            betButton.style.cssText = `
                background-color: #6c5ce7 !important;
                color: white !important;
                border: none !important;
                border-radius: 6px !important;
                padding: 8px 16px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                font-size: 0.9rem !important;
                box-shadow: none !important;
                transform: none !important;
                transition: background-color 0.2s ease !important;
            `;
            
            // Remove icons
            const icon = betButton.querySelector('i');
            if (icon) {
                betButton.innerHTML = 'Bet';
            }
        }
        
        // Fix layout of odds and button
        if (odds && betButton) {
            // Check if they're already in a wrapper
            if (odds.nextElementSibling === betButton || betButton.nextElementSibling === odds) {
                // Create wrapper div if not already in one
                const parent = odds.parentElement;
                if (parent === outcome) {
                    const wrapper = document.createElement('div');
                    wrapper.style.cssText = `
                        display: flex !important;
                        align-items: center !important;
                    `;
                    
                    // Move odds and button to wrapper
                    parent.insertBefore(wrapper, odds);
                    wrapper.appendChild(odds);
                    wrapper.appendChild(betButton);
                }
            }
        }
    });
}

// Fix market grid
function fixMarketGrid() {
    const marketsGrid = document.querySelector('.markets-grid');
    if (marketsGrid) {
        marketsGrid.style.cssText = `
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
            margin-bottom: 40px !important;
        `;
    }
}

// Remove duplicate markets
function removeDuplicateMarkets() {
    // Get all market cards
    const marketCards = document.querySelectorAll('.market-card');
    const marketTitles = {};
    
    // Find duplicate markets
    marketCards.forEach((card, index) => {
        const titleElement = card.querySelector('.market-title');
        if (!titleElement) return;
        
        const title = titleElement.textContent.trim();
        
        // If title already exists, mark as duplicate
        if (marketTitles[title]) {
            // Hide duplicate
            card.style.display = 'none';
        } else {
            // Add to titles
            marketTitles[title] = true;
        }
    });
}
