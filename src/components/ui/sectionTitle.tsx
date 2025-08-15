// src/components/ui/SectionTitle.tsx
type Props = { children: React.ReactNode };
const SectionTitle = ({ children }: Props) => (
  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">{children}</h2>
);
export default SectionTitle;
