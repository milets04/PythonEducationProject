'use client';
import CourseView from '@/ui/components/templates/CourseView';
import { withTeacherAuth } from '@/hoc/withTeachersAuth';

export default withTeacherAuth(CourseView);