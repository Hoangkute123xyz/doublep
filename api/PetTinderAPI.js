const PetTinderDatabase = require('../database/PetTinderDatabase')
const UserDatabase = require('../database/UserDatabase')
const BreedDatabase = require('../database/BreedDatabase')
const GroupChatDatabase = require('../database/GroupChatDatabase')
const InviteDatabase = require('../database/InviteDatabase')
const PetTinderAPI = {
    create: (app, upload) => {
        app.get('/mobile/api/pet_tinder', async (req, res) => {
            const token = req.header("Authorization")
            const user = await UserDatabase.getUserById(token)
            if (user == null) {
                res.status(400).send({message: "Login Failed!!"})
            } else {
                const result = await PetTinderDatabase.getAllPet(token,req.query.page);
                if (result==null){
                    res.status(401).send({message:"you have no pet"})
                    return
                }
                const newData = []
                for (const i in result.data) {
                    const item = result.data[i]
                    const breed = await BreedDatabase.getBreedById(item.idBreed)
                    delete item.idBreed
                    delete item.__v
                    const owner =await UserDatabase.getUserById(item.idOwner)
                    let friendStatus = 0
                    if (owner!=null) {
                        const commune = owner.commune!=null && owner.commune.length>0 ? `${owner.commune} - ` : ''
                        const district = owner.district!=null && owner.district.length>0 ? `${owner.district} - ` : ''
                        const province = owner.province!=null && owner.province.length>0 ? `${owner.province}` : ''
                        item.address = `${commune}${district}${province}`
                        const groupChat = await GroupChatDatabase.getSpecificGroupChat([token,owner._id.toString()])
                        if (groupChat!=null){
                            friendStatus = 3
                        } else {
                            let exist = await InviteDatabase.getSpecificInvite(token,owner._id)
                            if (exist!=null){
                                friendStatus =1
                            } else {
                                exist = await InviteDatabase.getSpecificInvite(owner._id,token)
                                if (exist!=null){
                                    friendStatus =2
                                }
                            }
                        }
                    }
                    item.friend_status =friendStatus
                    item.breed = breed

                    newData.push(item)
                }
                result.data = newData
                res.status(200).send(result)
            }
        })
    }
}

module.exports = PetTinderAPI