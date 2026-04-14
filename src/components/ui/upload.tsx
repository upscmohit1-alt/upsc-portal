"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UploadProps = {
  onFileSelect?: (file: File | null) => void;
};

export function Upload({ onFileSelect }: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const accept = "application/pdf,image/*";

  const setFile = (file: File | null) => {
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setFile(fileList[0]);
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-borderTone/80 bg-bgSoft/75 px-4 py-6 text-center backdrop-blur-md transition-colors",
          dragging && "border-blue bg-blueLight/80"
        )}
      >
        <UploadCloud className="mb-2 h-5 w-5 text-mid" />
        <p className="text-sm font-semibold text-blackish">Drag & drop answer sheet</p>
        <p className="mt-1 text-xs text-muted">PDF or image (JPG, PNG, WEBP)</p>
        {selectedFile ? <p className="mt-2 text-xs text-green">{selectedFile.name}</p> : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <Button
        className="w-full"
        disabled={!selectedFile || isEvaluating}
        onClick={() => {
          setIsEvaluating(true);
          setTimeout(() => setIsEvaluating(false), 1500);
        }}
      >
        {isEvaluating ? "Evaluating..." : "Evaluate with AI"}
      </Button>
    </div>
  );
}
