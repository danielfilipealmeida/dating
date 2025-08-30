
/**
 * Creates a component for warpping content in a consistent layout.
 * The Content component centers the content and applies a background color.
 * It is designed to be used as a wrapper for other components or pages.
 * 
 * @param {children: React.ReactNode} - An object containing children elements to be rendered inside the Content component.
 * The Content component is a wrapper that provides a consistent layout for the application.
 * It centers the content and applies a background color.
 * 
 * @returns 
 */
export default function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="max-w-7xl w-full px-4 py-4 text-gray-800">
        {children}
      </div>
    </div>
  );
}