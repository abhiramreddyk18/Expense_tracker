const TransactionItem = ({ txn }) => {
  const formattedDate = new Date(txn.date).toLocaleString();

  return (
    <div className="bg-white rounded-xl  p-5 flex justify-between items-start border border-gray-200">
      <div className="space-y-1">
        <p className="text-lg font-semibold text-gray-800">{txn.name}</p>
        <p className="text-sm text-gray-600">{txn.category}</p>
        <p className="text-sm text-gray-500">{formattedDate}</p>
      </div>
      <div
        className={`text-lg font-bold ${
          txn.type === 'income' ? 'text-green-600' : 'text-red-500'
        }`}
      >
        {txn.type === 'income' ? `+ ₹${txn.amount}` : `- ₹${txn.amount}`}
      </div>
    </div>
  );
};

export default TransactionItem;
