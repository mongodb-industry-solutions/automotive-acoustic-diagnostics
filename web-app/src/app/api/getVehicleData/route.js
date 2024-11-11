import { clientPromise } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req) {
    try {
        const client = await clientPromise;
        const database = client.db(process.env.DATABASE_NAME);
        const collection = database.collection('vehicle_data');
        
        const vehicleData = await collection.findOne({ _id: new ObjectId(process.env.VEHICLE_ID) });
        
        return NextResponse.json(vehicleData);
    } catch (error) {
        console.error('Error fetching vehicle data:', error);
        return NextResponse.error(new Error('Internal Server Error'));
    }
}