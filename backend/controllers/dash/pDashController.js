const Tag = require('../../models/Tags');
const AppError = require('../../utils/AppError');

const allTags = async (req, res, next) => {

    try {

        const tags = await Tag.find();
        res.status(200).json({
            data: tags
        });
        
    } catch(error) {
        return next(new AppError(error.message, error.statusCode || 500));
    }
};

module.exports = { allTags }