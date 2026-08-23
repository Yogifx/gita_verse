"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { useAssetStore } from "@/features/media/store/use-asset-store";
import { AssetMetadataForm } from "@/features/media/components/AssetMetadataForm";
import { formatFileSize } from "@/features/media/lib/selectors";
import type { AssetCategory, AssetDimensions, AssetFileType } from "@/types/asset";
import { cn } from "@/lib/utils/cn";

type UploadAssetModalProps = {
  open: boolean;
  onClose: () => void;
};

type SelectedFile = {
  fileName: string;
  size: number;
  type: AssetFileType;
  previewUrl: string;
  dimensions?: AssetDimensions;
};

function guessFileType(mime: string): AssetFileType {
  if (mime.includes("svg")) return "svg";
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  return "other";
}

function readImageDimensions(url: string): Promise<AssetDimensions | undefined> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(undefined);
    img.src = url;
  });
}

export function UploadAssetModal({ open, onClose }: UploadAssetModalProps) {
  const createAsset = useAssetStore((s) => s.createAsset);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<AssetCategory | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [touched, setTouched] = useState(false);

  const isNameValid = name.trim().length > 0;
  const isCategoryValid = category !== undefined;

  function handleClose() {
    setName("");
    setCategory(undefined);
    setTags([]);
    setSelectedFile(null);
    setTouched(false);
    onClose();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const dimensions = file.type.startsWith("image/")
      ? await readImageDimensions(previewUrl)
      : undefined;

    setSelectedFile({
      fileName: file.name,
      size: file.size,
      type: guessFileType(file.type || file.name),
      previewUrl,
      dimensions,
    });

    if (!name) {
      setName(file.name.replace(/\.[^/.]+$/, ""));
    }
  }

  function handleCreate() {
    setTouched(true);
    if (!isNameValid || !category) return;

    createAsset({
      name,
      category,
      tags,
      type: selectedFile?.type,
      dimensions: selectedFile?.dimensions,
      size: selectedFile?.size,
      previewUrl: selectedFile?.previewUrl,
    });
    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload Asset"
      description="Add a reusable creative asset to your library. This milestone stores assets locally in this session — no file leaves your browser."
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-caption font-medium text-foreground-secondary">
            File <span className="text-foreground-muted">(optional)</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex w-full items-center gap-3 rounded-control border border-dashed border-border bg-background px-3 py-3 text-left transition-colors duration-fast hover:border-primary-muted",
            )}
          >
            {selectedFile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedFile.previewUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-control object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-muted text-foreground-muted">
                <UploadCloud className="h-5 w-5" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-caption font-medium text-foreground">
                {selectedFile ? selectedFile.fileName : "Choose an image file…"}
              </span>
              <span className="block text-small text-foreground-muted">
                {selectedFile
                  ? formatFileSize(selectedFile.size)
                  : "PNG, JPG, SVG, or WEBP — stored for this session only"}
              </span>
            </span>
          </button>
        </div>

        <AssetMetadataForm
          name={name}
          onNameChange={setName}
          category={category}
          onCategoryChange={setCategory}
          tags={tags}
          onTagsChange={setTags}
          nameError={touched && !isNameValid ? "Asset name is required." : undefined}
          categoryError={touched && !isCategoryValid ? "Category is required." : undefined}
        />

        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-control border border-border px-4 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
          >
            Add Asset
          </button>
        </div>
      </div>
    </Modal>
  );
}
