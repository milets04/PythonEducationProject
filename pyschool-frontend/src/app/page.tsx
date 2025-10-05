import Image from "next/image";
import { MdAlternateEmail } from 'react-icons/md'; // @ símbolo
import { FiLock } from 'react-icons/fi'; // Candado
import InputIcon from "@/ui/components/atoms/icons";

export default function Home() {
  return (
    <div>
      <InputIcon icon={MdAlternateEmail} />
      <InputIcon icon={FiLock} />
    </div>
  );
}
