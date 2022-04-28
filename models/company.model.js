import mongoose from "mongoose";

const schema = mongoose.Schema;

const schemaCompany = new schema({
        name: { type: String, default: "" },
        address: { type: String, default: "" },
        phone: { type: Number, default: "" },
        type: { type: String, default: "" },
        email: { type: String, default: "" },
        legalStatus: { type: String, default: "" },
        tvaic: { type: String, default: "" },
        siret: { type: String, default: "" },
        rcs: { type: String, default: "" },
        codeApe: { type: String, default: "" },
        website: { type: String, default: "" },
        imageUrl: { type: String, default: "" },
        employeesCount: { type: Number, default: 0 },
        enabled: { type: Boolean, default: false },
        // owner : { type: mongoose.Types.ObjectId, ref : 'user' },

 

})
const company = mongoose.model("company", schemaCompany);
export default company