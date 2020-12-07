const express = require('express');
const router = express.Router();
const Account = require('../../model/account');
const News = require('../../model/news');

router.get('/',async (req, res) => {
    let listStatisticalNew = [];
    let news= [];
    let accountList = await Account.find({}).lean();
    for(let i=0;i<accountList.length;i++){
      news=  await News.find({idOwner:accountList[i]._id, isLocked :true});
        if (news.length != 0){
           for(let j = 0 ; j<news.length;j++){
               listStatisticalNew.push({
                   fullName: accountList[i].fullName,
                   accountLock: accountList[i].isLocked === true ? "Đã khóa": "Đang sử dụng",
                   _id : accountList[i]._id,
                   idReporters: news[j].idReporters,
                   isLocked: news[j].isLocked === true ? "Đã thu hồi": "Chưa thu hồi",
               })
           }

     }
    }
    res.render('statisticalNews',{listStatisticalNew: listStatisticalNew});
});

router.post('/isLocked/:id', async (req, res) => {
    let account= await Account.findById(req.params.id).lean();
    if (!account.isLocked){
        Account.findByIdAndUpdate(req.params.id,{isLocked: 1}, (err, rl)=>{
            if(err){
            }else {
                res.redirect('/statisticalNew');
            }
        });
    }else{
        res.redirect('/statisticalNew');
    }
});

module.exports = router;