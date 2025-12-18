import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IResource extends Document {
    title: string;
    description: string;
    link: string;
    createdAt: Date;
}

const ResourceSchema: Schema<IResource> = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        link: { type: String, required: true },
    },
    { timestamps: true }
);

const Resource: Model<IResource> =
    mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;
