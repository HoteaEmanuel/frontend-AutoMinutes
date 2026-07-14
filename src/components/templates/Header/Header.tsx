const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="absolute">{children}</div>
    </div>
  );
};

export default Header;
