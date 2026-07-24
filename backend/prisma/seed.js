const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    try {
        // Fixed Doctor Account
        const doctorEmail = 'BOUSIFSAMEH@gmail.com'; // ✅ Added quotes
        const existingDoctor = await prisma.user.findUnique({
            where: { email: doctorEmail }
        });

        if (!existingDoctor) {
            const hashedPassword = await bcrypt.hash('BOUSIFDoctor123456', 10);

            const doctor = await prisma.user.create({
                data: {
                    name: 'Dr. BOUSIF SAMEH',
                    email: doctorEmail,
                    password: hashedPassword,
                    role: 'doctor',
                    phone: '51 714 714',
                    address: 'Batiment Bin Mahmoud en face du resto Ali Baba',
                    isActive: true
                }
            });
            console.log('✅ Doctor account created:', doctor.email);
        } else {
            console.log('ℹ️ Doctor account already exists:', doctorEmail);
        }

        // Fixed Secretary Account
        const secretaryEmail = 'secretaryBOUSIF@gmail.com'; // ✅ Added quotes and fixed variable name
        const existingSecretary = await prisma.user.findUnique({
            where: { email: secretaryEmail }
        });

        if (!existingSecretary) {
            const hashedPassword = await bcrypt.hash('secretaireBousif123456', 10);

            const secretary = await prisma.user.create({
                data: {
                    name: 'BOUSIF-SECRETARY',
                    email: secretaryEmail,
                    password: hashedPassword,
                    role: 'secretary',
                    phone: '51 714 714',
                    address: 'Batiment bin Mahmoud, en face du resto Ali Baba',
                    isActive: true
                }
            });
            console.log('✅ Secretary account created:', secretary.email);
        } else {
            console.log('ℹ️ Secretary account already exists:', secretaryEmail);
        }

        // Optional: Create a test patient
        const patientEmail = 'patient@test.com';
        const existingPatient = await prisma.user.findUnique({
            where: { email: patientEmail }
        });

        if (!existingPatient) {
            const hashedPassword = await bcrypt.hash('patient123', 10);

            const patient = await prisma.user.create({
                data: {
                    name: 'Jean Test',
                    email: patientEmail,
                    password: hashedPassword,
                    role: 'patient',
                    phone: '06 11 22 33 44',
                    address: '456 Rue des Patients, 75002 Paris',
                    birthDate: '1990-05-15',
                    isActive: true
                }
            });

            // Create patient record
            await prisma.patient.create({
                data: {
                    name: patient.name,
                    email: patient.email,
                    phone: patient.phone || '',
                    birthDate: patient.birthDate || null,
                    address: patient.address || null,
                    createdBy: patient.id
                }
            });
            console.log('✅ Test patient created:', patient.email);
        } else {
            console.log('ℹ️ Test patient already exists:', patientEmail);
        }

        console.log('✅ Seed completed successfully!');
    } catch (error) {
        console.error('❌ Seed error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();