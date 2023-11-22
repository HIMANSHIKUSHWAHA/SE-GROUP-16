class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let current = this.root;
        for (const char of word) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }
        current.isEndOfWord = true;
    }

    search(word) {
        let current = this.root;
        for (const char of word) {
            if (!current.children[char]) {
                return false;
            }
            current = current.children[char];
        }
        return current.isEndOfWord;
    }

    startsWith(prefix) {
        let current = this.root;
        for (const char of prefix) {
            if (!current.children[char]) {
                return false;
            }
            current = current.children[char];
        }
        return true;
    }

    //helper function to collect all words in the trie
    collectAllWords(node = this.root, prefix = "", words = []) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        for (const char in node.children) {
            this.collectAllWords(node.children[char], prefix + char, words);
        }
        return words;
    }

    //function to get suggestions based on prefix
    autocomplete(prefix) {
        let current = this.root;
        for (const char of prefix) {
            if (!current.children[char]) {
                return [];
            }
            current = current.children[char];
        }
        return this.collectAllWords(current, prefix);
    }
}

//function to populate trie with titles from database
async function buildTrieFromVideos(AsyncVideo) {
    const trie = new Trie();
    try {
        const videos = await AsyncVideo.find({});
        for (const video of videos) {
            if (video.title) {
                trie.insert(video.title.toLowerCase());
            }
        }
    } catch (error) {
        console.error("Error populating trie from database:", error);
    }
    return trie;
}


async function buildTrieFromProfessionals(Professional) {
    const trie = new Trie();
    try {
        const professionals = await Professional.find({});
        for (const professional of professionals) {
            // Insert first name, last name, and specialization into the trie
            const firstName = professional.firstName.toLowerCase();
            const lastName = professional.lastName.toLowerCase();
            const specialization = professional.specialization.toLowerCase();

            trie.insert(firstName);
            trie.insert(lastName);
            trie.insert(specialization);
        }
    } catch (error) {
        console.error("Error populating trie from professionals database:", error);
    }
    return trie;
}


//exporting the necessary functions
module.exports = {
    Trie,
    buildTrieFromVideos,
    buildTrieFromProfessionals
};