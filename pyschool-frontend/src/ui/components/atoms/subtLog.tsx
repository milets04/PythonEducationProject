
interface SubtitleProps {
  text: string;
  className?: string;
}

const Subtitle: React.FC<SubtitleProps> = ({
  text,
  className = '',
}) => {
  return (
    <label className={`text-sm font-tLog text-tLog ${className}`}>
      {text}
    </label>
  );
};

export default Subtitle;