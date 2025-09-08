import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef(({ 
  className, 
  checked, 
  onCheckedChange, 
  disabled = false,
  id,
  ...props 
}, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked || false);

  React.useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);

  const handleChange = (e) => {
    if (disabled) return;
    
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    
    if (onCheckedChange) {
      onCheckedChange(newChecked);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      
      if (onCheckedChange) {
        onCheckedChange(newChecked);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        ref={ref}
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div
        role="checkbox"
        aria-checked={isChecked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && handleChange({ target: { checked: !isChecked } })}
        className={cn(
          "h-5 w-5 border border-gray-100 shrink-0 rounded-md border-2 transition-all duration-200 cursor-pointer flex items-center justify-center",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          isChecked 
            ? "bg-[#32669C] border-[#32669C] text-white border-none" 
            : "bg-white border-gray-300 hover:border-gray-400",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        {isChecked && (
          <Check className="h-4 w-4 font-bold stroke-[4] text-white" />
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox"

export { Checkbox }
