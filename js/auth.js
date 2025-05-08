// Authentication Functions
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in on page load
    checkLoginStatus();

    // Initialize login/register functionality if the forms exist
    initializeAuthForms();
});

// Initialize authentication forms
function initializeAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleForms = document.querySelectorAll('.toggle-form');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle between login and register forms
    if (toggleForms && toggleForms.length > 0) {
        toggleForms.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Toggle form clicked');
                const container = document.querySelector('.login-container');
                
                if (container) {
                    container.classList.toggle('show-register');
                    
                    // Force redraw for better rendering
                    container.style.display = 'none';
                    setTimeout(() => {
                        container.style.display = 'block';
                    }, 10);
                    
                    console.log('Form toggled, show-register:', container.classList.contains('show-register'));
                } else {
                    console.error('Login container not found');
                }
            });
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation
            if (!email || !password) {
                showMessage('Please enter both email and password', 'error');
                return;
            }
            
            // Simulate login (in a real app, this would be an API call)
            loginUser(email, password);
        });
    }

    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const phone = document.getElementById('registerPhone').value;
            
            // Simple validation
            if (!name || !email || !password || !confirmPassword || !phone) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            // Validate phone number format
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                showMessage('Please enter a valid 10-digit phone number', 'error');
                return;
            }
            
            // Simulate registration (in a real app, this would be an API call)
            registerUser(name, email, password, phone);
        });
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
}

// Login User
function loginUser(email, password) {
    // In a real application, this would be an API call to validate credentials
    // For demo purposes, we'll simulate a successful login with localStorage
    
    // Check if user exists in local storage (simulating a database)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store user session (in a real app, this would be a token)
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }));
        
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = user.redirectUrl || '../index.html';
        }, 1500);
    } else {
        showMessage('Invalid email or password', 'error');
    }
}

// Register User
function registerUser(name, email, password, phone) {
    // In a real application, this would be an API call to create a user
    // For demo purposes, we'll simulate registration with localStorage
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === email)) {
        showMessage('User with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        phone,
        createdAt: new Date().toISOString()
    };
    
    // Add to "database"
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
    }));
    
    showMessage('Registration successful! Redirecting...', 'success');
    
    // Redirect after a short delay
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}

// Logout User
function logoutUser() {
    localStorage.removeItem('currentUser');
    showMessage('Logged out successfully', 'success');
    
    // Redirect after a short delay
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// Check Login Status
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginButton = document.getElementById('loginButton');
    const userProfileButton = document.getElementById('userProfileButton');
    const logoutBtn = document.getElementById('logoutBtn');
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    
    if (currentUser) {
        // User is logged in
        if (loginButton) loginButton.style.display = 'none';
        if (userProfileButton) {
            userProfileButton.style.display = 'block';
            userProfileButton.querySelector('span').textContent = currentUser.name;
        }
        if (logoutBtn) logoutBtn.style.display = 'block';
        
        // Enable booking buttons
        if (bookNowButtons) {
            bookNowButtons.forEach(btn => {
                btn.classList.remove('disabled');
                btn.addEventListener('click', function(e) {
                    // Allow normal navigation
                });
            });
        }
    } else {
        // User is not logged in
        if (loginButton) loginButton.style.display = 'block';
        if (userProfileButton) userProfileButton.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        
        // Disable booking buttons for non-logged in users
        if (bookNowButtons) {
            bookNowButtons.forEach(btn => {
                btn.classList.add('disabled');
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showMessage('Please login to book a room', 'error');
                    // Redirect to login page
                    setTimeout(() => {
                        window.location.href = '../pages/login.html?redirect=' + encodeURIComponent(window.location.href);
                    }, 1500);
                });
            });
        }
    }
    
    // Check if we're on a restricted page
    const restrictedPages = ['/pages/profile.html', '/pages/payment.html'];
    const currentPath = window.location.pathname;
    
    if (!currentUser && restrictedPages.some(page => currentPath.includes(page))) {
        // Redirect to login page
        window.location.href = '../pages/login.html?redirect=' + encodeURIComponent(window.location.href);
    }
}

// Show message to user
function showMessage(message, type) {
    // Check if message container exists
    let messageContainer = document.getElementById('messageContainer');
    
    // If not, create one
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'messageContainer';
        messageContainer.className = 'message-container';
        document.body.appendChild(messageContainer);
        
        // Add styles for the message container
        const style = document.createElement('style');
        style.innerHTML = `
            .message-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 300px;
            }
            
            .message {
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                animation: slideIn 0.3s ease-in-out;
            }
            
            .message.success {
                background-color: #4CAF50;
            }
            
            .message.error {
                background-color: #F44336;
            }
            
            .message.info {
                background-color: #2196F3;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Add to container
    messageContainer.appendChild(messageElement);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
} 