import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../services/db';
import * as ReactWindow from 'react-window';
import { formatDate, formatCurrency } from '../../../lib/formatters';

const List = ReactWindow.FixedSizeList;

function HistoryList() {
  // useLiveQuery creates a reactive subscription to the database.
  // The component will automatically re-render when the data changes.
  const refuelRecords = useLiveQuery(
    () => db.refuelRecords.orderBy('timestamp').reverse().toArray(),
    [], // Dependencies array
  );

  if (!refuelRecords) {
    return <p>Loading history...</p>;
  }

  if (refuelRecords.length === 0) {
    return <p>No refuel records yet.</p>;
  }

  // The Row component is rendered by react-window for each visible item.
  // The `style` prop is crucial for positioning.
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const record = refuelRecords[index];
    return (
      <div style={style} className="flex items-center justify-between border-b border-gray-800 p-2">
        <div>
          <p className="font-bold">{formatDate(record.timestamp)}</p>
          <p className="text-sm text-gray-400">
            Odometer: {record.odometerKm.toFixed(0)} km
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg text-brand-primary">
            {record.liters.toFixed(2)} L
          </p>
          {record.totalCost && (
            <p className="text-sm text-gray-400">
              {formatCurrency(record.totalCost)}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full">
      {/* react-window ensures that only the visible items are rendered to the DOM,
      providing excellent performance for very long lists. */}
      <List
        height={400}
        itemCount={refuelRecords.length}
        itemSize={65} // Height of each row in pixels
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
}

export default HistoryList;
