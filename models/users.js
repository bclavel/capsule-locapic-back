var mongoose = require('mongoose');

var PositionSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number
})

var userSchema = mongoose.Schema({
  firstName: String,
  lastName : String,
  email : String,
  facebookid : String,
  historiquePosition : [PositionSchema]
});

// Export pour utilisation dans les routes (collection + schéma)
module.exports = mongoose.model('users', userSchema);
