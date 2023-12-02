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
            if (video.creator) {
                trie.insert(video.creator.firstName.toLowerCase());
                trie.insert(video.creator.lastName.toLowerCase());
            }
            if (video.tags && Array.isArray(video.tags)) {
                video.tags.forEach(tag => trie.insert(tag.toLowerCase()));
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

async function buildTrieFromMealPlans(MealPlan) {
    const trie = new Trie();
    try {
        const mealPlans = await MealPlan.find({});
        for (const mealPlan of mealPlans) {
            const title = mealPlan.title ? mealPlan.title.toLowerCase() : '';
            trie.insert(title);

            if (mealPlan.calories) {
                const calories = mealPlan.calories.toString().toLowerCase();
                trie.insert(calories);
            }

            if (mealPlan.description) {
                const description = mealPlan.description.toString().toLowerCase();
                trie.insert(description);
            }

            if (mealPlan.creator) {
                trie.insert(mealPlan.creator.firstName.toLowerCase());
                trie.insert(mealPlan.creator.lastName.toLowerCase());
            }
        }
    } catch (error) {
        console.error("Error populating trie from meal plans database:", error);
    }
    return trie;
}
async function buildTrieFromExercisePlans(ExercisePlan) {
    const trie = new Trie();
    try {
        const exercisePlans = await ExercisePlan.find({});
        for (const exercisePlan of exercisePlans) {
            // Insert title, description, and cost into the trie
            const title = exercisePlan.title.toLowerCase();
            const description = exercisePlan.description.toLowerCase();
            const cost = exercisePlan.cost.toString().toLowerCase();
            if (exercisePlans.creator) {
                trie.insert(exercisePlan.creator.firstName.toLowerCase());
                trie.insert(exercisePlan.creator.lastName.toLowerCase());
            }
            trie.insert(title);
            trie.insert(description);
            trie.insert(cost);
        }
    } catch (error) {
        console.error("Error populating trie from exercise plans database:", error);
    }
    return trie;
}

async function buildTrieFromLiveSessions(LiveSession) {
    const trie = new Trie();
    try {
        const liveSessions = await LiveSession.find({});
        for (const session of liveSessions) {
            // Insert relevant fields into the trie (e.g., title, creator)
            if (session.title) {
                trie.insert(session.title.toLowerCase());
            }
            if (session.creator) {
                trie.insert(session.creator.firstName.toLowerCase());
                trie.insert(session.creator.lastName.toLowerCase());
            }
            if (session.tags && Array.isArray(session.tags)) {
                session.tags.forEach(tag => trie.insert(tag.toLowerCase()));
            }
            // Add more fields as needed
        }
    } catch (error) {
        console.error("Error populating trie from live sessions database:", error);
    }
    return trie;
}

//exporting the necessary functions
module.exports = {
    Trie,
    buildTrieFromVideos,
    buildTrieFromProfessionals,
    buildTrieFromExercisePlans,
    buildTrieFromMealPlans,
    buildTrieFromLiveSessions
};