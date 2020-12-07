const SocketConstant = {
    RECEIVE:"SEND",
    SEND:"RECEIVE",
    NEW_GROUP:"NEW_GROUP",
    LOGIN:"LOGIN",
    JOIN_GROUP :"JOIN_GROUP",
    FCM_SERVER_KEY:"AAAAfstHgi4:APA91bEJ9BLB4rcMxXpMe4zcSzNa9XlhYX11oqK5jGbjoR1FurmliDejCNko7X51Xw6B5gLzxMKthrQzmHYi4R2P8zdeuHfXjVdVonk7OFmHsUPY-mHZq_7Bx2hnKJcc8DwMHBBKCl-N",
    RECEIVE_INVITE:"RECEIVE_INVITE",
    BASE_URL:(process.env.BASE_URL || "https://double-p-new.herokuapp.com") +"/"

}

module.exports = SocketConstant