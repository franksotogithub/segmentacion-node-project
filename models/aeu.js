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
    ind1: Number,
    ind2: Number,
    ind3: Number,
    ind4: Number,
    ind5: Number,
    ind6: Number,
    ind7: Number,


});
module.exports = Aeu = mongoose.model('aeu', AeuSchema);
