type Props = {
	isOpen: boolean,
	onClose: () => void,
	children: React.ReactNode
}

export function Popup({ isOpen, onClose, children }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
