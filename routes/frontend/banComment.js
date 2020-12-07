const express = require('express');
const router = express.Router();
const Account = require('../../model/account');
const Comment = require('../../model/comment');
const Notification = require('../../model/notification');

router.get('/', async (req, res) => {
    Comment.find({"idReporters.0": {"$exists": true}}, async (err, data) => {
        if (err) {
            res.status(400).send({message: err.message, data: {}});
        } else {
            let listComment = [];
            let pagination = [];
            let number = data.length / 20;
            for (let i=1; i < number+1;i++){
                pagination.push(i);
            }
            if (data.length != null && data.length != undefined && data.length != 0) {
                for (let i = 0; i < data.length; i++) {
                    let account = await Account.findById(data[i].idOwner);
                    listComment.push({
                        _id: data[i]._id,
                        idReporters: data[i].idReporters,
                        idOwner: data[i].idOwner,
                        timeCreated: data[i].timeCreated,
                        content: data[i].content,
                        isLocked: data[i].isLocked === true ? "Đã thu hồi" : "Chưa thu hồi",
                        account: {
                            _id: account._id,
                            avatar: account.avatar,
                            fullName: account.fullName,
                        }
                    });
                }
            }
            res.render('banComment', {listComment: listComment, pagination: pagination});
        }
    }).sort({$natural: -1})
});

router.post('/isLocked/:id', async (req, res) => {
    let comment = await Comment.findById(req.params.id).lean();

    if (!comment.isLocked) {
        Comment.findByIdAndUpdate(req.params.id, {isLocked: 1}, (err, rl) => {
            if (err) {
            } else {
                const notifications = new Notification({
                    content: "Bình luận của bạn đã vi phạm điều khoản!",
                    typeNotification: 1,
                    timeCreated: new Date().getTime(),
                    isRead: false,
                    idDetail: comment._id,
                    nameUserLastModify: "",
                    avatar: "file_config/LogoNoTextDefault.png",
                    idOwner:comment.idOwner
                });
                notifications.save((err, result) => {
                    if (err) {
                    }
                    if (result) {
                    }
                })
            }

            res.redirect('/banComment');
        });
    }else {
        res.redirect('/banComment');
    }

});
module.exports = router;