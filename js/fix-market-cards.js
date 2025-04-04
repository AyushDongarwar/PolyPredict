// Script to fix all market cards on the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fixing market cards...');
    
    // Fix existing market cards
    fixExistingMarketCards();
    
    // Add icons to market meta
    addIconsToMarketMeta();
    
    // Fix bet buttons
    fixBetButtons();
    
    // Add bet counts
    addBetCounts();
    
    // Fix market card layout
    fixMarketCardLayout();
    
    console.log('Market cards fixed successfully');
});

// Fix existing market cards
function fixExistingMarketCards() {
    // Add data-market-id attribute to all market cards
    const marketCards = document.querySelectorAll('.market-card');
    marketCards.forEach((card, index) => {
        // Skip cards that already have data-market-id
        if (!card.dataset.marketId) {
            // Try to find market ID from bet buttons
            const betButton = card.querySelector('.bet-btn-sm, .bet-btn');
            if (betButton && betButton.dataset.market) {
                card.dataset.marketId = betButton.dataset.market;
            } else {
                // Fallback to index
                card.dataset.marketId = `default-${index + 1}`;
            }
        }
        
        // Add animation delay
        card.style.animationDelay = `${0.1 * index}s`;
    });
}

// Add icons to market meta
function addIconsToMarketMeta() {
    const marketMetaSpans = document.querySelectorAll('.market-meta span:first-child');
    marketMetaSpans.forEach(span => {
        // Skip if already has icon
        if (span.querySelector('i')) return;
        
        const text = span.textContent.trim();
        let icon = 'fa-tag';
        
        // Choose icon based on category
        if (text.includes('Politics')) {
            icon = 'fa-landmark';
        } else if (text.includes('Crypto')) {
            icon = 'fa-coins';
        } else if (text.includes('Sports')) {
            icon = 'fa-futbol';
        } else if (text.includes('Entertainment')) {
            icon = 'fa-film';
        }
        
        // Add icon
        span.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
    });
    
    // Add calendar icon to end date
    const endDateSpans = document.querySelectorAll('.market-meta span:last-child');
    endDateSpans.forEach(span => {
        // Skip if already has icon
        if (span.querySelector('i')) return;
        
        const text = span.textContent.trim();
        if (text.includes('Ends:')) {
            span.innerHTML = `<i class="far fa-calendar-alt"></i> ${text}`;
        }
    });
}

// Fix bet buttons
function fixBetButtons() {
    const betButtons = document.querySelectorAll('.bet-btn-sm');
    betButtons.forEach(button => {
        // Skip if already fixed
        if (button.querySelector('i')) return;
        
        // Remove btn and btn-sm classes
        button.classList.remove('btn', 'btn-sm');
        
        // Add icon
        const marketId = button.dataset.market;
        const outcome = button.dataset.outcome;
        
        let icon = 'fa-coins';
        
        // Choose icon based on market and outcome
        if (marketId === '1') { // US Election
            icon = 'fa-vote-yea';
        } else if (marketId === '2') { // Bitcoin
            icon = 'fa-bitcoin';
        } else if (marketId === '3') { // Super Bowl
            icon = 'fa-football-ball';
        } else if (marketId.startsWith('crypto')) {
            icon = 'fa-coins';
        }
        
        // Update button text
        button.innerHTML = `<i class="fas ${icon}"></i> Bet`;
        
        // Fix button layout
        const outcomeElement = button.closest('.outcome');
        if (outcomeElement) {
            const oddsElement = outcomeElement.querySelector('.outcome-odds');
            if (oddsElement && oddsElement.nextElementSibling === button) {
                // Create wrapper div
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.gap = '10px';
                
                // Move odds and button to wrapper
                outcomeElement.insertBefore(wrapper, oddsElement);
                wrapper.appendChild(oddsElement);
                wrapper.appendChild(button);
            }
        }
    });
}

// Add bet counts
function addBetCounts() {
    // Get betting state
    let bettingState;
    try {
        const savedState = localStorage.getItem('polypredict_betting_state');
        if (savedState) {
            bettingState = JSON.parse(savedState);
        }
    } catch (e) {
        console.error('Error parsing betting state:', e);
        return;
    }
    
    if (!bettingState || !bettingState.markets) return;
    
    // Add bet counts to outcomes
    const outcomeElements = document.querySelectorAll('.outcome');
    outcomeElements.forEach(outcomeElement => {
        // Skip if already has bet count
        if (outcomeElement.querySelector('.bettors-count')) return;
        
        // Get market and outcome
        const betButton = outcomeElement.querySelector('[data-market][data-outcome]');
        if (!betButton) return;
        
        const marketId = betButton.dataset.market;
        const outcomeName = betButton.dataset.outcome;
        
        // Get market from betting state
        const market = bettingState.markets[marketId];
        if (!market || !market.outcomes || !market.outcomes[outcomeName]) return;
        
        // Get bettors count
        const outcome = market.outcomes[outcomeName];
        const bettorsCount = outcome.bettors ? outcome.bettors.length : 0;
        
        if (bettorsCount > 0) {
            // Add bettors count badge
            const outcomeNameElement = outcomeElement.querySelector('.outcome-name');
            if (outcomeNameElement) {
                // Create badge
                const badge = document.createElement('span');
                badge.className = 'bettors-count';
                badge.textContent = `${bettorsCount} ${bettorsCount === 1 ? 'bet' : 'bets'}`;
                
                // Add badge to outcome name
                outcomeNameElement.appendChild(badge);
            }
        }
    });
}

// Fix market card layout
function fixMarketCardLayout() {
    // Add CSS to ensure consistent layout
    const style = document.createElement('style');
    style.textContent = `
        .market-card {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        
        .market-body {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
        
        .outcomes {
            margin-top: auto;
        }
        
        .outcome-name {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px;
        }
    `;
    document.head.appendChild(style);
}
