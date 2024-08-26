import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";

export function InputWithButton(props) {
  const { inputValue, onInputChange, onSubmit, placeholderText } = props;

  const debouncedHandleSearchedString = debounce(onInputChange, 800);

  return (
    <div className="flex w-full max-w-sm items-center space-x-2 my-4">
      <Input
        type="email"
        placeholder={placeholderText}
        className="border-[#0b1215]	 border-2 outline-none text-base	sm:text-lg"
        onChange={(e) => debouncedHandleSearchedString(e)}
      />
      <Button
        type="submit"
        className="p-2 sm:p-5 text-sm sm:text-lg tracking-wider bg-[#0b1215] hover:bg-black shiny-text"
        onClick={() => onSubmit()}
      >
        Search
      </Button>
    </div>
  );
}
