const mongoose = require('mongoose');
const databaseConfig = require('./../configs/database');

var autoIncrement = require('mongoose-auto-increment');
var slug = require('mongoose-slug-generator');
var updateSlug = require('mongoose-slug-updater');

mongoose.plugin(slug);
mongoose.plugin(updateSlug);

const schema = new mongoose.Schema
(
    {
     name: String,
     status: String ,
     ordering:Number,
     slug: {type: String,  slug:  'name', unique:   true},
    },
    {
        timestamps: true,
    }
);

autoIncrement.initialize(mongoose.connection);
schema.plugin(autoIncrement.plugin, 'id');
var Counter = mongoose.model('id', schema);

module.exports = mongoose.model(databaseConfig.collection,schema);


