const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    ccdd: String,
    ccpp: String,
    ccdi: String,
    idzona: {
        type: String,
        required:true,
        unique:true,
    },
    departamento: String,
    provincia: String,
    distrito: String,
    zona: String,
    flag_proc_segm :Number,

});
module.exports = Zona = mongoose.model('zona', UserSchema);