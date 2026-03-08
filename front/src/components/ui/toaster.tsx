import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = (props: ToasterProps) => (
  <Sonner
    theme="dark"
    position="top-right"
    richColors
    closeButton
    toastOptions={{
      style: {
        background: '#353d54',
        color: '#c5efec',
        border: '1px solid rgba(140, 244, 238, 0.28)',
      },
    }}
    {...props}
  />
)

export { Toaster }
