import GoBackArrow from "../register/_components/goBackArrow";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100%] min-h-[100vh] w-[100%] overflow-hidden bg-primary-50 p-6 md:p-9">
      <GoBackArrow />
      {children}
    </div>
  );
}