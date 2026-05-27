import { useRef } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUploadField = ({ label, value, onChange }) => {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {label && <label className="block text-sm font-semibold mb-2">{label}</label>}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div
          onClick={() => inputRef.current?.click()}
          className="w-full sm:w-40 h-32 rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
        >
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground font-medium">Click to upload</span>
            </>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs font-semibold text-destructive flex items-center gap-1 hover:underline"
          >
            <X className="w-3.5 h-3.5" /> Remove image
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploadField;
