import { clientPromise } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function PUT(req) {
    try {

        if (!process.env.DATABASE_NAME) {
            return NextResponse.json({ message: 'Invalid/Missing environment variable: "DATABASE_NAME"'});
        }
        if (!process.env.VEHICLE_ID) {
           return NextResponse.json({ message: 'Invalid/Missing environment variable: "VEHICLE_ID"'});
        }

        const dbName = process.env.DATABASE_NAME;
        const vehicleId = process.env.VEHICLE_ID;

        const updateFields = await req.json();
        
        const client = await clientPromise;
        const database = client.db(dbName);
        const collection = database.collection('vehicle_data');

        const result = await collection.updateOne(
            { _id: ObjectId.createFromHexString(vehicleId) },
            {
                $set: updateFields,
            }
        );

        if (result.modifiedCount === 1) {
            return NextResponse.json({ message: 'Vehicle data updated successfully' });
        } else if (result.matchedCount === 1) {
            return NextResponse.json({ message: 'No changes made to vehicle data' });
        } else {
            return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating vehicle data:', error);
        return NextResponse.error(new Error('Internal Server Error'));
    }
}