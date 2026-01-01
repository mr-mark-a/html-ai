const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Game rooms storage
const rooms = new Map();

// Card types
const CARD_TYPES = {
    EXPLODING_KITTEN: 'exploding_kitten',
    DEFUSE: 'defuse',
    NOPE: 'nope',
    BEARD_CAT: 'beard_cat',
    HRINGG: 'hringg',
    TACOCAT: 'tacocat',
    SKIP: 'skip',
    ATTACK: 'attack',
    SHUFFLE: 'shuffle',
    SEE_FUTURE: 'see_future'
};

// Generate random 6-character room code
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Create initial deck
function createDeck(playerCount) {
    const deck = [];
    
    // Add cards based on player count
    const explodingKittens = playerCount - 1;
    const defuses = 6;
    const nopes = 5;
    const skips = 4;
    const attacks = 4;
    const shuffles = 4;
    const seeFutures = 5;
    const beardCats = 4;
    const hringgs = 4;
    const tacocats = 4;
    
    // Add Defuses (players get 1 each at start, rest in deck)
    for (let i = 0; i < defuses; i++) {
        deck.push({ type: CARD_TYPES.DEFUSE, id: `defuse_${i}` });
    }
    
    // Add other cards
    for (let i = 0; i < nopes; i++) {
        deck.push({ type: CARD_TYPES.NOPE, id: `nope_${i}` });
    }
    
    for (let i = 0; i < skips; i++) {
        deck.push({ type: CARD_TYPES.SKIP, id: `skip_${i}` });
    }
    
    for (let i = 0; i < attacks; i++) {
        deck.push({ type: CARD_TYPES.ATTACK, id: `attack_${i}` });
    }
    
    for (let i = 0; i < shuffles; i++) {
        deck.push({ type: CARD_TYPES.SHUFFLE, id: `shuffle_${i}` });
    }
    
    for (let i = 0; i < seeFutures; i++) {
        deck.push({ type: CARD_TYPES.SEE_FUTURE, id: `see_future_${i}` });
    }
    
    for (let i = 0; i < beardCats; i++) {
        deck.push({ type: CARD_TYPES.BEARD_CAT, id: `beard_cat_${i}` });
    }
    
    for (let i = 0; i < hringgs; i++) {
        deck.push({ type: CARD_TYPES.HRINGG, id: `hringg_${i}` });
    }
    
    for (let i = 0; i < tacocats; i++) {
        deck.push({ type: CARD_TYPES.TACOCAT, id: `tacocat_${i}` });
    }
    
    // Shuffle deck
    shuffleDeck(deck);
    
    // Add exploding kittens after shuffle (they'll be added later after dealing)
    const explodingKittenCards = [];
    for (let i = 0; i < explodingKittens; i++) {
        explodingKittenCards.push({ type: CARD_TYPES.EXPLODING_KITTEN, id: `exploding_${i}` });
    }
    
    return { deck, explodingKittenCards };
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Create a new room
function createRoom(hostSocketId, hostName) {
    const roomCode = generateRoomCode();
    
    rooms.set(roomCode, {
        code: roomCode,
        host: hostSocketId,
        players: new Map([[hostSocketId, {
            id: hostSocketId,
            name: hostName,
            hand: [],
            alive: true,
            isHost: true
        }]]),
        deck: [],
        discardPile: [],
        currentPlayerIndex: 0,
        gameStarted: false,
        turnCount: 1,
        pendingAction: null
    });
    
    return roomCode;
}

// Start the game
function startGame(roomCode) {
    const room = rooms.get(roomCode);
    if (!room || room.gameStarted) return false;
    
    const playerCount = room.players.size;
    if (playerCount < 2) return false;
    
    // Create deck
    const { deck, explodingKittenCards } = createDeck(playerCount);
    room.deck = deck;
    
    // Deal initial cards to each player
    const playerIds = Array.from(room.players.keys());
    playerIds.forEach(playerId => {
        const player = room.players.get(playerId);
        player.hand = [];
        
        // Deal 1 defuse card
        const defuseIndex = room.deck.findIndex(card => card.type === CARD_TYPES.DEFUSE);
        if (defuseIndex !== -1) {
            player.hand.push(room.deck.splice(defuseIndex, 1)[0]);
        }
        
        // Deal 4 more cards
        for (let i = 0; i < 4; i++) {
            if (room.deck.length > 0) {
                player.hand.push(room.deck.pop());
            }
        }
    });
    
    // Add exploding kittens to deck and shuffle
    room.deck.push(...explodingKittenCards);
    shuffleDeck(room.deck);
    
    room.gameStarted = true;
    room.currentPlayerIndex = 0;
    
    return true;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Host creates a new room
    socket.on('host-game', (playerName) => {
        const roomCode = createRoom(socket.id, playerName);
        socket.join(roomCode);
        socket.emit('room-created', { roomCode, playerName });
        console.log(`Room ${roomCode} created by ${playerName}`);
    });
    
    // Player joins existing room
    socket.on('join-game', ({ roomCode, playerName }) => {
        const room = rooms.get(roomCode);
        
        if (!room) {
            socket.emit('join-error', 'Room not found');
            return;
        }
        
        if (room.gameStarted) {
            socket.emit('join-error', 'Game already started');
            return;
        }
        
        room.players.set(socket.id, {
            id: socket.id,
            name: playerName,
            hand: [],
            alive: true,
            isHost: false
        });
        
        socket.join(roomCode);
        socket.emit('join-success', { roomCode, playerName });
        
        // Notify all players in room
        const playerList = Array.from(room.players.values()).map(p => ({
            id: p.id,
            name: p.name,
            isHost: p.isHost
        }));
        
        io.to(roomCode).emit('player-list-update', playerList);
        console.log(`${playerName} joined room ${roomCode}`);
    });
    
    // Start game
    socket.on('start-game', (roomCode) => {
        const room = rooms.get(roomCode);
        
        if (!room || room.host !== socket.id) {
            socket.emit('error', 'Only host can start the game');
            return;
        }
        
        if (startGame(roomCode)) {
            // Send game state to all players
            broadcastGameState(roomCode);
            io.to(roomCode).emit('game-started');
            console.log(`Game started in room ${roomCode}`);
        } else {
            socket.emit('error', 'Need at least 2 players to start');
        }
    });
    
    // Draw card
    socket.on('draw-card', (roomCode) => {
        const room = rooms.get(roomCode);
        if (!room || !room.gameStarted) return;
        
        const playerIds = Array.from(room.players.keys());
        const currentPlayerId = playerIds[room.currentPlayerIndex];
        
        if (socket.id !== currentPlayerId) {
            socket.emit('error', 'Not your turn');
            return;
        }
        
        if (room.deck.length === 0) {
            socket.emit('error', 'No cards left in deck');
            return;
        }
        
        const drawnCard = room.deck.pop();
        const player = room.players.get(socket.id);
        
        if (drawnCard.type === CARD_TYPES.EXPLODING_KITTEN) {
            // Check if player has defuse
            const defuseIndex = player.hand.findIndex(card => card.type === CARD_TYPES.DEFUSE);
            
            if (defuseIndex !== -1) {
                // Player has defuse - remove it and let them place kitten back
                const defuseCard = player.hand.splice(defuseIndex, 1)[0];
                room.discardPile.push(defuseCard);
                
                socket.emit('drew-exploding-kitten', { hasDefuse: true });
                room.pendingAction = {
                    type: 'place-exploding-kitten',
                    playerId: socket.id,
                    card: drawnCard
                };
            } else {
                // Player explodes
                player.alive = false;
                player.hand = []; // Discard all cards
                socket.emit('player-exploded');
                
                // Move to next player
                nextTurn(roomCode);
            }
        } else {
            player.hand.push(drawnCard);
            socket.emit('card-drawn', drawnCard);
            
            // Move to next player
            nextTurn(roomCode);
        }
        
        broadcastGameState(roomCode);
    });
    
    // Place exploding kitten back in deck
    socket.on('place-exploding-kitten', ({ roomCode, position }) => {
        const room = rooms.get(roomCode);
        if (!room || !room.pendingAction || room.pendingAction.type !== 'place-exploding-kitten') return;
        
        if (room.pendingAction.playerId !== socket.id) return;
        
        const card = room.pendingAction.card;
        const deckPosition = Math.min(Math.max(0, position), room.deck.length);
        
        room.deck.splice(deckPosition, 0, card);
        room.pendingAction = null;
        
        socket.emit('kitten-placed');
        broadcastGameState(roomCode);
    });
    
    // Play card
    socket.on('play-card', ({ roomCode, cardId, targetPlayerId, requestedCard }) => {
        const room = rooms.get(roomCode);
        if (!room || !room.gameStarted) return;
        
        const player = room.players.get(socket.id);
        const cardIndex = player.hand.findIndex(card => card.id === cardId);
        
        if (cardIndex === -1) return;
        
        const card = player.hand[cardIndex];
        
        // Handle different card types
        switch (card.type) {
            case CARD_TYPES.SKIP:
                player.hand.splice(cardIndex, 1);
                room.discardPile.push(card);
                nextTurn(roomCode);
                break;
                
            case CARD_TYPES.ATTACK:
                player.hand.splice(cardIndex, 1);
                room.discardPile.push(card);
                room.turnCount = 2;
                nextTurn(roomCode);
                break;
                
            case CARD_TYPES.SHUFFLE:
                player.hand.splice(cardIndex, 1);
                room.discardPile.push(card);
                shuffleDeck(room.deck);
                io.to(roomCode).emit('deck-shuffled');
                break;
                
            case CARD_TYPES.SEE_FUTURE:
                player.hand.splice(cardIndex, 1);
                room.discardPile.push(card);
                const topCards = room.deck.slice(-3).reverse();
                socket.emit('see-future', topCards);
                break;
                
            case CARD_TYPES.NOPE:
                // Nope is handled separately as a reaction
                break;
        }
        
        broadcastGameState(roomCode);
    });
    
    // Play combo cards (2 or 3 matching cards)
    socket.on('play-combo', ({ roomCode, cardIds, targetPlayerId, requestedCard }) => {
        const room = rooms.get(roomCode);
        if (!room || !room.gameStarted) return;
        
        const player = room.players.get(socket.id);
        const cards = cardIds.map(id => player.hand.find(c => c.id === id)).filter(c => c);
        
        if (cards.length !== cardIds.length) return;
        
        // Check if all cards are the same type
        const cardType = cards[0].type;
        if (!cards.every(c => c.type === cardType)) return;
        
        if (cards.length === 2) {
            // Steal random card from target player
            const targetPlayer = room.players.get(targetPlayerId);
            if (!targetPlayer || targetPlayer.hand.length === 0) return;
            
            const randomIndex = Math.floor(Math.random() * targetPlayer.hand.length);
            const stolenCard = targetPlayer.hand.splice(randomIndex, 1)[0];
            player.hand.push(stolenCard);
            
            // Remove played cards
            cardIds.forEach(id => {
                const idx = player.hand.findIndex(c => c.id === id);
                if (idx !== -1) {
                    room.discardPile.push(player.hand.splice(idx, 1)[0]);
                }
            });
            
            io.to(targetPlayerId).emit('card-stolen', { byPlayer: player.name });
            socket.emit('card-received', stolenCard);
            
        } else if (cards.length === 3) {
            // Ask for specific card from target player
            const targetPlayer = room.players.get(targetPlayerId);
            if (!targetPlayer) return;
            
            const requestedCardIndex = targetPlayer.hand.findIndex(c => c.type === requestedCard);
            
            if (requestedCardIndex !== -1) {
                const receivedCard = targetPlayer.hand.splice(requestedCardIndex, 1)[0];
                player.hand.push(receivedCard);
                
                // Remove played cards
                cardIds.forEach(id => {
                    const idx = player.hand.findIndex(c => c.id === id);
                    if (idx !== -1) {
                        room.discardPile.push(player.hand.splice(idx, 1)[0]);
                    }
                });
                
                io.to(targetPlayerId).emit('card-requested', { byPlayer: player.name, cardType: requestedCard });
                socket.emit('card-received', receivedCard);
            } else {
                socket.emit('error', 'Target player does not have that card');
            }
        }
        
        broadcastGameState(roomCode);
    });
    
    // Disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Remove player from all rooms
        rooms.forEach((room, roomCode) => {
            if (room.players.has(socket.id)) {
                room.players.delete(socket.id);
                
                if (room.players.size === 0) {
                    rooms.delete(roomCode);
                    console.log(`Room ${roomCode} deleted`);
                } else {
                    // Update player list
                    const playerList = Array.from(room.players.values()).map(p => ({
                        id: p.id,
                        name: p.name,
                        isHost: p.isHost
                    }));
                    io.to(roomCode).emit('player-list-update', playerList);
                    
                    // If game is in progress, check for winner
                    if (room.gameStarted) {
                        checkWinner(roomCode);
                    }
                }
            }
        });
    });
});

