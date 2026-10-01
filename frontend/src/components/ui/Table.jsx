import React from 'react';

const Table = ({ columns, data, keyField = 'id', onRowClick }) => {
  if (!data || data.length === 0) {
    return (
      <div className="table-container p-8 text-center text-text-secondary">
        No data available
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="modern-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr 
              key={row[keyField]} 
              onClick={() => onRowClick && onRowClick(row)}
              style={onRowClick ? { cursor: 'pointer' } : {}}
            >
              {columns.map((col, idx) => (
                <td key={idx}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
