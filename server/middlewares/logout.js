const mongoose = require('mongoose')
const Client = mongoose.model('Client')

const Guest = mongoose.model('Guest')

module.exports = {
    async logout(type, id) {
        if (type) {
            const update = await Client.update({
                _id: id
            }, {
                status: 'false'
            })
            if (update) {
                return true
            } else {
                return false
            }
        } else {
            const update = await Guest.update({
                _id: id
            }, {
                status: 'false'
            })
            if (update) {
                return true
            } else {
                return false
            }
        }
    }
}