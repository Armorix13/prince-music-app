import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { connectDB } from '../src/config/db.js';
import { Advertisement } from '../src/model/advertisement.model.js';

dotenv.config();

const advertisementPayloads = [
  {
    title: 'Unlimited Backstage Wi-Fi',
    description: 'Keep every rehearsal streamed live with enterprise-grade connectivity, available across all jam rooms.',
    photoUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'
  },
  {
    title: 'Glow Tour Self-Care Booths',
    description: 'Recharge between sets with guided breathwork, on-call physio, and a calming lounge curated for touring artists.',
    photoUrl: 'https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg'
  },
  {
    title: 'Analog Dreams Showcase',
    description: 'Step into a retro-futuristic soundscape featuring custom vinyl presses and modular synth playgrounds.',
    photoUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg'
  }
];

const seedAdvertisements = async () => {
  try {
    await connectDB();

    let created = 0;
    let skipped = 0;

    for (const payload of advertisementPayloads) {
      const result = await Advertisement.updateOne(
        { photoUrl: payload.photoUrl },
        { $setOnInsert: payload },
        { upsert: true }
      );

      if (result.upsertedCount && result.upsertedCount > 0) {
        created += 1;
      } else {
        skipped += 1;
      }
    }

    console.log(`✅ Advertisement seeding complete. Created: ${created}, Skipped (existing): ${skipped}`);
  } catch (error) {
    console.error('❌ Failed to seed advertisements:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedAdvertisements();

