// lib/fonts.ts
import localFont from 'next/font/local'

export const clashDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/clash-display/ClashDisplay-Variable.ttf',
      style: 'normal',
    },
  ],
  variable: '--font-clash-display',
  display: 'swap',
})
