import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  runTransaction 
} from 'firebase/firestore';

export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  type: string;
  color: string;
  mileage: string;
  range: string;
  available: boolean;
  img: string;
}

export interface ReserveResponse {
  vehicleId: string;
  message: string;
}

const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    name: 'Model S Plaid',
    make: 'Tesla',
    model: 'S Plaid',
    year: 2026,
    price: 89990,
    type: 'Sedan',
    color: 'Solid Black',
    mileage: '1,200 mi',
    range: '359 mi',
    available: true,
    img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'veh-2',
    name: 'Cybertruck Cyberbeast',
    make: 'Tesla',
    model: 'Cybertruck',
    year: 2026,
    price: 99990,
    type: 'Truck',
    color: 'Stainless Steel',
    mileage: '450 mi',
    range: '320 mi',
    available: true,
    img: 'https://images.unsplash.com/photo-1698778573682-346d219402b5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'veh-3',
    name: 'Model X Plaid',
    make: 'Tesla',
    model: 'X Plaid',
    year: 2025,
    price: 94990,
    type: 'SUV',
    color: 'Ultra Red',
    mileage: '4,500 mi',
    range: '326 mi',
    available: true,
    img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'veh-4',
    name: 'Model 3 Performance',
    make: 'Tesla',
    model: '3 Performance',
    year: 2026,
    price: 54990,
    type: 'Sedan',
    color: 'Deep Blue Metallic',
    mileage: '150 mi',
    range: '296 mi',
    available: false,
    img: 'https://images.unsplash.com/photo-1561580119-2d90630b3511?auto=format&fit=crop&w=600&q=80'
  }
];

export const inventoryService = {
  /** Fetch all vehicles in the fleet inventory from Firestore. Seeding if empty. */
  async getVehicles(): Promise<Vehicle[]> {
    const vehiclesCol = collection(db, 'vehicles');
    const vehiclesSnap = await getDocs(vehiclesCol);

    if (vehiclesSnap.empty) {
      // Seed default vehicles into Firestore
      for (const veh of DEFAULT_VEHICLES) {
        await setDoc(doc(db, 'vehicles', veh.id), veh);
      }
      return DEFAULT_VEHICLES;
    }

    return vehiclesSnap.docs.map(doc => doc.data() as Vehicle);
  },

  /** Reserve a vehicle by ID using Firestore transaction. */
  async reserveVehicle(id: string): Promise<ReserveResponse> {
    const vehicleRef = doc(db, 'vehicles', id);

    const result = await runTransaction(db, async (transaction) => {
      const vehDoc = await transaction.get(vehicleRef);

      if (!vehDoc.exists()) {
        throw new Error('Vehicle not found.');
      }

      const vehData = vehDoc.data() as Vehicle;

      if (!vehData.available) {
        throw new Error('Vehicle is already reserved.');
      }

      transaction.update(vehicleRef, { available: false });

      return {
        vehicleId: id,
        message: `Successfully reserved the ${vehData.name}. An advisor will contact you shortly.`,
      };
    });

    return result;
  },
};
