import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/green_africa';

// Minimal Product Schema for script
const ProductSchema = new mongoose.Schema({
    image_base64: String,
    name: String
});

const TeamMemberSchema = new mongoose.Schema({
    image_base64: String,
    name: String
});

const Product = mongoose.model('Product', ProductSchema);
const TeamMember = mongoose.model('TeamMember', TeamMemberSchema);

async function compressBase64(base64Str: string): Promise<string> {
    if (!base64Str || !base64Str.startsWith('data:image')) return base64Str;

    try {
        const [header, data] = base64Str.split(',');
        const buffer = Buffer.from(data, 'base64');

        const compressedBuffer = await sharp(buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 70 })
            .toBuffer();

        return `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
    } catch (err) {
        console.error('Failed to compress an image, skipping...');
        return base64Str;
    }
}

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const products = await Product.find({ image_base64: { $exists: true, $ne: '' } });
    console.log(`Found ${products.length} products to compress.`);

    for (const product of products) {
        console.log(`Compressing product: ${product.name}...`);
        const compressed = await compressBase64(product.image_base64!);
        const oldSize = product.image_base64!.length;
        const newSize = compressed.length;
        console.log(`  Size reduced: ${(oldSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB (${Math.round((1 - newSize / oldSize) * 100)}% reduction)`);
        product.image_base64 = compressed;
        await product.save();
    }

    const members = await TeamMember.find({ image_base64: { $exists: true, $ne: '' } });
    console.log(`Found ${members.length} team members to compress.`);

    for (const member of members) {
        console.log(`Compressing member: ${member.name}...`);
        const compressed = await compressBase64(member.image_base64!);
        member.image_base64 = compressed;
        await member.save();
    }

    console.log('Optimization complete!');
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
