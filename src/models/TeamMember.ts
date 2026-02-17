import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
    name: string;
    role: string;
    role_am?: string;
    role_om?: string;
    bio?: string;
    bio_am?: string;
    bio_om?: string;
    image_base64?: string;
    order: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

const TeamMemberSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        role_am: { type: String },
        role_om: { type: String },
        bio: { type: String },
        bio_am: { type: String },
        bio_om: { type: String },
        image_base64: { type: String }, // CEO/Founder photos stored as base64
        order: { type: Number, default: 0 },
        is_active: { type: Boolean, default: true },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

TeamMemberSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    },
});

export default mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
