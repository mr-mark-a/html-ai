// Messages App - SMS and Chat Management
class MessagesApp {
    constructor() {
        this.conversations = this.loadConversations();
        this.currentConversation = null;
        this.draftMessage = '';
    }

    // Create new conversation
    createConversation(phoneNumber, name = '') {
        const conversation = {
            id: Date.now(),
            phoneNumber: phoneNumber,
            name: name || phoneNumber,
            messages: [],
            lastMessage: null,
            timestamp: new Date(),
            unread: 0
        };
        this.conversations.unshift(conversation);
        this.saveConversations();
        return conversation;
    }

    // Get or create conversation
    getConversation(phoneNumber) {
        let convo = this.conversations.find(c => c.phoneNumber === phoneNumber);
        if (!convo) {
            convo = this.createConversation(phoneNumber);
        }
        this.currentConversation = convo.id;
        return convo;
    }

    // Send message
    sendMessage(phoneNumber, text) {
        const convo = this.getConversation(phoneNumber);
        const message = {
            id: Date.now(),
            text: text,
            sender: 'me',
            timestamp: new Date(),
            read: true
        };
        convo.messages.push(message);
        convo.lastMessage = text;
        convo.timestamp = new Date();
        this.saveConversations();
        return message;
    }

    // Receive message (simulated)
    receiveMessage(phoneNumber, text, senderName = '') {
        const convo = this.getConversation(phoneNumber);
        if (senderName) convo.name = senderName;

        const message = {
            id: Date.now(),
            text: text,
            sender: phoneNumber,
            timestamp: new Date(),
            read: false
        };
        convo.messages.push(message);
        convo.lastMessage = text;
        convo.unread++;
        this.saveConversations();
        return message;
    }

    // Get all conversations
    getConversations() {
        return this.conversations;
    }

    // Get messages in conversation
    getMessages(conversationId) {
        const convo = this.conversations.find(c => c.id === conversationId);
        return convo ? convo.messages : [];
    }

    // Mark as read
    markAsRead(conversationId) {
        const convo = this.conversations.find(c => c.id === conversationId);
        if (convo) {
            convo.unread = 0;
            convo.messages.forEach(msg => msg.read = true);
            this.saveConversations();
        }
    }

    // Delete conversation
    deleteConversation(conversationId) {
        this.conversations = this.conversations.filter(c => c.id !== conversationId);
        this.saveConversations();
    }

    // Delete message
    deleteMessage(conversationId, messageId) {
        const convo = this.conversations.find(c => c.id === conversationId);
        if (convo) {
            convo.messages = convo.messages.filter(m => m.id !== messageId);
            this.saveConversations();
        }
    }

    // Save conversations to localStorage
    saveConversations() {
        localStorage.setItem('messagesAppConversations', JSON.stringify(this.conversations));
    }

    // Load conversations from localStorage
    loadConversations() {
        const saved = localStorage.getItem('messagesAppConversations');
        return saved ? JSON.parse(saved) : [];
    }

    // Search conversations
    searchConversations(query) {
        return this.conversations.filter(c => 
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.phoneNumber.includes(query)
        );
    }

    // Get unread count
    getUnreadCount() {
        return this.conversations.reduce((sum, c) => sum + c.unread, 0);
    }

    // Get app info
    getAppInfo() {
        return {
            name: 'Messages',
            version: '1.0.0',
            icon: '💬',
            id: 'messages'
        };
    }
}

// Export for use
const messagesApp = new MessagesApp();
