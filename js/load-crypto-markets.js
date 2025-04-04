// Script to load crypto markets on the dashboard
document.addEventListener('DOMContentLoaded', function () {
    console.log('Loading crypto markets on dashboard...');

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

    // Loop through markets and add crypto ones to the dashboard
    Object.keys(window.bettingState.markets).forEach(marketId => {
        const market = window.bettingState.markets[marketId];

        // Check if it's a crypto market
        if (market.category === 'Cryptocurrency') {
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

            // Create market HTML
            marketCard.innerHTML = `
                <div class="market-header">
                    <h3 class="market-title">${market.title}</h3>
                    <div class="market-meta">
                        <span>${market.category}</span>
                        <span>Ends: ${formattedDate}</span>
                    </div>
                </div>
                <div class="market-body">
                    <p class="market-description">${market.description}</p>
                    <div class="outcomes">
                        ${Object.keys(market.outcomes).map(outcomeName => {
                const outcome = market.outcomes[outcomeName];
                const odds = outcome.odds || 1.8;
                return `
                                <div class="outcome">
                                    <span class="outcome-name">${outcomeName}</span>
                                    <span class="outcome-odds">${odds}x</span>
                                    <button class="btn btn-sm bet-btn-sm" data-market="${marketId}" data-outcome="${outcomeName}" data-odds="${odds}">Bet</button>
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

    console.log(`Added ${cryptoMarketsCount} crypto markets to dashboard`);
});
