export function RecordTimeline({ records }) {
  return (
    <ol className="timeline">
      {records.map((record) => (
        <li key={record.id}>
          <div className="timeline-dot" />
          <div>
            <span>{record.date}</span>
            <h5>{record.title}</h5>
            <p>{record.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

