"use client";

import { useEffect, useState } from "react";
import { Archive, Pencil, Tag } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { useAssetStore } from "@/features/media/store/use-asset-store";
import { getAssetById, formatDimensions, formatFileSize } from "@/features/media/lib/selectors";
import { ASSET_CATEGORY_META, ASSET_FILE_TYPE_LABEL } from "@/constants/assets";
import { AssetMetadataForm } from "@/features/media/components/AssetMetadataForm";
import { AssetPreviewSwatch } from "@/features/media/components/AssetPreviewSwatch";
import { formatDate, formatRelativeTime } from "@/lib/utils/time";
import type { Asset, AssetCategory } from "@/types/asset";

type AssetPreviewModalProps = {
  assetId: string | null;
  onClose: () => void;
};

export function AssetPreviewModal({ assetId, onClose }: AssetPreviewModalProps) {
  const assets = useAssetStore((s) => s.assets);
  const updateAssetMetadata = useAssetStore((s) => s.updateAssetMetadata);
  const archiveAsset = useAssetStore((s) => s.archiveAsset);

  const liveAsset = assetId ? getAssetById(assets, assetId) : undefined;

  // Keeps the last-viewed asset rendered while the modal plays its close
  // transition, since `assetId` (and therefore `liveAsset`) goes null first.
  const [displayAsset, setDisplayAsset] = useState<Asset | undefined>(undefined);

  const [isEditing, setIsEditing] = useState(false);
  const [confirmingArchive, setConfirmingArchive] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<AssetCategory | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (liveAsset) {
      setDisplayAsset(liveAsset);
      setName(liveAsset.name);
      setCategory(liveAsset.category);
      setTags(liveAsset.tags);
      setIsEditing(false);
      setConfirmingArchive(false);
      setTouched(false);
    }
  }, [liveAsset]);

  if (!displayAsset) return null;

  const isNameValid = name.trim().length > 0;

  function handleClose() {
    setIsEditing(false);
    setConfirmingArchive(false);
    onClose();
  }

  function handleSave() {
    setTouched(true);
    if (!isNameValid || !category || !displayAsset) return;
    updateAssetMetadata(displayAsset.id, { name, category, tags });
    setIsEditing(false);
  }

  function handleArchive() {
    if (!displayAsset) return;
    archiveAsset(displayAsset.id);
    handleClose();
  }

  return (
    <Modal
      open={Boolean(assetId)}
      onClose={handleClose}
      title={isEditing ? "Edit Asset Metadata" : displayAsset.name}
      description={isEditing ? "Update the name, category, or tags for this asset." : undefined}
    >
      {isEditing ? (
        <div className="flex flex-col gap-5">
          <AssetMetadataForm
            name={name}
            onNameChange={setName}
            category={category}
            onCategoryChange={setCategory}
            tags={tags}
            onTagsChange={setTags}
            nameError={touched && !isNameValid ? "Asset name is required." : undefined}
            categoryError={touched && !category ? "Category is required." : undefined}
          />
          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-control border border-border px-4 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-control border border-border">
            <AssetPreviewSwatch asset={displayAsset} iconClassName="h-12 w-12" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Meta label="Category" value={ASSET_CATEGORY_META[displayAsset.category].label} />
            <Meta label="Type" value={ASSET_FILE_TYPE_LABEL[displayAsset.type]} />
            <Meta label="Dimensions" value={formatDimensions(displayAsset.dimensions)} />
            <Meta label="File size" value={formatFileSize(displayAsset.size)} />
            <Meta label="Added" value={formatDate(displayAsset.createdAt)} />
            <Meta label="Last updated" value={formatRelativeTime(displayAsset.updatedAt)} />
          </div>

          {displayAsset.tags.length > 0 ? (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-caption font-medium text-foreground-secondary">
                <Tag className="h-3.5 w-3.5" />
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {displayAsset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-1 text-small text-foreground-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>

            {confirmingArchive ? (
              <div className="flex items-center gap-2 rounded-control border border-warning-muted bg-warning-muted/40 px-3 py-2">
                <span className="text-caption text-warning">Archive this asset?</span>
                <button
                  type="button"
                  onClick={handleArchive}
                  className="rounded-control bg-danger px-3 py-1.5 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-danger/90"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingArchive(false)}
                  className="rounded-control border border-border px-3 py-1.5 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingArchive(true)}
                className="inline-flex items-center gap-1.5 rounded-control border border-border px-4 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-danger-muted hover:text-danger"
              >
                <Archive className="h-3.5 w-3.5" />
                Archive
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-small text-foreground-muted">{label}</p>
      <p className="mt-0.5 font-medium text-foreground">{value}</p>
    </div>
  );
}
