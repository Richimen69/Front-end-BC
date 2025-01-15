export function InputPrima(props) {
    return(
        <div className="flex h-[34px] text-[14px] text-black w-36 items-center bg-white ring-1 ring-inset ring-gray-400 rounded-md focus-within:ring-primary focus-within:ring-2 ease-in-out">
        <span className="ml-2">$</span>
        <input
          className="bg-transparent text-black px-3 py-1 rounded-l-md focus:outline-none w-full appearance-none"
          type="text"
          placeholder="0,00"
          {...props}
        />
        <span className="mr-2">MXN</span>
      </div>
    )
}