// Enhanced script to load crypto markets on the dashboard
document.addEventListener('DOMContentLoaded', function () {
    console.log('Loading enhanced crypto markets on dashboard...');

    // Initialize betting state if needed
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

    // Get markets container
    const marketsContainer = document.querySelector('.markets-grid');
    if (!marketsContainer) {
        console.error('Markets container not found');
        return;
    }

    // Check if we have crypto markets
    if (!window.bettingState || !window.bettingState.markets) {
        console.log('No markets found in betting state');
        return;
    }

    // Count crypto markets
    let cryptoMarketsCount = 0;

    // Track market titles to avoid duplicates
    const existingMarketTitles = {};

    // Get existing market titles
    document.querySelectorAll('.market-title').forEach(titleElement => {
        existingMarketTitles[titleElement.textContent.trim()] = true;
    });

    // Loop through markets and add crypto ones to the dashboard
    Object.keys(window.bettingState.markets).forEach(marketId => {
        const market = window.bettingState.markets[marketId];

        // Check if it's a crypto market and not a duplicate
        if (market.category === 'Cryptocurrency' && !existingMarketTitles[market.title]) {
            // Add to existing titles to prevent future duplicates
            existingMarketTitles[market.title] = true;
            cryptoMarketsCount++;

            // Create market card
            const marketCard = document.createElement('div');
            marketCard.className = 'market-card running';
            marketCard.dataset.marketId = marketId;

            // Add animation delay for staggered appearance
            marketCard.style.animationDelay = `${0.1 * cryptoMarketsCount}s`;

            // Format closing date
            const closingDate = new Date(market.closingDate);
            const formattedDate = closingDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            // Create market HTML with enhanced styling
            marketCard.innerHTML = `
                <div class="market-header">
                    <h3 class="market-title">${market.title}</h3>
                    <div class="market-meta">
                        <span><i class="fas fa-coins"></i> ${market.category}</span>
                        <span><i class="far fa-calendar-alt"></i> Ends: ${formattedDate}</span>
                    </div>
                </div>
                <div class="market-body">
                    <p class="market-description">${market.description}</p>
                    <div class="outcomes">
                        ${Object.keys(market.outcomes).map(outcomeName => {
                const outcome = market.outcomes[outcomeName];
                const odds = outcome.odds || 1.8;
                const bettorsCount = outcome.bettors ? outcome.bettors.length : 0;
                return `
                                <div class="outcome">
                                    <span class="outcome-name">
                                        ${outcomeName}
                                        ${bettorsCount > 0 ? `<span class="bettors-count">${bettorsCount} ${bettorsCount === 1 ? 'bet' : 'bets'}</span>` : ''}
                                    </span>
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <span class="outcome-odds">${odds}x</span>
                                        <button class="bet-btn-sm" data-market="${marketId}" data-outcome="${outcomeName}" data-odds="${odds}">
                                            <i class="fas fa-coins"></i> Bet
                                        </button>
                                    </div>
                                </div>
                            `;
            }).join('')}
                    </div>
                </div>
            `;

            // Add market card to container
            marketsContainer.appendChild(marketCard);

            // Add event listeners to bet buttons
            const betButtons = marketCard.querySelectorAll('.bet-btn-sm');
            betButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const marketId = this.dataset.market;
                    const outcome = this.dataset.outcome;
                    const odds = parseFloat(this.dataset.odds);

                    // Check if placeBet function exists
                    if (typeof placeBet === 'function') {
                        placeBet(marketId, outcome, odds);
                    } else {
                        console.error('placeBet function not found');
                        alert('Betting functionality not available');
                    }
                });
            });
        }
    });

    console.log(`Added ${cryptoMarketsCount} enhanced crypto markets to dashboard`);
});
