import { BiSolidPencil } from "react-icons/bi";
import { IoMdTrash } from "react-icons/io";
import InputIcon from "./icons";

interface IconsEdTeacherProps {
  onEdit?: () => void;
  onDelete?: () => void;
  classNameEdit?: string;
  classNameDelete?: string;
}

const IconsEdTeacher: React.FC<IconsEdTeacherProps> = ({
  onEdit = () => console.log("Edit?"),
  onDelete = () => console.log("Delete?"),
  classNameEdit = '',
  classNameDelete = '',
}) => {
  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={onEdit}
        aria-label="Edit"
        className="hover:scale-105 transition-transform"
      >
        <InputIcon icon={BiSolidPencil} className={classNameEdit} />
      </button>
      <button
        onClick={onDelete}
        aria-label="Delete"
        className="hover:scale-105 transition-transform"
      >
        <InputIcon icon={IoMdTrash} className={classNameDelete} />
      </button>
    </div>
  );
};

export default IconsEdTeacher;
