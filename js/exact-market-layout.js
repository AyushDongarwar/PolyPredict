// Script to create exact market layout matching the screenshot
document.addEventListener('DOMContentLoaded', function () {
    console.log('Creating exact market layout...');

    // Clear existing markets
    clearExistingMarkets();

    // Create exact markets from screenshot
    createExactMarkets();

    console.log('Exact market layout created');
});

// Clear existing markets
function clearExistingMarkets() {
    const marketsGrid = document.querySelector('.markets-grid');
    if (marketsGrid) {
        marketsGrid.innerHTML = '';
    }
}

// Create exact markets from screenshot
function createExactMarkets() {
    const marketsGrid = document.querySelector('.markets-grid');
    if (!marketsGrid) return;

    // Set grid layout
    marketsGrid.style.cssText = `
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 20px !important;
        margin-bottom: 40px !important;
    `;

    // Create Bitcoin Price market
    const bitcoinMarket = document.createElement('div');
    bitcoinMarket.className = 'market-card running';
    bitcoinMarket.dataset.marketId = 'crypto-1';
    bitcoinMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">Bitcoin Price End of 2025</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2024</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">What will be the price of Bitcoin at the end of 2025?</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Under $50000</span>
                    <div>
                        <span class="outcome-odds">3.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-1" data-outcome="under-50000" data-odds="3.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">$50000 - $100000</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-1" data-outcome="50000-100000" data-odds="2.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Over $100000</span>
                    <div>
                        <span class="outcome-odds">4.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-1" data-outcome="over-100000" data-odds="4.0">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-1" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(bitcoinMarket);

    // Create Ethereum Price market
    const ethereumMarket = document.createElement('div');
    ethereumMarket.className = 'market-card running';
    ethereumMarket.dataset.marketId = 'crypto-2';
    ethereumMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">What will be the price of Ethereum at the end of 2025?</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2025</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">Predict the price range of Ethereum (ETH) at the end of 2025.</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Under $5000</span>
                    <div>
                        <span class="outcome-odds">3.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-2" data-outcome="under-5000" data-odds="3.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">$5000 - $10,000</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-2" data-outcome="5000-10000" data-odds="2.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Over $10,000</span>
                    <div>
                        <span class="outcome-odds">4.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-2" data-outcome="over-10000" data-odds="4.0">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-2" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(ethereumMarket);

    // Create Solana Price market
    const solanaMarket = document.createElement('div');
    solanaMarket.className = 'market-card running';
    solanaMarket.dataset.marketId = 'crypto-3';
    solanaMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">What will be the price of Solana at the end of 2025?</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2025</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">Predict the price range of Solana (SOL) at the end of 2025.</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Under $500</span>
                    <div>
                        <span class="outcome-odds">3.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-3" data-outcome="under-500" data-odds="3.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">$500 - $1000</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-3" data-outcome="500-1000" data-odds="2.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Over $1000</span>
                    <div>
                        <span class="outcome-odds">4.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-3" data-outcome="over-1000" data-odds="4.0">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-3" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(solanaMarket);

    // Create US Election market
    const electionMarket = document.createElement('div');
    electionMarket.className = 'market-card running';
    electionMarket.dataset.marketId = '1';
    electionMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">US Presidential Election 2024</h3>
            <div class="market-meta">
                <span>Politics</span>
                <span>Ends: Nov 5, 2024</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">Who will win the 2024 US Presidential Election?</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Republican</span>
                    <div>
                        <span class="outcome-odds">1.8x</span>
                        <button class="bet-btn-sm" data-market="1" data-outcome="Republican" data-odds="1.8">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Democrat</span>
                    <div>
                        <span class="outcome-odds">2.1x</span>
                        <button class="bet-btn-sm" data-market="1" data-outcome="Democrat" data-odds="2.1">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Other</span>
                    <div>
                        <span class="outcome-odds">15.0x</span>
                        <button class="bet-btn-sm" data-market="1" data-outcome="Other" data-odds="15.0">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="1" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(electionMarket);

    // Create Cardano Price market
    const cardanoMarket = document.createElement('div');
    cardanoMarket.className = 'market-card running';
    cardanoMarket.dataset.marketId = 'crypto-4';
    cardanoMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">Cardano Price End of 2025</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2025</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">Predict the price range of Cardano (ADA) at the end of 2025.</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Under $5</span>
                    <div>
                        <span class="outcome-odds">2.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-4" data-outcome="under-5" data-odds="2.5">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">$5 - $10</span>
                    <div>
                        <span class="outcome-odds">3.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-4" data-outcome="5-10" data-odds="3.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Over $10</span>
                    <div>
                        <span class="outcome-odds">5.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-4" data-outcome="over-10" data-odds="5.0">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-4" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(cardanoMarket);

    // Create Ripple Price market
    const rippleMarket = document.createElement('div');
    rippleMarket.className = 'market-card running';
    rippleMarket.dataset.marketId = 'crypto-5';
    rippleMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">Ripple Price After SEC Case Resolution</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2024</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">What will be the price of XRP within 30 days after the SEC case is fully resolved?</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Under $1</span>
                    <div>
                        <span class="outcome-odds">3.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-5" data-outcome="under-1" data-odds="3.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">$1 - $3</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-5" data-outcome="1-3" data-odds="2.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Over $3</span>
                    <div>
                        <span class="outcome-odds">4.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-5" data-outcome="over-3" data-odds="4.0">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-5" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(rippleMarket);

    // Create Dogecoin Price market
    const dogeMarket = document.createElement('div');
    dogeMarket.className = 'market-card running';
    dogeMarket.dataset.marketId = 'crypto-6';
    dogeMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">Dogecoin Price After Next Elon Tweet</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2024</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">What will be the price change of Dogecoin within 24 hours after Elon Musk's next tweet about it?</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Decrease</span>
                    <div>
                        <span class="outcome-odds">4.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-6" data-outcome="decrease" data-odds="4.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Increase 0-20%</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-6" data-outcome="increase-0-20" data-odds="2.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Increase >20%</span>
                    <div>
                        <span class="outcome-odds">3.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-6" data-outcome="increase-over-20" data-odds="3.0">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-6" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(dogeMarket);

    // Create Polygon Price market
    const polygonMarket = document.createElement('div');
    polygonMarket.className = 'market-card running';
    polygonMarket.dataset.marketId = 'crypto-7';
    polygonMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">Polygon Price End of 2025</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2025</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">Predict the price range of Polygon (MATIC) at the end of 2025.</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Under $2</span>
                    <div>
                        <span class="outcome-odds">2.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-7" data-outcome="under-2" data-odds="2.5">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">$2 - $5</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-7" data-outcome="2-5" data-odds="2.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Over $5</span>
                    <div>
                        <span class="outcome-odds">3.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-7" data-outcome="over-5" data-odds="3.5">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-7" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(polygonMarket);

    // Create Chainlink Price market
    const chainlinkMarket = document.createElement('div');
    chainlinkMarket.className = 'market-card running';
    chainlinkMarket.dataset.marketId = 'crypto-8';
    chainlinkMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">Chainlink Price End of 2025</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2025</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">Predict the price range of Chainlink (LINK) at the end of 2025.</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Under $20</span>
                    <div>
                        <span class="outcome-odds">3.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-8" data-outcome="under-20" data-odds="3.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">$20 - $50</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-8" data-outcome="20-50" data-odds="2.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Over $50</span>
                    <div>
                        <span class="outcome-odds">4.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-8" data-outcome="over-50" data-odds="4.0">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-8" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(chainlinkMarket);

    // Create Bitcoin Dominance market
    const btcDominanceMarket = document.createElement('div');
    btcDominanceMarket.className = 'market-card running';
    btcDominanceMarket.dataset.marketId = 'crypto-9';
    btcDominanceMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">Bitcoin Market Dominance End of 2024</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2024</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">What will be Bitcoin's market dominance percentage at the end of 2024?</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Under 40%</span>
                    <div>
                        <span class="outcome-odds">3.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-9" data-outcome="under-40" data-odds="3.5">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">40% - 50%</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-9" data-outcome="40-50" data-odds="2.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Over 50%</span>
                    <div>
                        <span class="outcome-odds">2.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-9" data-outcome="over-50" data-odds="2.5">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-9" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(btcDominanceMarket);

    // Create Ethereum 2.0 Upgrade market
    const eth2Market = document.createElement('div');
    eth2Market.className = 'market-card running';
    eth2Market.dataset.marketId = 'crypto-10';
    eth2Market.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">Ethereum 2.0 Full Implementation Date</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2025</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">When will Ethereum complete its full transition to Ethereum 2.0 (including sharding)?</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Before July 2024</span>
                    <div>
                        <span class="outcome-odds">5.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-10" data-outcome="before-july-2024" data-odds="5.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">July 2024 - Dec 2024</span>
                    <div>
                        <span class="outcome-odds">3.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-10" data-outcome="july-dec-2024" data-odds="3.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">2025 or later</span>
                    <div>
                        <span class="outcome-odds">1.8x</span>
                        <button class="bet-btn-sm" data-market="crypto-10" data-outcome="2025-or-later" data-odds="1.8">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-10" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(eth2Market);

    // Create NFT Market Volume market
    const nftMarket = document.createElement('div');
    nftMarket.className = 'market-card running';
    nftMarket.dataset.marketId = 'crypto-11';
    nftMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">NFT Market Trading Volume 2024</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2024</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">What will be the total NFT market trading volume for 2024 compared to 2023?</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Decrease >20%</span>
                    <div>
                        <span class="outcome-odds">3.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-11" data-outcome="decrease-over-20" data-odds="3.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">-20% to +20%</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-11" data-outcome="-20-to-20" data-odds="2.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Increase >20%</span>
                    <div>
                        <span class="outcome-odds">2.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-11" data-outcome="increase-over-20" data-odds="2.5">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-11" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(nftMarket);

    // Create Central Bank Digital Currency market
    const cbdcMarket = document.createElement('div');
    cbdcMarket.className = 'market-card running';
    cbdcMarket.dataset.marketId = 'crypto-12';
    cbdcMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">First Major Economy to Launch CBDC</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2025</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">Which major economy will be the first to fully launch a Central Bank Digital Currency (CBDC)?</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">China</span>
                    <div>
                        <span class="outcome-odds">1.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-12" data-outcome="china" data-odds="1.5">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">European Union</span>
                    <div>
                        <span class="outcome-odds">3.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-12" data-outcome="eu" data-odds="3.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">United States</span>
                    <div>
                        <span class="outcome-odds">5.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-12" data-outcome="us" data-odds="5.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Other</span>
                    <div>
                        <span class="outcome-odds">2.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-12" data-outcome="other" data-odds="2.5">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-12" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(cbdcMarket);

    // Create DeFi Total Value Locked market
    const defiTvlMarket = document.createElement('div');
    defiTvlMarket.className = 'market-card running';
    defiTvlMarket.dataset.marketId = 'crypto-13';
    defiTvlMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">DeFi Total Value Locked End of 2024</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2024</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">What will be the total value locked (TVL) in DeFi protocols at the end of 2024?</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Under $50 billion</span>
                    <div>
                        <span class="outcome-odds">3.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-13" data-outcome="under-50b" data-odds="3.5">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">$50B - $100B</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-13" data-outcome="50b-100b" data-odds="2.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Over $100 billion</span>
                    <div>
                        <span class="outcome-odds">2.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-13" data-outcome="over-100b" data-odds="2.5">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-13" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(defiTvlMarket);

    // Create Layer 2 Adoption market
    const layer2Market = document.createElement('div');
    layer2Market.className = 'market-card running';
    layer2Market.dataset.marketId = 'crypto-14';
    layer2Market.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">Ethereum Layer 2 Adoption End of 2024</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2024</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">What percentage of Ethereum transactions will occur on Layer 2 solutions by the end of 2024?</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Under 40%</span>
                    <div>
                        <span class="outcome-odds">3.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-14" data-outcome="under-40" data-odds="3.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">40% - 70%</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-14" data-outcome="40-70" data-odds="2.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">Over 70%</span>
                    <div>
                        <span class="outcome-odds">3.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-14" data-outcome="over-70" data-odds="3.5">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-14" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(layer2Market);

    // Create Crypto Regulation market
    const regulationMarket = document.createElement('div');
    regulationMarket.className = 'market-card running';
    regulationMarket.dataset.marketId = 'crypto-15';
    regulationMarket.innerHTML = `
        <div class="market-header">
            <h3 class="market-title">US Comprehensive Crypto Regulation</h3>
            <div class="market-meta">
                <span>Crypto</span>
                <span>Ends: Dec 31, 2025</span>
            </div>
        </div>
        <div class="market-body">
            <p class="market-description">When will the United States pass comprehensive cryptocurrency regulation legislation?</p>
            <div class="outcomes">
                <div class="outcome">
                    <span class="outcome-name">Before 2025</span>
                    <div>
                        <span class="outcome-odds">4.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-15" data-outcome="before-2025" data-odds="4.0">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">During 2025</span>
                    <div>
                        <span class="outcome-odds">2.5x</span>
                        <button class="bet-btn-sm" data-market="crypto-15" data-outcome="during-2025" data-odds="2.5">Bet</button>
                    </div>
                </div>
                <div class="outcome">
                    <span class="outcome-name">After 2025</span>
                    <div>
                        <span class="outcome-odds">2.0x</span>
                        <button class="bet-btn-sm" data-market="crypto-15" data-outcome="after-2025" data-odds="2.0">Bet</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="market-footer">
            <span class="open">Open</span>
            <button class="place-bet" data-market="crypto-15" data-outcome="" data-odds="0">Place Bet</button>
        </div>
    `;
    marketsGrid.appendChild(regulationMarket);

    // Apply styles to all elements
    applyExactStyles();
}

