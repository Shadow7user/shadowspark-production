/**
 * Server-side image utilities
 * Use these in server components only
 */

/**
 * Server-side blur placeholder generator
 * Use in server components to generate blur data
 * 
 * Usage:
 * const blurDataURL = await getBlurDataURL('/images/hero.jpg')
 * <OptimizedImage src="/images/hero.jpg" blurDataURL={blurDataURL} ... />
 */
export async function getBlurDataURL(src: string): Promise<string | undefined> {
  try {
    // Dynamic import to avoid bundling on client
    const { getPlaiceholder } = await import('plaiceholder')
    
    // Handle both local and remote images
    let buffer: Buffer
    
    if (src.startsWith('http')) {
      const response = await fetch(src)
      buffer = Buffer.from(await response.arrayBuffer())
    } else {
      const fs = await import('fs/promises')
      const path = await import('path')
      const imagePath = path.join(process.cwd(), 'public', src)
      buffer = await fs.readFile(imagePath)
    }
    
    const { base64 } = await getPlaiceholder(buffer, { size: 10 })
    return base64
  } catch (error) {
    console.warn('Failed to generate blur placeholder:', error)
    return undefined
  }
}

/**
 * Sanity image helper
 * Generates optimized URLs for Sanity images
 */
export function getSanityImageUrl(
  image: { asset?: { _ref?: string } },
  projectId: string,
  dataset: string = 'production'
): string | null {
  if (!image?.asset?._ref) return null
  
  const ref = image.asset._ref
  const [, id, dimensions, format] = ref.split('-')
  
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
}
