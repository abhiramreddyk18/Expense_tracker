const TransactionItem = ({ txn }) => {
    const formattedDate = new Date(txn.createdAt).toLocaleString();
  
    return (
      <div style={{
        borderBottom: '1px solid #ddd',
        padding: '10px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <p><strong>{txn.type === "credit" ? "Received from" : "Sent to"}:</strong> {txn.type === "credit" ? txn.from : txn.to}</p>
          <p>{txn.category}</p>
          <small>{formattedDate}</small>
        </div>
        <div style={{ color: txn.type === "credit" ? 'green' : 'red', fontWeight: 'bold' }}>
          {txn.type === "credit" ? `+ ₹${txn.amount}` : `- ₹${txn.amount}`}
        </div>
      </div>
    );
  };
  
  export default TransactionItem;
  