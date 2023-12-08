const User = require('../models/User');
const Professional = require('../models/Professional');
// Subscribe to a User
const subscribe = async (subscriberId, subscribeToUserId) => {
    console.log('subscribe CONTROLLER CALLED',subscriberId, subscribeToUserId);
    try {
        // Check if already subscribed
        let user = await User.findById(subscriberId);
        if (!user) {
            user = await Professional.findById(subscriberId);
        }
        if (user.Subscribing.includes(subscribeToUserId)) {
            console.log('ALREADY SUBSCRIBED');
            return { status: 400, json: { message: 'Already subscribed to user.' }};
        }

        // Add to subscriber's Subscribing list
        user.Subscribing.push(subscribeToUserId);
        await user.save();

        // Add to the subscribed user's Subscribers list
        let subscribedUser = await User.findById(subscribeToUserId);
        if (!subscribedUser) {
            subscribedUser = await Professional.findById(subscribeToUserId);
        }
        subscribedUser.Subscribers.push(subscriberId);
        await subscribedUser.save();
        console.log('SUBSCRIBED SUCCESSFULLY');
        return { status: 200, json: { message: 'Subscribed successfully.' }};

    } catch (error) {
        console.log('ERROR SUBSCRIBING TO USER', error);
        return { status: 500, json: { message: 'Error subscribing to user.', error } };
    }
};

// Unsubscribe from a User
unsubscribe = async (subscriberId, unsubscribeFromUserId) => {
    console.log('unsubscribe CONTROLLER CALLED');
    try {
        // Remove from subscriber's Subscribing list
        const user = await User.findById(subscriberId);
        user.Subscribing = user.Subscribing.filter(id => !id.equals(unsubscribeFromUserId));
        await user.save();

        // Remove from the unsubscribed user's Subscribers list
        const unsubscribedUser = await User.findById(unsubscribeFromUserId);
        unsubscribedUser.Subscribers = unsubscribedUser.Subscribers.filter(id => !id.equals(subscriberId));
        await unsubscribedUser.save();

        res.status(200).json({ message: 'Unsubscribed successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Error unsubscribing from user.', error });
    }
};

// View Subscribers
viewSubscribers = async (id) => {
    console.log('viewSubscribers CONTROLLER CALLED');
    try {
        const user = await User.findById(id).populate('Subscribers', 'email'); // Only fetching email for simplicity
        return { status: 200, json: { subscribers: user.Subscribers } };
    } catch (error) {
        return { status: 500, json: { message: 'Error fetching subscribers.', error } };
    }
};

// View Subscribed Users
viewSubscribedUsers = async (id) => {
    console.log('viewSubscribedUsers CONTROLLER CALLED');
    try {
        const user = await User.findById(id).populate('Subscribing', 'email'); // Only fetching email for simplicity
        return { status: 200, json: { subscribedUsers: user.Subscribing } };

    } catch (error) {
        return { status: 500, json: { message: 'Error fetching subscribed users.', error } };
    }
};

module.exports = {
    subscribe,
    unsubscribe,
    viewSubscribers,
    viewSubscribedUsers
};
