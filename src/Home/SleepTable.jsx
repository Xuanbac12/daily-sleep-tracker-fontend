import React from "react";

const SleepTable = ({ records }) => {
  return (
    <div className="container-table">
      <table className="main-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time of sleep</th>
            <th>Wake up time</th>
            <th>Sleep duration</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.sleepTime}</td>
              <td>{record.wakeTime}</td> 

              <td>{record.duration} Hrs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SleepTable;
