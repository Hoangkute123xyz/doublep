const mongoose = require('mongoose');
const breedSchema =new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    idType:{
        type: String,
        required: true,
    },
})
const Breed = mongoose.model("breed",breedSchema,"breed");

module.exports=Breed;