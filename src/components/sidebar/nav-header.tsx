import { Button } from "../ui/button";

const NavHeader = () => {
  return (
    <Button
      variant="ghost"
      className="group px-2 relative w-full bg-muted/10 overflow-hidden rounded-lg py-3 h-auto transition-all duration-200 shadow-xl"
    >
      <div className="relative flex items-center gap-3">
        <div className="relative h-9 w-9 overflow-hidden rounded-lg">
          <img
            src="/icon.png"
            className=" object-cover transition-transform duration-200 group-hover:scale-110"
            alt="User Icon"
          />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate text-3xl font-semibold mb-0.5">Lory</span>
          <span className="truncate text-xs text-muted-foreground font-medium">
            V1.0.0
          </span>
        </div>
      </div>
    </Button>
  );
};

export default NavHeader;
