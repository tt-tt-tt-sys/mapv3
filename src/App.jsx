import { useState } from "react";
import { CSVLink } from "react-csv";

export default function App() {
  const [stores, setStores] = useState([
    { id: 1, name: "Store 1", postcodes: ["2000", "2001"] },
    { id: 2, name: "Store 2", postcodes: ["3000"] },
  ]);

  // Combine all stores’ postcodes into one CSV
  const exportCombinedCSV = () => {
    const rows = [];
    stores.forEach((store) => {
      store.postcodes.forEach((pc) => {
        rows.push({ store: store.name, postcode: pc });
      });
    });
    return rows;
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-1/3 p-6 border-r">
        <h1 className="text-2xl font-bold mb-4">Multi-Store Postcode Tool</h1>

        <div className="space-y-4">
          {stores.map((store) => (
            <div key={store.id} className="p-4 border rounded-2xl">
              <h2 className="text-lg font-semibold">{store.name}</h2>
              <p className="text-sm text-gray-600">
                Assigned Postcodes: {store.postcodes.join(", ")}
              </p>
              <CSVLink
                data={store.postcodes.map((pc) => ({ postcode: pc }))}
                filename={`${store.name}-postcodes.csv`}
                className="mt-2 inline-block px-3 py-1 bg-blue-500 text-white rounded-xl"
              >
                Export CSV
              </CSVLink>
            </div>
          ))}
        </div>

        {/* Controls */}
        <aside className="space-y-4 mt-6">
          <div className="p-4 border rounded-2xl">
            <div className="flex flex-col gap-2">
              <CSVLink
                data={exportCombinedCSV()}
                filename="all-stores-postcodes.csv"
                className="w-full px-4 py-2 rounded-xl bg-black text-white text-center"
              >
                Export All Stores CSV
              </CSVLink>
            </div>
          </div>
        </aside>
      </aside>

      {/* Map placeholder */}
      <main className="flex-1 p-6">
        <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
          <p className="text-gray-500">[Map will go here]</p>
        </div>
      </main>
    </div>
  );
}
