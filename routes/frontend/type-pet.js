const express = require('express');
const router = express.Router();
const TypePet = require('../../model/typepet');
const Breed = require('../../model/breed');


router.get('/', async (req, res) => {
    let typeList = await TypePet.find({}).lean();
    res.render('typepet', {typeList: typeList});
});

router.post('/createType', async (req, res) => {
    try {

        let nameType = req.body.nameType;
        await new TypePet({
            name: nameType
        }).save();
        let typeList = await TypePet.find({}).lean();
        res.render('typepet', {isShow: true, alertMessage: "Thành công!!", typeList: typeList});
    } catch (e) {
        res.render('typepet', {isShow: true, alertMessage: e.message});
    }

});

router.post('/deleteType', async (req, res) => {
    let id = req.body.id;

    TypePet.findById(id, function (err, result){
        if (err){

        }else {
            for (let i =0; i< result.idBreeds.length;i++){
                Breed.findByIdAndDelete(result.idBreeds[i], function (err1,result1){
                    if(err1){
                    }
                })
            }
            TypePet.findByIdAndDelete(id, function (aa,asd){
                if (aa){

                }else {
                    let typeList = TypePet.find({}).lean();
                    res.redirect('/typePet')
                }
            });

        }
    });


});

router.post('/update', async (req, res) => {
    let id = req.body.ids;
    let name = req.body.nameTypeUpdate
    TypePet.findByIdAndUpdate(id,  {name:name}, function (err, result) {


        if (err) {
            res.redirect('/typePet');
        } else {
            res.redirect('/typePet');
        }
    })
});

module.exports = router;
