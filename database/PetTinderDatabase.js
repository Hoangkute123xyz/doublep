const Pet = require('../model/pet');
const UserDatabase = require('../database/UserDatabase');
const SocketConstant = require('../ultil/SocketConstant')

const PetTinder = {
    getAllPet: async (idUser, page) => {
        if (page == null) page = 0
        const perPage = 40
        const petFind = await Pet.findOne({idOwner: idUser});
        if (petFind == null) return null
        const count = await Pet.countDocuments()
        const result = await Pet.find({
            idOwner: {'$ne': idUser},
            idType: petFind.idType,
            sex: {'$ne': petFind.sex}
        }).skip(perPage * page).limit(perPage).lean();
        for (const i in result) {
            result[i].avatar = SocketConstant.BASE_URL + result[i].avatar
        }
        return {total_page: Math.ceil(count / perPage), current_page: page, data: result}
    }
}

module.exports = PetTinder