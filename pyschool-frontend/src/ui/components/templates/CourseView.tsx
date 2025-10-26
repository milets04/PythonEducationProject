import Sidebar from '@/ui/components/organisms/sidebar';
import NavegationArrows from "@/ui/components/atoms/navegationArrows";
import React, { useState } from 'react';
import UnitySelector, { UnityOption } from "@/ui/components/atoms/unitySelector";

export default function CourseView() {
  const handlePrevious = () => {
    console.log('Previous clicked');
  };
  
  const handleNext = () => {
    console.log('Next clicked');
  };

  const MOCK_UNITS: UnityOption[] = [
    { value: "unit-1", label: "Unity 1" },
    { value: "unit-2", label: "Unity 2" },
    { value: "unit-3", label: "Unity 3" },
    { value: "unit-4", label: "Unity 4: Final" }
  ];

  const [selectedValue, setSelectedValue] = useState<string>("unit-1");

  const handleSelection = (newValue: string) => {
    console.log("El nuevo valor seleccionado es:", newValue);
    setSelectedValue(newValue);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        onAddContent={() => console.log('Add Content clicked')}
        onActualContent={() => console.log('Actual Content clicked')}
        onStudents={() => console.log('Students clicked')}
        onConfiguration={() => console.log('Configuration clicked')}
        onLogout={() => console.log('Logout clicked')}
      />

      <main className="flex-1 flex flex-col" style={{ backgroundColor: '#C9DDDC' }}>
        
        <div className="px-6 py-4">
          <UnitySelector
            value={selectedValue}      
            options={MOCK_UNITS}      
            onChange={handleSelection}  
          />
        </div>

        <div className="flex-1 px-6 pb-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm h-full p-6 flex flex-col">
            
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold whitespace-nowrap">TOPIC 1</h2>   
              <div className="flex-1 flex justify-center">
                <NavegationArrows onPrevious={handlePrevious} onNext={handleNext} />
              </div>
            </div>
            
            <div className="bg-gray-200 flex-1 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Course content will be displayed here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}