// Apply exact styles to match screenshot
function applyExactStyles() {
    // Add CSS to ensure exact layout
    const style = document.createElement('style');
    style.textContent = `
        .market-card {
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
        }

        .market-header {
            padding: 15px !important;
            border-bottom: 1px solid #f0f0f0 !important;
            background: white !important;
        }

        .market-title {
            font-weight: 600 !important;
            margin-bottom: 8px !important;
            color: #333 !important;
            font-size: 1.1rem !important;
            line-height: 1.4 !important;
        }

        .market-meta {
            display: flex !important;
            justify-content: space-between !important;
            font-size: 0.85rem !important;
            color: #666 !important;
        }

        .market-meta span:first-child {
            background-color: rgba(108, 92, 231, 0.1) !important;
            color: #6c5ce7 !important;
            padding: 3px 8px !important;
            border-radius: 12px !important;
            font-weight: 500 !important;
            font-size: 0.75rem !important;
        }

        .market-body {
            padding: 15px !important;
        }

        .market-description {
            margin-bottom: 15px !important;
            font-size: 0.9rem !important;
            color: #555 !important;
            line-height: 1.5 !important;
        }

        .outcomes {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .outcome {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 10px 0 !important;
            border: none !important;
            border-bottom: 1px solid #eee !important;
            border-radius: 0 !important;
            margin-bottom: 0 !important;
            background-color: transparent !important;
        }

        .outcome:last-child {
            border-bottom: none !important;
        }

        .outcome-name {
            font-weight: 500 !important;
            color: #444 !important;
            flex: 1 !important;
        }

        .outcome-odds {
            font-weight: 600 !important;
            color: #6c5ce7 !important;
            background-color: rgba(108, 92, 231, 0.1) !important;
            padding: 4px 10px !important;
            border-radius: 12px !important;
            font-size: 0.9rem !important;
            margin: 0 10px !important;
        }

        .bet-btn-sm, .place-bet {
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
        }

        .market-footer {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 10px 15px !important;
            border-top: 1px solid #f0f0f0 !important;
            background-color: #fafafa !important;
        }

        .open {
            display: inline-block !important;
            padding: 3px 8px !important;
            border-radius: 12px !important;
            font-size: 0.75rem !important;
            font-weight: 500 !important;
            background-color: rgba(0, 184, 148, 0.1) !important;
            color: #00b894 !important;
        }
    `;
    document.head.appendChild(style);
}
