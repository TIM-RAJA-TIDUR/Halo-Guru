const bcrypt = require('bcryptjs');


function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

function backHashPassword(password,currentPassword) {
    let backPassword = bcrypt.compareSync(password, currentPassword)

    return backPassword
}


module.exports = {hashPassword,backHashPassword}


