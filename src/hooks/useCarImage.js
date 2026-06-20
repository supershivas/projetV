import { useState, useEffect } from 'react'
import { getWikiSlug } from '../utils/wikiSlugs'

const cache = {}

export function useCarImage(marque, modele) {
  const key = `${marque}_${modele}`
  const [src, setSrc] = useState(cache[key] ?? null)
  const [loading, setLoading] = useState(!cache[key])

  useEffect(() => {
    if (cache[key]) { setSrc(cache[key]); setLoading(false); return }
    const slug = getWikiSlug(marque, modele)
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`
    let cancelled = false
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const imgSrc = data?.thumbnail?.source ?? null
        cache[key] = imgSrc
        setSrc(imgSrc)
        setLoading(false)
      })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [key, marque, modele])

  return { src, loading }
}
