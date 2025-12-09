/*
  assets/js/custom.js
  Purpose: Place for all custom JavaScript changes. Keep all project-specific JS here.
  Note: This file is intentionally minimal — put further scripts and handlers here.
*/

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Custom JS entry point. Add your code below.
    if (window.console && console.info) {
      console.info('assets/js/custom.js loaded');
    }

    // Sync rating sliders with their display values
    const ratingSliders = document.querySelectorAll('input[type="range"][id^="rating"]');
    ratingSliders.forEach(function (slider) {
      // Update display value on input
      slider.addEventListener('input', function () {
        const valueDisplay = document.getElementById(this.id + '-value');
        if (valueDisplay) {
          valueDisplay.textContent = this.value;
        }
      });
    });

    // Form validation and console logging
    const contactForm = document.querySelector('.php-email-form');
    if (window.console && console.log) {
      console.log('Contact form found:', contactForm ? 'Yes' : 'No');
    }
    
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        if (window.console && console.log) {
          console.log('Form submit event triggered');
        }

        // Gather form data into an object
        const formData = {
          vardas: document.querySelector('input[name="vardas"]')?.value || '',
          pavarde: document.querySelector('input[name="pavarde"]')?.value || '',
          email: document.querySelector('input[name="email"]')?.value || '',
          phone: document.querySelector('input[name="phone"]')?.value || '',
          address: document.querySelector('input[name="address"]')?.value || '',
          rating1: document.querySelector('input[name="rating1"]')?.value || '',
          rating2: document.querySelector('input[name="rating2"]')?.value || '',
          rating3: document.querySelector('input[name="rating3"]')?.value || ''
        };

        // Log form data to browser console
        console.log('Form Data Object:', formData);

        // Validate form data
        const errors = validateForm(formData);

        // Display validation results in the form
        displayValidationResults(contactForm, errors);

        // If no errors, show success message and log to console
        if (errors.length === 0) {
          console.info('Form validation passed. Data is ready for submission:', formData);
          if (window.console && console.log) {
            console.log('✓ All fields are valid');
          }

          // Calculate and display average rating
          const ratingAverage = calculateRatingAverage(formData);
          const fullName = formData.vardas + ' ' + formData.pavarde;
          console.log(fullName + ': ' + ratingAverage);
          // Show an on-page popup message for successful submission
          try {
            showPopupMessage('Duomenys pateikti sėkmingai!');
          } catch (err) {
            // If popup function is not available for any reason, fail silently
            console.info('Popup not available:', err && err.message);
          }
        }
      });
    }

    /**
     * Validate form fields
     * @param {Object} data - Form data object
     * @returns {Array} Array of error messages
     */
    function validateForm(data) {
      const errors = [];

      // Validate Vardas (First Name)
      if (!data.vardas || data.vardas.trim() === '') {
        errors.push('Vardas (First Name) is required');
      } else if (data.vardas.trim().length < 2) {
        errors.push('Vardas must be at least 2 characters');
      }

      // Validate Pavardė (Last Name)
      if (!data.pavarde || data.pavarde.trim() === '') {
        errors.push('Pavardė (Last Name) is required');
      } else if (data.pavarde.trim().length < 2) {
        errors.push('Pavardė must be at least 2 characters');
      }

      // Validate El. paštas (Email)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || data.email.trim() === '') {
        errors.push('El. paštas (Email) is required');
      } else if (!emailRegex.test(data.email)) {
        errors.push('El. paštas must be a valid email address');
      }

      // Validate Telefono numeris (Phone)
      const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
      if (!data.phone || data.phone.trim() === '') {
        errors.push('Telefono numeris (Phone) is required');
      } else if (!phoneRegex.test(data.phone)) {
        errors.push('Telefono numeris must be a valid phone number (at least 7 digits)');
      }

      // Validate Adresas (Address)
      if (!data.address || data.address.trim() === '') {
        errors.push('Adresas (Address) is required');
      } else if (data.address.trim().length < 5) {
        errors.push('Adresas must be at least 5 characters');
      }

      // Log validation errors to console
      if (errors.length > 0) {
        console.warn('Form validation errors:', errors);
      }

      return errors;
    }

    /**
     * Display validation results in the form UI
     * @param {HTMLElement} form - The form element
     * @param {Array} errors - Array of error messages
     */
    function displayValidationResults(form, errors) {
      const errorContainer = form.querySelector('.error-message');
      const sentContainer = form.querySelector('.sent-message');

      // Clear previous messages
      if (errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
      }
      if (sentContainer) {
        sentContainer.style.display = 'none';
      }

      if (errors.length > 0) {
        // Display errors
        if (errorContainer) {
          errorContainer.innerHTML = '<strong>Validation Errors:</strong><br>' + errors.join('<br>');
          errorContainer.style.display = 'block';
        }
      } else {
        // Display success message
        if (sentContainer) {
          sentContainer.textContent = 'Your message has been sent. Thank you!';
          sentContainer.style.display = 'block';
        }
        // Clear form after successful validation
        form.reset();
      }
    }

    /**
     * Calculate the average of three rating questions
     * @param {Object} formData - The form data object containing rating1, rating2, rating3
     * @returns {String} Average rating formatted to one decimal place
     */
    function calculateRatingAverage(formData) {
      const rating1 = parseInt(formData.rating1) || 0;
      const rating2 = parseInt(formData.rating2) || 0;
      const rating3 = parseInt(formData.rating3) || 0;
      
      const average = (rating1 + rating2 + rating3) / 3;
      return average.toFixed(1);
    }

    /**
     * Show a small popup overlay message on the page.
     * Creates the DOM nodes on first use and reuses them afterwards.
     * @param {String} message - Text to show inside the popup
     */
    function showPopupMessage(message) {
      // Ensure DOM available
      const existingOverlay = document.getElementById('form-success-popup-overlay');
      let overlay = existingOverlay;

      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'form-success-popup-overlay';
        overlay.className = 'form-popup-overlay';

        const box = document.createElement('div');
        box.className = 'form-popup';
        box.setAttribute('role', 'status');
        box.setAttribute('aria-live', 'polite');
        box.setAttribute('aria-atomic', 'true');

        const text = document.createElement('div');
        text.className = 'form-popup-text';
        box.appendChild(text);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'popup-close';
        closeBtn.type = 'button';
        closeBtn.textContent = 'OK';
        closeBtn.addEventListener('click', function () {
          overlay.classList.remove('visible');
        });
        box.appendChild(closeBtn);

        overlay.appendChild(box);
        overlay.addEventListener('click', function (e) {
          // Dismiss when clicking outside the box
          if (e.target === overlay) {
            overlay.classList.remove('visible');
          }
        });

        document.body.appendChild(overlay);
      }

      // Set message text and show
      const textNode = overlay.querySelector('.form-popup-text');
      if (textNode) textNode.textContent = message;
      overlay.classList.add('visible');

      // Auto-hide after 4 seconds
      window.clearTimeout(overlay._hideTimeout);
      overlay._hideTimeout = window.setTimeout(function () {
        overlay.classList.remove('visible');
      }, 4000);
    }

    // ==========================================
    // MEMORY GAME INITIALIZATION
    // ==========================================
    
    // Card data set: 12 unique emoji items (6 pairs in Easy, 12 pairs in Hard)
    const cardEmojis = ['🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎮', '🎯', '🎲', '🎳', '🎸', '🎺'];

    // Game state
    const gameState = {
      difficulty: 'easy', // 'easy' = 4x3 (12 cards), 'hard' = 6x4 (24 cards)
      gameActive: false,
      moves: 0,
      matchedPairs: 0,
      openCards: [],
      matchedCards: new Set(),
      isChecking: false,
      cards: [] // Will store card objects
    };
    gameState.timerInterval = null;
    gameState.elapsedTime = 0;

    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const startBtn = document.getElementById('game-start-btn');
    const resetBtn = document.getElementById('game-reset-btn');
    const movesDisplay = document.getElementById('moves-count');
    const matchedPairsDisplay = document.getElementById('matched-pairs-count');
    const winMessage = document.getElementById('game-win-message');
    const finalStatsDisplay = document.getElementById('final-stats');
    const timerDisplay = document.getElementById('timer-display');
    const bestMovesDisplay = document.getElementById('best-moves-count');

    // ========== Timer & Best-score functions (moved inside DOMContentLoaded)
    function getBestScore() {
      const key = `memoryGame_best_${gameState.difficulty}`;
      const saved = localStorage.getItem(key);
      return saved ? parseInt(saved, 10) : null;
    }

    function saveBestScore(moves) {
      const key = `memoryGame_best_${gameState.difficulty}`;
      const currentBest = getBestScore();
      if (!currentBest || moves < currentBest) {
        localStorage.setItem(key, moves.toString());
        return true;
      }
      return false;
    }

    function updateBestScoreDisplay() {
      const best = getBestScore();
      bestMovesDisplay.textContent = best ? best : '—';
    }

    function startTimer() {
      // Start fresh timer for a new game
      gameState.elapsedTime = 0;
      updateTimerDisplay();
      if (gameState.timerInterval) clearInterval(gameState.timerInterval);
      gameState.timerInterval = setInterval(() => {
        gameState.elapsedTime++;
        updateTimerDisplay();
      }, 1000);
    }

    function stopTimer() {
      if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
      }
    }

    function updateTimerDisplay() {
      const minutes = Math.floor(gameState.elapsedTime / 60);
      const seconds = gameState.elapsedTime % 60;
      timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    function shuffleArray(arr) {
      const array = [...arr];
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    /**
     * Generate card pairs based on difficulty level
     */
    function generateCardPairs() {
      let cardCount = gameState.difficulty === 'easy' ? 12 : 24;
      let pairsNeeded = cardCount / 2;
      
      // Get the first N emojis and duplicate them for pairs
      let cardsToUse = cardEmojis.slice(0, pairsNeeded);
      let cardPairs = [...cardsToUse, ...cardsToUse];
      
      return shuffleArray(cardPairs);
    }

    /**
     * Create and render the game board
     */
    function createGameBoard() {
      gameBoard.innerHTML = '';
      gameBoard.className = 'game-board ' + gameState.difficulty;
      
      const cardPairs = generateCardPairs();
      gameState.cards = [];
      
      cardPairs.forEach((emoji, index) => {
        const cardObj = {
          id: index,
          emoji: emoji,
          isFlipped: false,
          isMatched: false
        };
        gameState.cards.push(cardObj);
        
        // Create card DOM element
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.cardId = index;
        
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-face card-front';
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-face card-back';
        cardBack.textContent = emoji;
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        // Add click listener
        card.addEventListener('click', function () {
          handleCardClick(index);
        });
        
        gameBoard.appendChild(card);
      });
    }

    /**
     * Handle card click
     */
    function handleCardClick(cardId) {
      if (!gameState.gameActive) return;
      if (gameState.isChecking) return;
      if (gameState.openCards.length >= 2) return;
      if (gameState.matchedCards.has(cardId)) return;
      
      const card = gameState.cards[cardId];
      const cardElement = document.querySelector(`[data-card-id="${cardId}"] .card-inner`);
      
      if (card.isFlipped) return; // Already open
      
      // Flip the card
      card.isFlipped = true;
      cardElement.classList.add('flipped');
      gameState.openCards.push(cardId);
      
      // Check for match after two cards are opened
      if (gameState.openCards.length === 2) {
        gameState.isChecking = true;
        gameState.moves++;
        updateStats();
        
        setTimeout(() => {
          checkForMatch();
        }, 1000);
      }
    }

    /**
     * Check if two open cards match
     */
    function checkForMatch() {
      const [card1Id, card2Id] = gameState.openCards;
      const card1 = gameState.cards[card1Id];
      const card2 = gameState.cards[card2Id];
      
      if (card1.emoji === card2.emoji) {
        // Match found!
        gameState.matchedCards.add(card1Id);
        gameState.matchedCards.add(card2Id);
        gameState.matchedPairs++;
        
        // Mark cards as disabled
        document.querySelector(`[data-card-id="${card1Id}"]`).classList.add('card-disabled');
        document.querySelector(`[data-card-id="${card2Id}"]`).classList.add('card-disabled');
        
        updateStats();
        
        // Check for win
        if (gameState.matchedPairs === (gameState.difficulty === 'easy' ? 6 : 12)) {
          gameState.gameActive = false;
          showWinMessage();
        }
      } else {
        // No match: flip cards back
        const cardElement1 = document.querySelector(`[data-card-id="${card1Id}"] .card-inner`);
        const cardElement2 = document.querySelector(`[data-card-id="${card2Id}"] .card-inner`);
        
        cardElement1.classList.remove('flipped');
        cardElement2.classList.remove('flipped');
        
        card1.isFlipped = false;
        card2.isFlipped = false;
      }
      
      gameState.openCards = [];
      gameState.isChecking = false;
    }

    /**
     * Update stats display
     */
    function updateStats() {
      movesDisplay.textContent = gameState.moves;
      matchedPairsDisplay.textContent = gameState.matchedPairs;
    }

    /**
     * Show win message
     */
    function showWinMessage() {
      winMessage.style.display = 'block';
      const totalPairs = gameState.difficulty === 'easy' ? 6 : 12;
      const minutes = Math.floor(gameState.elapsedTime / 60);
      const seconds = gameState.elapsedTime % 60;
      finalStatsDisplay.textContent = `Jūs surašėte ${totalPairs} porų per ${gameState.moves} ėjimų per ${minutes}:${seconds < 10 ? '0' : ''}${seconds}!`;
      stopTimer();
      saveBestScore(gameState.moves);
      updateBestScoreDisplay();
    }

    /**
     * Hide win message
     */
    function hideWinMessage() {
      winMessage.style.display = 'none';
    }

    /**
     * Initialize/reset game
     */
    function initGame() {
      gameState.gameActive = true;
      gameState.moves = 0;
      gameState.matchedPairs = 0;
      gameState.openCards = [];
      gameState.matchedCards.clear();
      gameState.isChecking = false;
      
      hideWinMessage();
      createGameBoard();
      updateStats();
      updateBestScoreDisplay();
      startTimer();
    }

    /**
     * Reset game (restart with same difficulty)
     */
    function resetGame() {
      stopTimer();
      initGame();
    }

    /**
     * Change difficulty level
     */
    function setDifficulty(level) {
      gameState.difficulty = level;
      
      // Update button states
      difficultyBtns.forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector(`[data-difficulty="${level}"]`).classList.add('active');
      
      // Reset game when difficulty changes
      initGame();
    }

    // Event listeners
    difficultyBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        setDifficulty(this.dataset.difficulty);
      });
    });

    startBtn.addEventListener('click', function () {
      initGame();
    });

    resetBtn.addEventListener('click', function () {
      resetGame();
    });

    // Initialize game on page load
    initGame();
  });

})();
