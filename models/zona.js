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
    flag_proc_calidad :Number,
    cant_mzs:Number,
    cant_viv:Number,
    cant_pob:Number,
    cant_secc_u:Number,
    cant_ae_u:Number,

});
module.exports = Zona = mongoose.model('zona', UserSchema);
