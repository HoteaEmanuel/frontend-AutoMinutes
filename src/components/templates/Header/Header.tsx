const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="absolute inset-x-0">{children}</div>
    </div>
  );
};

export default Header;
