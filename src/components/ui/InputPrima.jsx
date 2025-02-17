export function InputPrima(props) {
  return (
    <div className="mt-1 flex rounded-md">
      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-200 bg-gray-50 px-3 text-gray-500">
        $
      </span>
      <input
        className="block w-full rounded-r-md border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-primary"
        type="text"
        placeholder="0,00"
        {...props}
      />
    </div>
  );
}
