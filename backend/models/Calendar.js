const mongoose = require('mongoose');

// Define the schema for sleep details with default values
const SleepSchema = new mongoose.Schema({
    startTime: { type: String, default: "11:00 PM" },
    endTime: { type: String, default: "7:00 AM" },
    totalHours: { type: Number, default: 8 }
});

// Define the schema for meal details with default values
const MealSchema = new mongoose.Schema({
    mealType: { type: String, default: "All Day" },
    calories: { type: Number, default: 2000 },
    macronutrients: {
        protein: { type: Number, default: 70 },
        carbs: { type: Number, default: 100 },
        fats: { type: Number, default: 70 }
    },
    suggestedFoods: { type: [String], default: ["Eggs", "Oatmeal", "Orange Juice"] }
});

// Define the schema for workout details with default values
const WorkoutSchema = new mongoose.Schema({
    exercise: { type: String, default: "Mix" },
    duration: { type: String, default: "60 minutes" },
    repetitions: { type: String, default: "1 repition" }
});

const DaySchema = new mongoose.Schema({
    day: String, // e.g., "Monday", "Tuesday", ...
    sleep: SleepSchema,
    meals: [MealSchema], // Array as there might be multiple meals in a day
    workouts: [WorkoutSchema] // Array as there might be multiple workouts in a day
});

// Define the schema for the calendar, linked to a user
const CalendarSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    data: [DaySchema] // An array containing each day’s data
});


const createDefaultCalendar = (userId) => {

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Initialize with default values
    const defaultCalendar = new Calendar({
        userId: userId,
        data: daysOfWeek.map(day => ({ // Assuming daysOfWeek is an array of days names
            day: day,
            sleep: {
                startTime: "10:00 PM",
                endTime: "6:00 AM",
                totalHours: 8
            },
            meals: [{
                mealType: "Full day meals",
                calories: 2000,
                macronutrients: {
                    protein: 70,
                    carbs: 100,
                    fats: 60
                },
                suggestedFoods: ["Eggs", "Toast", "Orange Juice"]
            }],
            workouts: [{
                exercise: "Mix Workout",
                duration: "60 minutes",
                repetitions: "1 round"
            }]
        }))
    });

    // Save the default calendar to the database
    defaultCalendar.save()
        .then(() => {
            console.log('Default calendar created successfully.');
        })
        .catch((err) => {
            console.error('Error creating default calendar:', err);
        });
};


const Calendar = mongoose.model('Calendar', CalendarSchema);

module.exports = {
    Calendar,
    createDefaultCalendar
};


