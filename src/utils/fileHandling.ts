export const compressImage = async (file: File, maxSizeKB: number = 500): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        const maxDimension = 1200
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Compress to blob
        let quality = 0.8
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'))
              return
            }

            if (blob.size > maxSizeKB * 1024 && quality > 0.1) {
              quality -= 0.1
              canvas.toBlob(
                (newBlob) => {
                  if (newBlob) {
                    resolve(newBlob)
                  } else {
                    reject(new Error('Compression failed'))
                  }
                },
                'image/jpeg',
                quality
              )
            } else {
              resolve(blob)
            }
          },
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = event.target?.result as string
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024
}

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

export const compressAndValidateFile = async (
  file: File,
  maxSizeMB: number = 5,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']
): Promise<{ valid: boolean; file?: File; error?: string }> => {
  // Validate type
  if (!validateFileType(file, allowedTypes)) {
    return { valid: false, error: 'Invalid file type' }
  }

  // Validate size
  if (!validateFileSize(file, maxSizeMB)) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` }
  }

  // If it's an image, try to compress
  if (file.type.startsWith('image/')) {
    try {
      const compressed = await compressImage(file, maxSizeMB * 1024)
      const compressedFile = new File([compressed], file.name, { type: file.type })
      return { valid: true, file: compressedFile }
    } catch (error) {
      return { valid: false, error: 'Failed to compress image' }
    }
  }

  return { valid: true, file }
}
