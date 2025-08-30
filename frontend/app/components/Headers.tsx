export interface HeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: string;
}

export const H1 = ({ children, ...props }: HeaderProps) => {
  return (
    <h1>
      <span
        className={`bg-gradient-to-r from-orange-500 to-blue-500 text-white px-4 py-3 text-4xl font-bold  ${
          props.className || ""
        }`}
      >
        {children}
      </span>
    </h1>
  );
};

export const H2 = ({ children, ...props }: HeaderProps) => {
  return (
    <h2
      className={`text-orange-500 pt-2 pb-1 text-2xl font-bold ${
        props.className || ""
      }`}
    >
      {children}
    </h2>
  );
};

export const H3 = ({ children, ...props }: HeaderProps) => {
  return (
    <h3
      className={`text-black pt-2 pb-1 text-xl font-bold ${
        props.className || ""
      }`}
    >
      {children}
    </h3>
  );
};

export const H4 = ({ children, ...props }: HeaderProps) => {
  return <h4 className="text-gray-800 pt-1 text-lg font-bold">{children}</h4>;
};
