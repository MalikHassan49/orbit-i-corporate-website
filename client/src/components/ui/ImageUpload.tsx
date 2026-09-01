import { useRef, useState, type ChangeEvent } from 'react'
import { ImagePlus } from 'lucide-react'
import { getApiErrorMessage } from '@/utils/apiError'
import { uploadService } from '@/services/uploadService'
import { Button } from './Button'

interface ImageUploadProps {
  value?: string
  onUploadComplete: (url: string) => void
  disabled?: boolean
}

/** Reusable image uploader for admin-managed image fields. */
export function ImageUpload({ value, onUploadComplete, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)
    try {
      onUploadComplete(await uploadService.uploadImage(file))
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not upload the image.'))
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-[var(--color-text-primary)]">Profile picture</p>
      <div className="flex items-center gap-4">
        {value ? (
          <img src={value} alt="Profile preview" className="size-16 rounded-full border border-[var(--color-border)] object-cover" />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full border border-dashed border-[var(--color-border)] text-[var(--color-text-muted)]">
            <ImagePlus className="size-5" aria-hidden />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleChange}
          disabled={disabled || isUploading}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          isLoading={isUploading}
          disabled={disabled || isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {value ? 'Replace image' : 'Upload image'}
        </Button>
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">JPEG, PNG, or WebP up to 2MB.</p>
      {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
    </div>
  )
}
