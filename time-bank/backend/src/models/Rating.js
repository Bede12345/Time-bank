const { query } = require('../config/database');

class Rating {
    static async create(ratingData) {
        const { transaction_id, rater_id, rated_user_id, rating, comment } = ratingData;

        