import mongoose,{Document} from "mongoose";

const voucherUsersGaveSchema = new mongoose.Schema(
    {
        userId: {
             type: mongoose.Schema.Types.ObjectId,
              ref: 'User', required: true 
            },
        voucherId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Voucher', required: true 
        },
        date_end:{
            type: String,
            required: true,
        }

    },
    {
        versionKey: false,
        strict: true,
        timestamps: true
    }
);
export const VoucherUsersGave = mongoose.model("VoucherUsersGave", voucherUsersGaveSchema);

interface IVoucherUsersGave extends Document {
    userId?: mongoose.Schema.Types.ObjectId;
    voucherId?: mongoose.Schema.Types.ObjectId;
    date_end?: string;
}