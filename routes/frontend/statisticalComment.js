const express = require('express');
const router = express.Router();
const Account = require('../../model/account');
const Comment = require('../../model/comment');

router.get('/',async (req, res) => {
    let listStatisticalComment = [];
    let comments= [];
    let accountList = await Account.find({}).lean();
    for(let i=0;i<accountList.length;i++){
        comments=  await Comment.find({idOwner:accountList[i]._id, isLocked :true});
        if (comments.length != 0){
            for(let j = 0 ; j<comments.length;j++){
                listStatisticalComment.push({
                    fullName: accountList[i].fullName,
                     accountLock: accountList[i].isLocked === true ? "Đã khóa": "Đang sử dụng",
                    _id : accountList[i]._id,
                    idReporters: comments[j].idReporters,
                    isLocked: comments[j].isLocked === true ? "Đã thu hồi": "Chưa thu hồi",
                })
            }

        }
    }
    res.render('statisticalComment',{listStatisticalComment: listStatisticalComment});
});

router.post('/isLocked/:id', async (req, res) => {
    let account= await Account.findById(req.params.id).lean();
    if (!account.isLocked){
        Account.findByIdAndUpdate(req.params.id,{isLocked: 1}, (err, rl)=>{
            if(err){
            }else {
                res.redirect('/statisticalComment');
            }
        });
    }else{
        res.redirect('/statisticalComment');
    }
});

module.exports = router;