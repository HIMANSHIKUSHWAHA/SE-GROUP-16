const User = require('../models/User');
const Professional = require('../models/Professional');

// Subscribe to a User
const subscribe = async (subscriberId, subscribeToUserId) => {
    console.log('subscribe CONTROLLER CALLED',subscriberId, subscribeToUserId);
    let user = null;
    try {
        //find the subscriber in Uesr or Professional model
        if (User.findById(subscriberId)) {
            user = await User.findById(subscriberId);
        } else if (Professional.findById(subscriberId)) {
            user = await Professional.findById(subscriberId);
        } else {
            console.log('user NOT FOUND');
            return { status: 404, json: { message: 'User not found' } };
        }
        // Check if already subscribed
        
        if (user.Subscribing.includes(subscribeToUserId)) {
            console.log('ALREADY SUBSCRIBED');
            return { status: 400, json: { message: 'Already subscribed to user.' }};
        }

        // Add to subscriber's Subscribing list
        user.Subscribing.push(subscribeToUserId);
        await user.save();

        // Add to the subscribed user's Subscribers list
        const subscribedUser = await Professional.findById(subscribeToUserId);
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
viewSubscribing = async (id) => {
    console.log('viewSubscribedUsers CONTROLLER CALLED');
    console.log('ID', id);
    try {
        const user =  User.findById(id);
        console.log('SUBSCRIBED USERS', user.Subscribing);
        return { status: 200, json: { subscribedUsers: user.Subscribing } };

    } catch (error) {
        return { status: 500, json: { message: 'Error fetching subscribed users.', error } };
    }
};

banUser = async (id) => {
    console.log('banUser CONTROLLER CALLED');
    try {
        const user = await User.findById(id);
        // delete user
        await user.delete();
        return { status: 200, json: { message: 'User banned successfully.' } };
    } catch (error) {
        return { status: 500, json: { message: 'Error banning user.', error } };
    }
};

module.exports = {
    subscribe,
    unsubscribe,
    viewSubscribers,
    viewSubscribing,
    banUser
};
