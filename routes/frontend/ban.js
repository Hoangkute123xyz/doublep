const express = require('express');
const router = express.Router();
const Account = require('../../model/account');
const News = require('../../model/news');
const Comment = require('../../model/comment');
const Notification = require('../../model/notification');
const BASE_URL = require('../../ultil/SocketConstant').BASE_URL;


router.get('/' ,async (req, res) => {

    News.find( {"idReporters.0" : { "$exists": true }} ,async (err,data)=>{
        if (err){
            res.status(400).send({message: err.message,data:{}});
        }else {
            let listNews = [];
            let pagination = [];
            let listImage = []
            let number = data.length / 20;
            for (let i=1; i < number+1;i++){
                pagination.push(i);
            }
            if (data.length!=null&&data.length!=undefined&&data.length!=0){
                for (let i = 0; i < data.length; i++){
                    let account= await Account.findById(data[i].idOwner);
                    listImage.push({
                        images:BASE_URL+data[i].images
                    })
                    listNews.push({
                        _id: data[i]._id,
                        // images: BASE_URL+data[i].images,
                        favoritePersons: data[i].favoritePersons,
                        idComments: data[i].idComments,
                        idReporters: data[i].idReporters,
                        idOwner: data[i].idOwner,
                        timeCreated: data[i].timeCreated,
                        imageList:listImage.length,
                        listImage:listImage,
                        content: data[i].content,
                        isLocked: data[i].isLocked === true ? "Đã thu hồi": "Chưa thu hồi",
                        account: {
                            _id: account._id,
                            avatar: account.avatar,
                            fullName: account.fullName,
                        }
                    });

                }
            }
            res.render('banNew',{listNews: listNews, pagination: pagination,listImage : listImage});
        }}).sort({ $natural: -1 })
});

router.post('/isLocked/:id', async (req, res) => {
    let news= await News.findById(req.params.id).lean();
    if (!news.isLocked){  News.findByIdAndUpdate(req.params.id,{isLocked: 1}, (err, rl)=>{
        if(err){
        }else {
            const notifications = new Notification({
                content: "Bài viết của bạn đã vi phạm điều khoản!",
                typeNotification: 0,
                timeCreated: new Date().getTime(),
                isRead: false,
                idDetail: news._id,
                nameUserLastModify: "",
                avatar: "file_config/LogoNoTextDefault.png",
                idOwner:news.idOwner
            });
            notifications.save((err, result)=>{
                if (err){
                }
                if (result){
                }
            })
            res.redirect('/ban');
        }

    });
    }else {
        res.redirect('/ban');
    }


});

module.exports = router;