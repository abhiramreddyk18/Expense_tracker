const TransactionItem = ({ txn }) => {
  const formattedDate = new Date(txn.date).toLocaleString();

  return (
    <div style={{
      borderBottom: '1px solid #ddd',
      padding: '12px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <p><strong>{txn.type === "income" ? "Received from" : "Sent to"}:</strong> {txn.name}</p>
        <p><strong>Phone:</strong> {txn.phoneNumber}</p>
        <p><strong>Category:</strong> {txn.category}</p>
        <p><strong>Date:</strong> {formattedDate}</p>
      </div>
      <div style={{
        color: txn.type === "income" ? 'green' : 'red',
        fontWeight: 'bold',
        fontSize: '16px'
      }}>
        {txn.type === "income" ? `+ ₹${txn.amount}` : `- ₹${txn.amount}`}
      </div>
    </div>
  );
};

export default TransactionItem;
