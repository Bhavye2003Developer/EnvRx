import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: 'linear-gradient(135deg, #f87171 0%, #fb923c 50%, #fbbf24 100%)',
        borderRadius: 7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 15,
        letterSpacing: '-0.5px',
        color: '#09090b',
      }}
    >
      Rx
    </div>,
    { ...size }
  )
}
