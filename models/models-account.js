const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/my_databas?retryWrites=true&loadBalanced=false&connectTimeoutMS=10000', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  username: String,
  password: String
}, {
    collection: 'account'
})
const AccountModel = mongoose.model('account', AccountSchema)

module.exports = AccountModel

