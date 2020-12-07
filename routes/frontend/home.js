const express = require('express');
const router = express.Router();
const Account = require('../../model/account');


router.post('/', async (req, res) => {
    let val = req.body.sm;
    let username = req.body.username;
    let password = req.body.password;
    if (username == "" || password == "") {
        res.render('login', {isShow: true, alertMessage: 'Tài khoản hoặc mật khẩu không được để trống'});
    }else if (username != "admin" || password != "admin"){
        res.render('login', {isShow: true, alertMessage: 'Sai tài khoản hoặc mật khẩu'});
    }
    else if (username === "admin" && password === "admin"){
        let accountList = await Account.find({}).lean();
        res.render('homev2',{accountList: accountList});
    }
});

module.exports = router;
