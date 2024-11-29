import { clientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  try {
    if (!process.env.DATABASE_NAME) {
      throw new Error('Invalid/Missing environment variable: "DATABASE_NAME"');
    }

    const database = process.env.DATABASE_NAME;

    const { action } = await params;
    const body = await req.json();

    const { collection, filter, projection, update, upsert, sort, limit } =
      body;

    if (!collection || !filter) {
      return NextResponse.json(
        { message: "Missing required fields: collection, filter" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(database);
    const col = db.collection(collection);

    // Transform _id to ObjectId if present in filter
    if (filter._id) {
      filter._id = ObjectId.createFromHexString(filter._id);
    }

    let result;

    switch (action) {
      case "findOne":
        result = await col.findOne(filter, { projection });
        break;
      case "find":
        const options = {};
        if (projection) options.projection = projection;
        if (sort) options.sort = sort;
        if (limit) options.limit = limit;

        result = await col.find(filter, options).toArray();
        break;
      case "updateOne":
        if (!update) {
          return NextResponse.json(
            { message: "Missing required field: update" },
            { status: 400 }
          );
        }
        console.log(update);
        result = await col.updateOne(filter, update, {
          upsert: upsert || false,
        });
        break;
      case "deleteMany":
        result = await col.deleteMany(filter);
        break;
      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