function nextTurn(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    const playerIds = Array.from(room.players.keys()).filter(id => room.players.get(id).alive);
    
    if (playerIds.length <= 1) {
        checkWinner(roomCode);
        return;
    }
    
    room.turnCount--;
    
    if (room.turnCount <= 0) {
        room.turnCount = 1;
        do {
            room.currentPlayerIndex = (room.currentPlayerIndex + 1) % playerIds.length;
        } while (!room.players.get(playerIds[room.currentPlayerIndex]).alive);
    }
    
    io.to(roomCode).emit('turn-changed', {
        currentPlayerId: playerIds[room.currentPlayerIndex],
        currentPlayerName: room.players.get(playerIds[room.currentPlayerIndex]).name
    });
}

function checkWinner(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    const alivePlayers = Array.from(room.players.values()).filter(p => p.alive);
    
    if (alivePlayers.length === 1) {
        io.to(roomCode).emit('game-over', {
            winner: alivePlayers[0].name,
            winnerId: alivePlayers[0].id
        });
    } else if (alivePlayers.length === 0) {
        io.to(roomCode).emit('game-over', {
            winner: 'Nobody',
            winnerId: null
        });
    }
}

function broadcastGameState(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    const playerIds = Array.from(room.players.keys());
    
    // Send personalized game state to each player
    playerIds.forEach(playerId => {
        const player = room.players.get(playerId);
        
        const gameState = {
            myHand: player.hand,
            deckCount: room.deck.length,
            discardPile: room.discardPile,
            players: Array.from(room.players.values()).map(p => ({
                id: p.id,
                name: p.name,
                cardCount: p.hand.length,
                alive: p.alive,
                isHost: p.isHost
            })),
            currentPlayerIndex: room.currentPlayerIndex,
            currentPlayerId: playerIds[room.currentPlayerIndex],
            turnCount: room.turnCount
        };
        
        io.to(playerId).emit('game-state-update', gameState);
    });
}

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
