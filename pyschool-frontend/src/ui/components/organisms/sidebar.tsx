import React from 'react';
import Image from 'next/image';
import ContentButtons from '@/ui/components/molecules/navbarButtons';
import CustomButton from '@/ui/components/atoms/btnOthers';

interface SidebarProps {
  onAddContent?: () => void;
  onActualContent?: () => void;
  onStudents?: () => void;
  onConfiguration?: () => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onAddContent,
  onActualContent,
  onStudents,
  onConfiguration,
  onLogout,
}) => {
  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
      <div className="flex flex-col">
        <div className="flex justify-center py-6">
          <Image
            src="/images/logoPySon.png"
            alt="PY Son Logo"
            width={180}
            height={150}
            priority
          />
        </div>

        <div>
          <ContentButtons
            onAddContent={onAddContent}
            onActualContent={onActualContent}
            onStudents={onStudents}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-6">
        <CustomButton
          text="Configuration"
          backgroundColor="#1e3a8a"
          textColor="#ffffff"
          onClick={onConfiguration}
          className="w-full"
        />
        <CustomButton
          text="Log out"
          backgroundColor="#1e3a8a"
          textColor="#ffffff"
          onClick={onLogout}
          className="w-full"
        />
      </div>
    </aside>
  );
};

export default Sidebar;