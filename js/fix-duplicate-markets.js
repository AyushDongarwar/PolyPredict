// Script to fix duplicate markets
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fixing duplicate markets...');
    
    // Fix duplicate Bitcoin markets
    fixDuplicateMarkets();
    
    // Fix market layout
    fixMarketLayout();
    
    console.log('Duplicate markets fixed successfully');
});

// Fix duplicate markets
function fixDuplicateMarkets() {
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
            // Mark as duplicate
            card.dataset.marketId = 'crypto-duplicate';
            card.style.display = 'none';
        } else {
            // Add to titles
            marketTitles[title] = true;
        }
    });
}

// Fix market layout
function fixMarketLayout() {
    // Fix market cards layout
    const marketCards = document.querySelectorAll('.market-card');
    marketCards.forEach(card => {
        // Ensure proper structure
        const marketBody = card.querySelector('.market-body');
        if (marketBody) {
            // Make sure outcomes are at the bottom
            const outcomes = marketBody.querySelector('.outcomes');
            if (outcomes) {
                outcomes.style.marginTop = 'auto';
            }
        }
        
        // Fix market footer if exists
        const marketFooter = card.querySelector('.market-footer');
        if (marketFooter) {
            marketFooter.style.padding = '10px 15px';
            marketFooter.style.borderTop = '1px solid #f0f0f0';
            marketFooter.style.display = 'flex';
            marketFooter.style.justifyContent = 'space-between';
            marketFooter.style.alignItems = 'center';
        }
        
        // Fix place bet button
        const placeBetBtn = card.querySelector('.place-bet');
        if (placeBetBtn) {
            placeBetBtn.style.backgroundColor = '#6c5ce7';
            placeBetBtn.style.color = 'white';
            placeBetBtn.style.border = 'none';
            placeBetBtn.style.borderRadius = '6px';
            placeBetBtn.style.padding = '8px 16px';
            placeBetBtn.style.fontWeight = '500';
            placeBetBtn.style.cursor = 'pointer';
        }
    });
    
    // Fix markets grid
    const marketsGrid = document.querySelector('.markets-grid');
    if (marketsGrid) {
        marketsGrid.style.display = 'grid';
        marketsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(400px, 1fr))';
        marketsGrid.style.gap = '20px';
        marketsGrid.style.marginBottom = '40px';
    }
}
