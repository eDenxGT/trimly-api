import { Document, model, ObjectId } from "mongoose";
import { barberSchema } from "../schemas/barber.schema";
import { IBarberEntity } from "../../../../entities/models/barber.entity";

export interface IBarberModel extends IBarberEntity, Document {
   _id: ObjectId;
}

export const BarberModel = model<IBarberModel>("Barber", barberSchema);
