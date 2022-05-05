import mongoose from "mongoose";

const schema = mongoose.Schema;

const schemaCompany = new schema({
    name : {type: String},
    // company : {type: String}
    company : {type: mongoose.Types.ObjectId, ref : 'company',default:""}

})
export default mongoose.model("departement", schemaCompany);