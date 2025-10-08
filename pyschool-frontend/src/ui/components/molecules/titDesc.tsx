import React from 'react';
import Title from '@/ui/components/atoms/title'
import Descp from '@/ui/components/atoms/description'

interface TitleAndDescrProps {
    title: string
    descr: string
}

const TitleAndDescr: React.FC<TitleAndDescrProps> = ({
    title = '',
    descr = ''
})=> {
  return (
    <><Title text={title} />
    <Descp text={descr} /></>
  );
}

export default TitleAndDescr;
