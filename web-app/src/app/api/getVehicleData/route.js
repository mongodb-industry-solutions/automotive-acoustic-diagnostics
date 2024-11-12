import { clientPromise } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req) {
    try {
        if (!process.env.DATABASE_NAME) {
            return NextResponse.json({ message: 'Invalid/Missing environment variable: "DATABASE_NAME"'});
        }
        if (!process.env.VEHICLE_ID) {
           return NextResponse.json({ message: 'Invalid/Missing environment variable: "VEHICLE_ID"'});
        }

        const dbName = process.env.DATABASE_NAME;
        const vehicleId = process.env.VEHICLE_ID;

        const client = await clientPromise;
        const database = client.db(dbName);
        const collection = database.collection('vehicle_data');
        
        const vehicleData = await collection.findOne({ _id: ObjectId.createFromHexString(vehicleId) });
        
        return NextResponse.json(vehicleData);
    } catch (error) {
        console.error('Error fetching vehicle data:', error);
        return NextResponse.error(new Error('Internal Server Error'));
    }
}