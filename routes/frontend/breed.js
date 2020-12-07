const express = require('express');
const router = express.Router();
const Breed = require('../../model/breed');
const TypePet = require('../../model/typepet');






router.get('/',async (req, res) => {
    let breedList = await Breed.find({}).lean();
    let typeList = await TypePet.find({}).lean();
    res.render('breed',{breedList : breedList,typeList : typeList});
});


router.post('/createBreed', async (req, res) => {
    const breed = new Breed({
        name: req.body.nameBreedCreate,
        idType: req.body.idType
    });

    breed.save((err, result) => {
        if (err) {
            res.redirect('/breed');
        } else {
            TypePet.update({_id: result.idType},{$push:{idBreeds: result._id.toString()}}, function (err, kq){
                res.redirect('/breed');
            });
        }
    })
});

router.post('/deleteBreed', async (req, res) => {
    let id= req.body.idBreedDelete;
    if (id !== null && id !== "" && id !== undefined){
        TypePet.findOne({idBreeds: id}, function (err, typePet){
            if (err){
                res.redirect('/breed');
            } else if (typePet){
                var idx = typePet.idBreeds ? typePet.idBreeds.indexOf(id) : -1;
                if (idx != -1){
                    typePet.idBreeds.splice(idx, 1);
                    typePet.save(function (err){
                        if (err){

                        }else {
                            Breed.findByIdAndDelete({_id: id}, function (err, result) {
                                if (err) {
                                    res.redirect('/breed');
                                } else {
                                    let breedList =  Breed.find({}).lean();
                                    res.render('breed',{breedList : breedList});
                                }
                            });
                        }
                    })
                }
            }
            res.redirect('/breed');
        });
    }else {
        res.redirect('/breed');
    }
});

router.post('/updateBreed', async (req, res) => {

    Breed.findByIdAndUpdate(id, {name: name}, function (err, result) {
        if (err) {
            res.redirect('/breed');
        } else {
            res.redirect('/breed');
        }
    })
});

module.exports = router;
