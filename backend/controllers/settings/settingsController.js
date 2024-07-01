const User = require('../../models/User');
const Professional = require('../../models/Professional');
const bcrypt = require('bcrypt');

const findEntity = async (id) => {
    console.log('SETTINGS CONTROLLER CALLED');
    console.log('SEARCHING DATABASE WITH USERID: ' + id);
    try {
        let entity = await User.findById(id).select('-password -token +firstName +lastName');
        let entityType = 'User';
        if (!entity) {
            entity = await Professional.findById(id).select('-password -token +firstName +lastName');
            entityType = 'Professional';
        }
        if (!entity) {
            console.log('USER NOT FOUND!');
            return { status: 404, json: { message: 'Entity not found' } };
        }
        console.log('USER FOUND!');
        return { status: 200, json: { data: entity, type: entityType } };
    } catch (error) {
        console.log('USER NOT FOUND!');
        return { status: 500, json: { message: 'Internal server error' } };
    }
};

const updateUser = async (id, updateData) => {
    console.log('UPDATING USER')
    try {
        const user = await User.findById(id);
        if (!user) {
            return { status: 404, json: { message: 'User not found' } };
        }

        user.firstName = updateData.firstName || user.firstName;
        user.lastName = updateData.lastName || user.lastName;
        if (updateData.password) {
            user.password = await bcrypt.hash(updateData.password, 12);
        }
        user.height = updateData.height || user.height;
        user.weight = updateData.weight || user.weight;

        await user.save();
        return { status: 200, json: { data: user.toObject() } };
    } catch (error) {
        return { status: 500, json: { message: 'Internal server error' } };
    }
};

const updateProfessional = async (id, updateData) => {
    console.log('UPDATING PROFESSIONAL')
    try {
        const professional = await Professional.findById(id);
        if (!professional) {
            return { status: 404, json: { message: 'Professional not found' } };
        }

        professional.firstName = updateData.firstName || professional.firstName;
        professional.lastName = updateData.lastName || professional.lastName;
        if (updateData.password) {
            professional.password = await bcrypt.hash(updateData.password, 12);
        }
        professional.specialization = updateData.specialization || professional.specialization;

        await professional.save();
        return { status: 200, json: { data: professional.toObject() } };
    } catch (error) {
        return { status: 500, json: { message: 'Internal server error' } };
    }
};



module.exports = {
    findEntity,
    updateUser,
    updateProfessional
};