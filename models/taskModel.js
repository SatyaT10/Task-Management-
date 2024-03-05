const monoose = require('mongoose');

const taskSchema = monoose.Schema({
    category_id: {
        type: monoose.Schema.Types.ObjectId,
    },
    user_id: {
        type: monoose.Schema.Types.ObjectId
    },
    task: {
        type: String
    },
    due_date: {
        type: String,
    }
});

module.exports = monoose.model("Task", taskSchema);