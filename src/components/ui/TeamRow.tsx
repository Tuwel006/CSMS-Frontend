interface TeamRowProps {
  name: string;
  logo: string;
  onError: () => void;
  showLogo: boolean;
}

const TeamRow = ({ name, logo, onError, showLogo }: TeamRowProps) => (
  <div className="flex items-center gap-2">
    {showLogo && (
      <img
        src={logo}
        alt={name}
        onError={onError}
        className="h-6 w-6 object-contain"
      />
    )}
    <span className="font-medium text-gray-800 dark:text-white">{name}</span>
  </div>
);

export default TeamRow;
