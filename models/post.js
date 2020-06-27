var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        createIndexes: true
    },
    content: {
        type: String
    },
    postImg: {
        type: String,
        required: true
    },
});
module.exports = mongoose.model('Post', postSchema);
