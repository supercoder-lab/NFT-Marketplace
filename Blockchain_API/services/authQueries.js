var db = require('../utils/connection');

module.exports = {
    getUsers: "SELECT * FROM users WHERE user_name = ? or email = ? or mobile_number = ?",
    // getUsersUserName: "SELECT * FROM users WHERE user_name = ?",
    getUsersEmail: "SELECT * FROM users WHERE email = ?",
    getUserByUserName: "SELECT * FROM users WHERE user_name = ?",
    getUserByMobileNumber: "SELECT * FROM users WHERE mobile_number = ?",

    getToken: "SELECT * FROM users WHERE token = ?",
    insertUserData: "INSERT INTO users SET ?",
    insertTrxData: "INSERT INTO pre_sale_token_purchase SET ?",

    insertTransaction: "INSERT INTO `profile` SET ?",
    getTotalTokens: "SELECT * FROM profile WHERE id = ?",
    insertContactUsData: "INSERT INTO contact SET ?",
    getTotalInvestment: "SELECT * FROM profile ",

    getTotalInvestmentByAdminModel: "SELECT sum(cost_amount) FROM pre_sale_token_purchase ",

    // getEoiByUniqueCode: "SELECT * FROM pre_sale_token_purchase WHERE char_date = ?",
    getEoiByUniqueCode: "SELECT * FROM pre_sale_token_purchase WHERE char_date = ? and id = ? and eoi_id =?",

    getDocStatus:"SELECT * FROM ai_kyc_document_validation_progress where user_name = ?",

    updateCharDate: "UPDATE pre_sale_token_purchase SET char_date = ? WHERE eoi_id = ?",
    // updatePurchaseTokens: "UPDATE pre_sale_token_purchase SET rate = ?, no_tokens = ?, cost_amount = ? WHERE char_date = ?",

    updateValuesForPurchaseTokens: "UPDATE pre_sale_token_purchase SET rate = ?, no_tokens = ?, cost_amount = ? WHERE char_date = ? and id = ? and eoi_id = ?",
    getCustomerAddress : "SELECT * FROM customer_address WHERE user_name = ?",
    insertCustomerAddress : "INSERT INTO customer_address SET ?",
    updateCustomerAddress: "UPDATE customer_address SET address_line1 = ? , address_line2 = ? , city_town_suburb = ? , state_province = ? , post_code = ? , country = ? , region = ? , address_type = ? , update_time = ? , create_time = ? where user_name = ?",
    insertCustomerAddressHistory : "INSERT INTO customer_address_history_log SET ?",
    deleteUser(user) {
        db.query("DELETE FROM users WHERE email = ?", user, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('User deleted successfully');
            }
        });
    },
    deleteTransaction(user) {
        db.query("DELETE FROM pre_sale_token_purchase WHERE email = ?", user, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('txn deleted successfully');
            }
        });
    },
}