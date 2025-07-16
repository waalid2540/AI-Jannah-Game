// Noor AI - Islamic learning companion
export class NoorAI {
    constructor() {
        this.responses = {};
        this.isInitialized = false;
    }

    async init() {
        console.log('🤖 Initializing Noor AI...');
        this.loadResponses();
        this.isInitialized = true;
        return Promise.resolve();
    }

    loadResponses() {
        this.responses = {
            greetings: [
                'Assalamu Alaikum! How can I help you learn about Islam today?',
                'Peace be upon you! I\'m here to guide your spiritual journey.',
                'May Allah bless your learning journey! What would you like to know?'
            ],
            quran: [
                'The Quran is the final revelation from Allah. Which chapter would you like to learn about?',
                'SubhanAllah! The Quran contains guidance for all aspects of life.',
                'Would you like me to explain the meaning of a specific verse?'
            ],
            prayer: [
                'Prayer is the pillar of faith. It connects us directly to Allah.',
                'The five daily prayers are Fajr, Dhuhr, Asr, Maghrib, and Isha.',
                'Would you like help with prayer times or learning how to pray?'
            ],
            default: [
                'That\'s a great question! Let me help you understand this Islamic concept.',
                'May Allah reward your quest for knowledge.',
                'Islam teaches us to seek knowledge from the cradle to the grave.'
            ]
        };
    }

    async processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('salaam') || lowerMessage.includes('hello')) {
            return this.getRandomResponse('greetings');
        }
        
        if (lowerMessage.includes('quran') || lowerMessage.includes('verse')) {
            return this.getRandomResponse('quran');
        }
        
        if (lowerMessage.includes('prayer') || lowerMessage.includes('salah')) {
            return this.getRandomResponse('prayer');
        }
        
        return this.getRandomResponse('default');
    }

    getRandomResponse(category) {
        const responses = this.responses[category] || this.responses.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }
}