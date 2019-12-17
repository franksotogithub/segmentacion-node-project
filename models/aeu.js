const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AeuSchema = new Schema({
    ccdi: String,
    idzona: String,
    idsubzona: String,
    idseccion: String,
    idaeu: String,
    zona :String,
    subzona: String,
    seccion: String,
    aeu: String,
    cant_viv: Number,
    ruta_web: String,
    flag_calidad: Number,
    flag_defectuosa: Number,
    ind1: Boolean,
    ind2: Boolean,
    ind3: Boolean,
    ind4: Boolean,
    ind5: Boolean,
    ind6: Boolean,
    ind7: Boolean,


});
module.exports = Aeu = mongoose.model('aeu', AeuSchema);
