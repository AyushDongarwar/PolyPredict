// Script to add 10 more example crypto markets
document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing crypto markets module...');

    // Add event listener to the button
    const addCryptoMarketsBtn = document.getElementById('add-crypto-markets-btn');
    if (addCryptoMarketsBtn) {
        addCryptoMarketsBtn.addEventListener('click', addCryptoMarkets);
    }
});

// Function to add crypto markets
function addCryptoMarkets() {
    console.log('Adding example crypto markets...');

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

    // Create example crypto markets
    const cryptoMarkets = [
        {
            title: "Ethereum Price End of Month",
            description: "What will be the price of Ethereum at the end of this month?",
            category: "Cryptocurrency",
            closingDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
            outcomes: [
                { name: "Under $2,000", odds: 3.5 },
                { name: "$2,000 - $3,000", odds: 2.0 },
                { name: "$3,000 - $4,000", odds: 2.2 },
                { name: "Above $4,000", odds: 4.0 }
            ]
        },
        {
            title: "Solana vs Cardano Performance",
            description: "Which cryptocurrency will have a higher percentage gain by the end of the quarter?",
            category: "Cryptocurrency",
            closingDate: new Date(new Date().getFullYear(), Math.floor((new Date().getMonth() + 3) / 3) * 3, 1).toISOString(),
            outcomes: [
                { name: "Solana", odds: 1.9 },
                { name: "Cardano", odds: 2.1 },
                { name: "Equal (within 5%)", odds: 5.0 }
            ]
        },
        {
            title: "Bitcoin Halving Price Impact",
            description: "How will Bitcoin's price change 30 days after the next halving?",
            category: "Cryptocurrency",
            closingDate: new Date(2024, 6, 1).toISOString(), // July 1, 2024
            outcomes: [
                { name: "Decrease by >10%", odds: 3.0 },
                { name: "Change between -10% and +10%", odds: 2.5 },
                { name: "Increase by 10-50%", odds: 1.8 },
                { name: "Increase by >50%", odds: 3.5 }
            ]
        },
        {
            title: "Next Major Exchange Hack",
            description: "Which major crypto exchange will experience a security breach next?",
            category: "Cryptocurrency",
            closingDate: new Date(new Date().getFullYear(), new Date().getMonth() + 6, 1).toISOString(),
            outcomes: [
                { name: "Binance", odds: 4.0 },
                { name: "Coinbase", odds: 5.0 },
                { name: "Kraken", odds: 4.5 },
                { name: "OKX", odds: 3.5 },
                { name: "None of the above", odds: 1.5 }
            ]
        },
        {
            title: "Ripple (XRP) SEC Case Resolution",
            description: "How will the SEC vs Ripple case ultimately be resolved?",
            category: "Cryptocurrency",
            closingDate: new Date(2024, 11, 31).toISOString(), // Dec 31, 2024
            outcomes: [
                { name: "Complete Ripple victory", odds: 2.5 },
                { name: "Partial Ripple victory", odds: 1.7 },
                { name: "Settlement agreement", odds: 2.0 },
                { name: "SEC victory", odds: 4.0 }
            ]
        },
        {
            title: "Dogecoin Price After Next Elon Tweet",
            description: "How will Dogecoin's price change within 24 hours of Elon Musk's next tweet about it?",
            category: "Cryptocurrency",
            closingDate: new Date(new Date().getFullYear(), new Date().getMonth() + 3, 1).toISOString(),
            outcomes: [
                { name: "Decrease", odds: 3.0 },
                { name: "Increase by 0-10%", odds: 2.0 },
                { name: "Increase by 10-25%", odds: 2.5 },
                { name: "Increase by >25%", odds: 3.5 }
            ]
        },
        {
            title: "First Major Retailer to Accept Crypto in 2024",
            description: "Which major retailer will be the first to announce acceptance of cryptocurrency in 2024?",
            category: "Cryptocurrency",
            closingDate: new Date(2024, 11, 31).toISOString(), // Dec 31, 2024
            outcomes: [
                { name: "Walmart", odds: 2.5 },
                { name: "Amazon", odds: 2.0 },
                { name: "Target", odds: 3.5 },
                { name: "Home Depot", odds: 4.0 },
                { name: "Other", odds: 1.8 }
            ]
        },
        {
            title: "Ethereum Gas Fees Trend",
            description: "What will happen to average Ethereum gas fees by the end of the quarter?",
            category: "Cryptocurrency",
            closingDate: new Date(new Date().getFullYear(), Math.floor((new Date().getMonth() + 3) / 3) * 3, 1).toISOString(),
            outcomes: [
                { name: "Decrease by >30%", odds: 3.0 },
                { name: "Decrease by 10-30%", odds: 2.2 },
                { name: "Change between -10% and +10%", odds: 2.0 },
                { name: "Increase by 10-30%", odds: 2.5 },
                { name: "Increase by >30%", odds: 3.5 }
            ]
        },
        {
            title: "Next Cryptocurrency to Enter Top 10 by Market Cap",
            description: "Which cryptocurrency outside the current top 10 will be the first to enter the top 10 by market cap?",
            category: "Cryptocurrency",
            closingDate: new Date(new Date().getFullYear(), new Date().getMonth() + 6, 1).toISOString(),
            outcomes: [
                { name: "Internet Computer (ICP)", odds: 4.0 },
                { name: "Chainlink (LINK)", odds: 2.5 },
                { name: "Polygon (MATIC)", odds: 3.0 },
                { name: "Cosmos (ATOM)", odds: 3.5 },
                { name: "Other", odds: 1.8 }
            ]
        },
        {
            title: "Bitcoin Dominance by Year End",
            description: "What will Bitcoin's market dominance percentage be at the end of the year?",
            category: "Cryptocurrency",
            closingDate: new Date(new Date().getFullYear(), 11, 31).toISOString(), // Dec 31
            outcomes: [
                { name: "Below 40%", odds: 3.0 },
                { name: "40% - 45%", odds: 2.2 },
                { name: "45% - 50%", odds: 2.0 },
                { name: "50% - 55%", odds: 2.5 },
                { name: "Above 55%", odds: 3.5 }
            ]
        }
    ];

    // Add markets to betting state
    cryptoMarkets.forEach((marketData, index) => {
        const marketId = `crypto-${Date.now()}-${index}`;

        // Create market in betting state
        window.bettingState.markets[marketId] = {
            id: marketId,
            title: marketData.title,
            description: marketData.description,
            category: marketData.category,
            createdAt: new Date().toISOString(),
            closingDate: marketData.closingDate,
            status: 'open',
            outcomes: {},
            bets: []
        };

        console.log(`Created market: ${marketData.title} with ID ${marketId}`);

        // Add outcomes to market
        marketData.outcomes.forEach(outcome => {
            window.bettingState.markets[marketId].outcomes[outcome.name] = {
                odds: outcome.odds,
                bettors: [],
                totalBets: 0
            };
        });

        // Add some random bets to make markets look active
        const numBets = Math.floor(Math.random() * 10) + 5; // 5-15 bets per market

        for (let i = 0; i < numBets; i++) {
            // Select random outcome
            const outcomes = Object.keys(window.bettingState.markets[marketId].outcomes);
            const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];

            // Create bot user
            const botUserId = `bot-${Date.now()}-${i}`;

            // Create bet
            const bet = {
                id: `bet-${Date.now()}-${i}`,
                userId: botUserId,
                userEmail: `bot${Math.floor(Math.random() * 10000)}@example.com`,
                marketId,
                outcome: randomOutcome,
                amount: 1,
                timestamp: new Date().toISOString(),
                status: 'active',
                isBot: true
            };

            // Add bet to market
            window.bettingState.markets[marketId].bets.push(bet);
            window.bettingState.markets[marketId].outcomes[randomOutcome].bettors.push(botUserId);
            window.bettingState.markets[marketId].outcomes[randomOutcome].totalBets += 1;
        }
    });

    // Save betting state
    localStorage.setItem('polypredict_betting_state', JSON.stringify(window.bettingState));

    console.log('Added 10 example crypto markets with random bets');

    // Show success message
    alert('Successfully added 10 example crypto markets with random bets!');

    // Reload page to show new markets
    setTimeout(() => {
        location.reload();
    }, 1000);
});
