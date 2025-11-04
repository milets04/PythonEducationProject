'use client';
import CreateTopicLayout from '@/ui/components/templates/createTopicTemplate'; 
import { withTeacherAuth } from '@/hoc/withTeachersAuth';

export default withTeacherAuth(CreateTopicLayout);