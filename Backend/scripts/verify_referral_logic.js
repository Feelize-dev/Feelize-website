
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Affiliate from '../model/affiliate.js';
import Project from '../model/project.js';
import Referral from '../model/referral.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: join(__dirname, '../.env') });

const verifyReferralLogic = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        // 1. Create a Test Affiliate
        const testEmail = `test_affiliate_${Date.now()}@example.com`;
        const testCode = `TEST${Date.now().toString().slice(-4)}`;

        console.log(`\n👤 Creating Test Affiliate: ${testEmail} (Code: ${testCode})`);
        const affiliate = await Affiliate.create({
            name: "Test Affiliate",
            email: testEmail,
            referral_code: testCode,
            status: "active",
            total_referrals: 0
        });
        console.log(`✅ Affiliate Created. ID: ${affiliate._id}, Referrals: ${affiliate.total_referrals}`);

        // 2. Simulate Project Creation Logic (copy-pasted relevant parts from controller)
        console.log(`\n🏗️  Simulating Project Creation with Referral Code: ${testCode}`);

        // Logic from project.controller.js
        const foundAffiliate = await Affiliate.findOne({
            referral_code: { $regex: new RegExp(`^${testCode}$`, "i") }
        });

        if (foundAffiliate) {
            console.log(`   ✅ Found Affiliate: ${foundAffiliate._id}`);

            // Create Referral
            const referral = await Referral.create({
                affiliate_id: foundAffiliate._id,
                referred_user_email: "client@example.com",
                project_id: new mongoose.Types.ObjectId(), // Dummy project ID
                status: "pending"
            });
            console.log(`   ✅ Referral Record Created: ${referral._id}`);

            // Increment Stats
            const updated = await Affiliate.findByIdAndUpdate(foundAffiliate._id, {
                $inc: { total_referrals: 1 }
            }, { new: true });

            console.log(`   ✅ Stats Incremented. New Count: ${updated.total_referrals}`);

            if (updated.total_referrals === 1) {
                console.log('\n🎉 SUCCESS: Referral count incremented correctly!');
            } else {
                console.error('\n❌ FAILURE: Referral count did NOT increment.');
            }

        } else {
            console.error('❌ Could not find affiliate with code.');
        }

        // Cleanup
        console.log('\n🧹 Cleaning up...');
        await Affiliate.findByIdAndDelete(affiliate._id);
        console.log('✅ Cleanup done.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

verifyReferralLogic();
