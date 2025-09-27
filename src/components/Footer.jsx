const Footer = () => {
  return (
    <footer className="flex justify-center items-center h-[45px] bg-muted  text-sm text-muted-foreground py-2">
      <p>&copy; {new Date().getFullYear()} Rentofix. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
