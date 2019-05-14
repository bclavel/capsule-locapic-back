var mongoose = require('mongoose');

// Création du schéma de données city
var userSchema = mongoose.Schema({
  firstName: String,
  lastName : String,
  email : String,
  userId : String,
});

// Export pour utilisation dans les routes (collection + schéma)
module.exports = mongoose.model('users', userSchema);
