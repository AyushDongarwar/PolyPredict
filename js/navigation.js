// Navigation utilities for PolyPredict

// Update navigation based on user login status
function updateNavigation() {
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Get navigation elements
    const navLinks = document.querySelector('.nav-links');
    const walletBtnContainer = document.querySelector('.wallet-btn');
    
    if (currentUser) {
        // User is logged in
        
        // Add settings link if not already present
        if (navLinks && !document.querySelector('a[href="settings.html"]')) {
            // Check if we need to add the settings link to nav
            const settingsLi = document.createElement('li');
            const settingsLink = document.createElement('a');
            settingsLink.href = 'settings.html';
            settingsLink.innerHTML = '<i class="fas fa-cog"></i> Settings';
            
            // Check if current page is settings
            if (window.location.href.includes('settings.html')) {
                settingsLink.classList.add('active');
            }
            
            settingsLi.appendChild(settingsLink);
            navLinks.appendChild(settingsLi);
        }
        
        // Update wallet button container
        if (walletBtnContainer) {
            // Hide login button
            const loginBtn = walletBtnContainer.querySelector('a[href="login.html"]');
            if (loginBtn) {
                loginBtn.style.display = 'none';
            }
            
            // Add logout button if not already present
            if (!walletBtnContainer.querySelector('#logout-btn')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logout-btn';
                logoutBtn.className = 'btn btn-outline';
                logoutBtn.textContent = 'Logout';
                logoutBtn.style.marginRight = '10px';
                logoutBtn.addEventListener('click', function() {
                    // Clear user session
                    sessionStorage.removeItem('currentUser');
                    // Redirect to home page
                    window.location.href = 'index.html';
                });
                
                walletBtnContainer.insertBefore(logoutBtn, walletBtnContainer.firstChild);
            }
            
            // Add user email display
            if (!walletBtnContainer.querySelector('#user-email-display')) {
                const emailDisplay = document.createElement('span');
                emailDisplay.id = 'user-email-display';
                emailDisplay.textContent = currentUser.email;
                emailDisplay.style.marginRight = '10px';
                emailDisplay.style.fontSize = '0.9rem';
                
                walletBtnContainer.insertBefore(emailDisplay, walletBtnContainer.firstChild);
            }
            
            // Add admin badge if user is admin
            if (currentUser.isAdmin && !walletBtnContainer.querySelector('#admin-badge')) {
                const adminBadge = document.createElement('span');
                adminBadge.id = 'admin-badge';
                adminBadge.textContent = 'Admin';
                adminBadge.style.backgroundColor = '#d63031';
                adminBadge.style.color = 'white';
                adminBadge.style.padding = '5px 10px';
                adminBadge.style.borderRadius = '5px';
                adminBadge.style.marginRight = '10px';
                
                walletBtnContainer.insertBefore(adminBadge, walletBtnContainer.firstChild);
            }
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
});
