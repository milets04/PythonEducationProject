'use client';

import EdTeacherPage from '@/ui/components/templates/edTeacherPage';
import { withTeacherAuth } from '@/hoc/withTeachersAuth';

export default withTeacherAuth(EdTeacherPage);