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
        console.log(`Total videos found: ${videos.length}`); // Log the total number of videos

        for (const video of videos) {
            console.log(`Processing video: ${video.title}`); // Log the title of each video

            if (video.title) {
                console.log(`Inserting title: ${video.title.toLowerCase()}`); // Log the title insertion
                trie.insert(video.title.toLowerCase());
            }

            // Check if both firstName and lastName exist before insertion
            if (video.creator && video.creator.firstName && video.creator.lastName) {
                console.log(`Inserting creator name: ${video.creator.firstName.toLowerCase()}, ${video.creator.lastName.toLowerCase()}`); // Log the creator's name insertion
                trie.insert(video.creator.firstName.toLowerCase());
                trie.insert(video.creator.lastName.toLowerCase());
            } else {
                console.log(`Missing creator information for video: ${video.title}`); // Log missing creator info
            }

            if (video.tags && Array.isArray(video.tags)) {
                console.log(`Inserting tags for video: ${video.title}`); // Log tag processing
                video.tags.forEach(tag => {
                    if (tag) { // Check if tag is not undefined or null
                        console.log(`Inserting tag: ${tag.toLowerCase()}`); // Log each tag insertion
                        trie.insert(tag.toLowerCase());
                    }
                });
            }

            // Check if description exists before insertion
            if (video.description) {
                console.log(`Inserting description: ${video.description.toLowerCase()}`); // Log the description insertion
                trie.insert(video.description.toLowerCase());
            } else {
                console.log(`Missing description for video: ${video.title}`); // Log missing description
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
            if (mealPlan.tags && Array.isArray(MealPlan.tags)) {
                console.log(`Inserting tags for MealPlan: ${MealPlan.title}`); // Log tag processing
                mealPlan.tags.forEach(tag => {
                    if (tag) { // Check if tag is not undefined or null
                        console.log(`Inserting tag: ${tag.toLowerCase()}`); // Log each tag insertion
                        trie.insert(tag.toLowerCase());
                    }
                });
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
        console.log(`Total exercise plans found: ${exercisePlans.length}`); // Consistent logging

        for (const exercisePlan of exercisePlans) {
            console.log(`Processing exercise plan: ${exercisePlan.title}`); // Log the title of each exercise plan

            // Insert title, description, and cost into the trie
            if (exercisePlan.title) {
                console.log(`Inserting title: ${exercisePlan.title.toLowerCase()}`); // Log the title insertion
                trie.insert(exercisePlan.title.toLowerCase());
            }

            if (exercisePlan.description) {
                console.log(`Inserting description: ${exercisePlan.description.toLowerCase()}`); // Log the description insertion
                trie.insert(exercisePlan.description.toLowerCase());
            }

            if (exercisePlan.cost) {
                console.log(`Inserting cost: ${exercisePlan.cost.toString().toLowerCase()}`); // Log the cost insertion
                trie.insert(exercisePlan.cost.toString().toLowerCase());
            }

            // Check if both firstName and lastName exist before insertion
            if (exercisePlan.creator && exercisePlan.creator.firstName && exercisePlan.creator.lastName) {
                console.log(`Inserting creator name: ${exercisePlan.creator.firstName.toLowerCase()}, ${exercisePlan.creator.lastName.toLowerCase()}`); // Log the creator's name insertion
                trie.insert(exercisePlan.creator.firstName.toLowerCase());
                trie.insert(exercisePlan.creator.lastName.toLowerCase());
            } else {
                console.log(`Missing creator information for exercise plan: ${exercisePlan.title}`); // Log missing creator info
            }

            if (exercisePlan.tags && Array.isArray(exercisePlan.tags)) {
                console.log(`Inserting tags for exercise plan: ${exercisePlan.title}`); // Log tag processing
                exercisePlan.tags.forEach(tag => {
                    if (tag) { // Check if tag is not undefined or null
                        console.log(`Inserting tag: ${tag.toLowerCase()}`); // Log each tag insertion
                        trie.insert(tag.toLowerCase());
                    }
                });
            }
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