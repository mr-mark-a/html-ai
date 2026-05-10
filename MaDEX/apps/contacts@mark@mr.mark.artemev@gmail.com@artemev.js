// Contacts App - Contact Management
class ContactsApp {
    constructor() {
        this.contacts = this.loadContacts();
        this.favorites = this.loadFavorites();
    }

    // Add new contact
    addContact(firstName, lastName = '', phone = '', email = '') {
        const contact = {
            id: Date.now(),
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            notes: '',
            avatar: this.getInitials(firstName + ' ' + lastName),
            created: new Date(),
            favorite: false
        };
        this.contacts.push(contact);
        this.saveContacts();
        return contact;
    }

    // Get all contacts
    getAllContacts() {
        return this.contacts.sort((a, b) => 
            (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName)
        );
    }

    // Get contact by ID
    getContact(contactId) {
        return this.contacts.find(c => c.id === contactId);
    }

    // Search contacts
    searchContacts(query) {
        const q = query.toLowerCase();
        return this.contacts.filter(c =>
            c.firstName.toLowerCase().includes(q) ||
            c.lastName.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            c.email.toLowerCase().includes(q)
        );
    }

    // Update contact
    updateContact(contactId, updates) {
        const contact = this.getContact(contactId);
        if (contact) {
            Object.assign(contact, updates);
            this.saveContacts();
            return contact;
        }
        return null;
    }

    // Delete contact
    deleteContact(contactId) {
        this.contacts = this.contacts.filter(c => c.id !== contactId);
        this.saveContacts();
    }

    // Add to favorites
    addToFavorites(contactId) {
        const contact = this.getContact(contactId);
        if (contact) {
            contact.favorite = true;
            this.saveFavorites();
            this.saveContacts();
            return true;
        }
        return false;
    }

    // Remove from favorites
    removeFromFavorites(contactId) {
        const contact = this.getContact(contactId);
        if (contact) {
            contact.favorite = false;
            this.saveFavorites();
            this.saveContacts();
            return true;
        }
        return false;
    }

    // Get favorite contacts
    getFavorites() {
        return this.contacts.filter(c => c.favorite);
    }

    // Get initials for avatar
    getInitials(name) {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Save contacts to localStorage
    saveContacts() {
        localStorage.setItem('contactsAppContacts', JSON.stringify(this.contacts));
    }

    // Load contacts from localStorage
    loadContacts() {
        const saved = localStorage.getItem('contactsAppContacts');
        return saved ? JSON.parse(saved) : this.getDefaultContacts();
    }

    // Save favorites to localStorage
    saveFavorites() {
        localStorage.setItem('contactsAppFavorites', JSON.stringify(this.favorites));
    }

    // Load favorites from localStorage
    loadFavorites() {
        const saved = localStorage.getItem('contactsAppFavorites');
        return saved ? JSON.parse(saved) : [];
    }

    // Get default contacts for demo
    getDefaultContacts() {
        return [
            this.createDefaultContact('John', 'Doe', '+1-555-0101', 'john@example.com'),
            this.createDefaultContact('Jane', 'Smith', '+1-555-0102', 'jane@example.com'),
            this.createDefaultContact('Mike', 'Johnson', '+1-555-0103', 'mike@example.com')
        ];
    }

    // Helper to create default contact
    createDefaultContact(firstName, lastName, phone, email) {
        return {
            id: Date.now() + Math.random(),
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            notes: '',
            avatar: this.getInitials(firstName + ' ' + lastName),
            created: new Date(),
            favorite: false
        };
    }

    // Export contacts
    exportContacts() {
        return JSON.stringify(this.contacts, null, 2);
    }

    // Import contacts
    importContacts(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            if (Array.isArray(imported)) {
                this.contacts.push(...imported);
                this.saveContacts();
                return { success: true, count: imported.length };
            }
        } catch (e) {
            return { success: false, error: 'Invalid JSON format' };
        }
    }

    // Get app info
    getAppInfo() {
        return {
            name: 'Contacts',
            version: '1.0.0',
            icon: '👥',
            id: 'contacts'
        };
    }
}

// Export for use
const contactsApp = new ContactsApp();
